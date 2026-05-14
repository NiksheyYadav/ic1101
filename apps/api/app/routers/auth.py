import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import User
from app.db.session import get_db
from app.security.auth import create_access_token

router = APIRouter()


class TokenRequest(BaseModel):
    user_id: str
    role: str = "viewer"


class LoginRequest(BaseModel):
    email: str
    password: str


@router.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "auth-service"}


@router.post("/token")
def issue_token(payload: TokenRequest) -> dict[str, str]:
    return {"access_token": create_access_token(payload.user_id, payload.role), "token_type": "bearer"}


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    # Very basic manual sign-in (for demo purposes)
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Create a new user automatically
        user = User(
            email=payload.email,
            display_name=payload.email.split("@")[0]
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Issue token
    return {"access_token": create_access_token(str(user.id), "owner"), "token_type": "bearer"}


@router.get("/me")
def me() -> dict[str, str]:
    return {"message": "use bearer token to access protected resources"}


@router.get("/github/login")
def github_login():
    client_id = os.getenv("GITHUB_CLIENT_ID")
    frontend_url = os.getenv("NEXT_PUBLIC_URL", "http://localhost:3000")
    if not client_id:
        return RedirectResponse(f"{frontend_url}/signin?error=github_not_configured")
    redirect_uri = os.getenv("GITHUB_CALLBACK_URL", "http://localhost:8000/v1/auth/github/callback")
    url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=user:email"
    return RedirectResponse(url)


@router.get("/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    frontend_url = os.getenv("NEXT_PUBLIC_URL", "http://localhost:3000")

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={"client_id": client_id, "client_secret": client_secret, "code": code}
        )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token from GitHub")

        user_res = await client.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}"})
        github_user = user_res.json()

        email = github_user.get("email")
        if not email:
            emails_res = await client.get("https://api.github.com/user/emails", headers={"Authorization": f"Bearer {access_token}"})
            emails = emails_res.json()
            primary = next((e for e in emails if e.get("primary")), None)
            email = primary.get("email") if primary else (emails[0].get("email") if emails else None)

        if not email:
            raise HTTPException(status_code=400, detail="No email available from GitHub")

    github_id = str(github_user.get("id"))
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = db.query(User).filter(User.github_id == github_id).first()
    if not user:
        user = User(
            email=email,
            display_name=github_user.get("name") or github_user.get("login"),
            github_id=github_id,
            avatar_url=github_user.get("avatar_url")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not user.github_id:
            user.github_id = github_id
            user.avatar_url = github_user.get("avatar_url")
            db.commit()

    jwt_token = create_access_token(str(user.id), "owner")
    return RedirectResponse(f"{frontend_url}/callback?token={jwt_token}")
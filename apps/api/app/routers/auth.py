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


@router.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "auth-service"}


@router.post("/token")
def issue_token(payload: TokenRequest) -> dict[str, str]:
    return {"access_token": create_access_token(payload.user_id, payload.role), "token_type": "bearer"}


@router.get("/me")
def me() -> dict[str, str]:
    return {"message": "use bearer token to access protected resources"}


@router.get("/github/login")
def github_login():
    """Redirect to GitHub OAuth consent screen."""
    client_id = os.getenv("GITHUB_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="GitHub Client ID not configured")
        
    # We use our own callback URL
    redirect_uri = os.getenv("GITHUB_CALLBACK_URL", "http://localhost:8000/v1/auth/github/callback")
    url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=user:email"
    return RedirectResponse(url)


@router.get("/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    """Handle GitHub callback, exchange code, create user, issue JWT."""
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    frontend_url = os.getenv("NEXT_PUBLIC_URL", "http://localhost:3000")
    
    async with httpx.AsyncClient() as client:
        # 1. Exchange code for access_token
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code
            }
        )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token from GitHub")
            
        # 2. Get user profile
        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        github_user = user_res.json()
        
        # 3. Get user email
        email = github_user.get("email")
        if not email:
            emails_res = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            emails = emails_res.json()
            primary = next((e for e in emails if e.get("primary")), None)
            if primary:
                email = primary.get("email")
            elif emails:
                email = emails[0].get("email")
                
        if not email:
            raise HTTPException(status_code=400, detail="No email available from GitHub")
            
    # 4. Check if user exists in DB or create
    github_id = str(github_user.get("id"))
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = db.query(User).filter(User.github_id == github_id).first()
        
    if not user:
        # Create new user
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
        # Update github_id/avatar if not set
        if not user.github_id:
            user.github_id = github_id
            user.avatar_url = github_user.get("avatar_url")
            db.commit()
            
    # 5. Issue our JWT (give them owner role by default for demo)
    jwt_token = create_access_token(user.id, "owner")
    
    # 6. Redirect to frontend with token
    return RedirectResponse(f"{frontend_url}/callback?token={jwt_token}")

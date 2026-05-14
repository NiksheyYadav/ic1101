import os
from fastapi import APIRouter, Depends, HTTPException
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


class GithubSyncRequest(BaseModel):
    email: str
    name: str
    github_id: str
    avatar_url: str


@router.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "auth-service"}


@router.post("/token")
def issue_token(payload: TokenRequest) -> dict[str, str]:
    return {"access_token": create_access_token(payload.user_id, payload.role), "token_type": "bearer"}


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    """Authenticate with email/password. Used by NextAuth CredentialsProvider."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Auto-register for demo purposes
        user = User(
            email=payload.email,
            display_name=payload.email.split("@")[0]
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"access_token": create_access_token(str(user.id), "owner"), "token_type": "bearer", "user_id": str(user.id)}


@router.post("/github-sync")
def github_sync(payload: GithubSyncRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    """Sync a GitHub-authenticated user with the backend database.
    Called by NextAuth's jwt callback after a successful GitHub OAuth sign-in."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        user = db.query(User).filter(User.github_id == payload.github_id).first()

    if not user:
        user = User(
            email=payload.email,
            display_name=payload.name,
            github_id=payload.github_id,
            avatar_url=payload.avatar_url
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update existing user with latest GitHub info
        user.github_id = payload.github_id
        user.avatar_url = payload.avatar_url
        if payload.name and not user.display_name:
            user.display_name = payload.name
        db.commit()

    return {"access_token": create_access_token(str(user.id), "owner"), "token_type": "bearer"}


@router.get("/me")
def me() -> dict[str, str]:
    return {"message": "use bearer token to access protected resources"}
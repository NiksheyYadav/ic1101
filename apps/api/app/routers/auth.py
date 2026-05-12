from fastapi import APIRouter
from pydantic import BaseModel

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

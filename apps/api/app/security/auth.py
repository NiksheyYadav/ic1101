import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, Header, HTTPException, status

SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret")
ALGORITHM = "HS256"


@dataclass
class Principal:
    user_id: str
    role: str


def create_access_token(user_id: str, role: str, expires_minutes: int = 60) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=expires_minutes)).timestamp()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_principal(
    authorization: str | None = Header(default=None),
    token: str | None = None,  # query-param fallback for downloads opened in new tabs
) -> Principal:
    if authorization and authorization.startswith("Bearer "):
        raw_token = authorization.replace("Bearer ", "", 1)
    elif token:
        raw_token = token
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="missing bearer token")

    token = raw_token
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token") from exc

    return Principal(user_id=str(decoded.get("sub", "")), role=str(decoded.get("role", "viewer")))


def require_role(*allowed_roles: str):
    def checker(principal: Principal = Depends(get_principal)) -> Principal:
        if principal.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="insufficient role")
        return principal

    return checker

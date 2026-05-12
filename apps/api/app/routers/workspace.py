import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Workspace
from app.db.session import get_db
from app.schemas.workspace import WorkspaceCreate, WorkspaceRead
from app.security.auth import Principal, require_role

router = APIRouter()


@router.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "workspace-service"}


@router.get("", response_model=list[WorkspaceRead])
def list_workspaces(_principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")), db: Session = Depends(get_db)) -> list[Workspace]:
    return db.query(Workspace).order_by(Workspace.created_at.desc()).limit(100).all()


@router.post("", response_model=WorkspaceRead, status_code=status.HTTP_201_CREATED)
def create_workspace(payload: WorkspaceCreate, _principal: Principal = Depends(require_role("owner", "admin")), db: Session = Depends(get_db)) -> Workspace:
    exists = db.query(Workspace).filter(Workspace.slug == payload.slug).first()
    if exists:
        raise HTTPException(status_code=409, detail="workspace slug already exists")

    workspace = Workspace(
        name=payload.name,
        slug=payload.slug,
        owner_user_id=parse_uuid(payload.owner_user_id, "owner_user_id"),
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return workspace


def parse_uuid(raw: str, field_name: str) -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"invalid {field_name}") from exc

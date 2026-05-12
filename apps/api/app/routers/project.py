import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.models import Project, Workspace
from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectRead
from app.security.auth import Principal, require_role

router = APIRouter()


@router.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "project-service"}


@router.get("", response_model=list[ProjectRead])
def list_projects(
    workspace_id: str | None = Query(default=None),
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> list[Project]:
    query = db.query(Project).order_by(Project.created_at.desc()).limit(100)
    if workspace_id:
        query = query.filter(Project.workspace_id == parse_uuid(workspace_id, "workspace_id"))
    return query.all()


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, _principal: Principal = Depends(require_role("owner", "admin", "member")), db: Session = Depends(get_db)) -> Project:
    workspace = db.query(Workspace).filter(Workspace.id == parse_uuid(payload.workspace_id, "workspace_id")).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="workspace not found")

    project = Project(
        workspace_id=parse_uuid(payload.workspace_id, "workspace_id"),
        name=payload.name,
        description=payload.description,
        created_by=parse_uuid(payload.created_by, "created_by") if payload.created_by else None,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def parse_uuid(raw: str, field_name: str) -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"invalid {field_name}") from exc

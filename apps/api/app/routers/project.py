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
) -> list[ProjectRead]:
    query = db.query(Project).order_by(Project.created_at.desc()).limit(100)
    if workspace_id:
        query = query.filter(Project.workspace_id == workspace_id)
    items = query.all()
    return [ProjectRead(id=p.id, workspace_id=p.workspace_id, name=p.name, description=p.description, created_by=p.created_by) for p in items]


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    _principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> ProjectRead:
    workspace = db.query(Workspace).filter(Workspace.id == payload.workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="workspace not found")

    project = Project(
        workspace_id=payload.workspace_id,
        name=payload.name,
        description=payload.description,
        created_by=payload.created_by,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectRead(id=project.id, workspace_id=project.workspace_id, name=project.name, description=project.description, created_by=project.created_by)

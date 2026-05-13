import json

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.models import PreprocessingPipeline
from app.db.session import get_db
from app.security.auth import Principal, require_role

router = APIRouter()


class PipelineCreate(BaseModel):
    workspace_id: str
    name: str
    steps: list[dict] = Field(default_factory=list)


class PipelineRead(BaseModel):
    id: str
    workspace_id: str
    name: str
    steps: list[dict]
    created_at: str | None = None


@router.post("", response_model=PipelineRead, status_code=status.HTTP_201_CREATED)
def create_pipeline(
    payload: PipelineCreate,
    principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> PipelineRead:
    item = PreprocessingPipeline(
        workspace_id=payload.workspace_id,
        name=payload.name,
        steps_json=json.dumps(payload.steps),
        created_by=principal.user_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_read(item)


@router.get("", response_model=list[PipelineRead])
def list_pipelines(
    workspace_id: str | None = None,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> list[PipelineRead]:
    query = db.query(PreprocessingPipeline)
    if workspace_id:
        query = query.filter(PreprocessingPipeline.workspace_id == workspace_id)
    return [_to_read(i) for i in query.all()]


def _to_read(p: PreprocessingPipeline) -> PipelineRead:
    return PipelineRead(
        id=p.id,
        workspace_id=p.workspace_id,
        name=p.name,
        steps=json.loads(p.steps_json) if p.steps_json else [],
        created_at=str(p.created_at) if p.created_at else None,
    )

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
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


def parse_uuid(raw: str, field_name: str) -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"invalid {field_name}") from exc


@router.post("", response_model=PipelineRead, status_code=status.HTTP_201_CREATED)
def create_pipeline(payload: PipelineCreate, principal: Principal = Depends(require_role("owner", "admin", "member")), db: Session = Depends(get_db)) -> PipelineRead:
    item = PreprocessingPipeline(
        workspace_id=parse_uuid(payload.workspace_id, "workspace_id"),
        name=payload.name,
        steps_json=payload.steps,
        created_by=parse_uuid(principal.user_id, "user_id"),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return PipelineRead(id=str(item.id), workspace_id=str(item.workspace_id), name=item.name, steps=item.steps_json)


@router.get("", response_model=list[PipelineRead])
def list_pipelines(workspace_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")), db: Session = Depends(get_db)) -> list[PipelineRead]:
    items = db.query(PreprocessingPipeline).filter(PreprocessingPipeline.workspace_id == parse_uuid(workspace_id, "workspace_id")).all()
    return [PipelineRead(id=str(i.id), workspace_id=str(i.workspace_id), name=i.name, steps=i.steps_json) for i in items]

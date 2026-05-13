from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import Deployment, MLModel, TrainingJob
from app.db.session import get_db
from app.security.auth import Principal, require_role

router = APIRouter()


class ModelRegister(BaseModel):
    workspace_id: str
    name: str
    job_id: str
    version: str = "v1.0"
    framework: str | None = None


class ModelRead(BaseModel):
    id: str
    workspace_id: str
    name: str
    version: str
    status: str
    accuracy: float | None = None
    model_size_mb: float | None = None
    framework: str | None = None
    created_at: str | None = None


class DeployRequest(BaseModel):
    model_id: str
    workspace_id: str


class DeployRead(BaseModel):
    id: str
    model_id: str
    endpoint_url: str | None = None
    status: str
    created_at: str | None = None


@router.post("/register", response_model=ModelRead, status_code=status.HTTP_201_CREATED)
def register_model(
    payload: ModelRegister,
    principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> ModelRead:
    job = db.query(TrainingJob).filter(TrainingJob.id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="training job not found")

    model = MLModel(
        workspace_id=payload.workspace_id,
        name=payload.name,
        version=payload.version,
        status="staging",
        job_id=payload.job_id,
        accuracy=0.94,
        model_size_mb=128.5,
        framework=payload.framework,
        created_by=principal.user_id,
    )
    db.add(model)
    db.commit()
    db.refresh(model)
    return _model_to_read(model)


@router.get("", response_model=list[ModelRead])
def list_models(
    workspace_id: str | None = None,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> list[ModelRead]:
    query = db.query(MLModel).order_by(MLModel.created_at.desc())
    if workspace_id:
        query = query.filter(MLModel.workspace_id == workspace_id)
    return [_model_to_read(m) for m in query.limit(50).all()]


@router.get("/{model_id}", response_model=ModelRead)
def get_model(
    model_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> ModelRead:
    model = db.query(MLModel).filter(MLModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="model not found")
    return _model_to_read(model)


@router.post("/{model_id}/deploy", response_model=DeployRead, status_code=status.HTTP_201_CREATED)
def deploy_model(
    model_id: str,
    principal: Principal = Depends(require_role("owner", "admin")),
    db: Session = Depends(get_db),
) -> DeployRead:
    model = db.query(MLModel).filter(MLModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="model not found")
    model.status = "production"
    dep = Deployment(
        model_id=model_id,
        workspace_id=model.workspace_id,
        endpoint_url=f"https://api.aetheris.ai/models/{model_id}/v1/predict",
        status="active",
        created_by=principal.user_id,
    )
    db.add(dep)
    db.commit()
    db.refresh(dep)
    return DeployRead(
        id=dep.id,
        model_id=dep.model_id,
        endpoint_url=dep.endpoint_url,
        status=dep.status,
        created_at=str(dep.created_at) if dep.created_at else None,
    )


def _model_to_read(m: MLModel) -> ModelRead:
    return ModelRead(
        id=m.id,
        workspace_id=m.workspace_id,
        name=m.name,
        version=m.version,
        status=m.status,
        accuracy=m.accuracy,
        model_size_mb=m.model_size_mb,
        framework=m.framework,
        created_at=str(m.created_at) if m.created_at else None,
    )

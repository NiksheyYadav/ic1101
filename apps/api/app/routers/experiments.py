import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import Experiment, TrainingJob
from app.db.session import get_db
from app.security.auth import Principal, require_role

router = APIRouter()


class ExperimentRead(BaseModel):
    id: str
    workspace_id: str
    job_id: str
    name: str
    metrics: dict | None = None
    created_at: str | None = None


class CompareRequest(BaseModel):
    experiment_ids: list[str]


@router.get("", response_model=list[ExperimentRead])
def list_experiments(
    workspace_id: str | None = None,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> list[ExperimentRead]:
    query = db.query(Experiment).order_by(Experiment.created_at.desc())
    if workspace_id:
        query = query.filter(Experiment.workspace_id == workspace_id)
    return [_exp_to_read(e) for e in query.limit(50).all()]


@router.post("/compare")
def compare_experiments(
    payload: CompareRequest,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> list[ExperimentRead]:
    exps = db.query(Experiment).filter(Experiment.id.in_(payload.experiment_ids)).all()
    return [_exp_to_read(e) for e in exps]


@router.post("/from-job/{job_id}", response_model=ExperimentRead, status_code=201)
def create_experiment_from_job(
    job_id: str,
    principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> ExperimentRead:
    job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    exp = Experiment(
        workspace_id=job.workspace_id,
        job_id=job.id,
        name=f"exp-{job.id[:8]}",
        metrics_json=json.dumps({"accuracy": 0.94, "loss": 0.12, "f1": 0.91}),
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return _exp_to_read(exp)


def _exp_to_read(e: Experiment) -> ExperimentRead:
    return ExperimentRead(
        id=e.id,
        workspace_id=e.workspace_id,
        job_id=e.job_id,
        name=e.name,
        metrics=json.loads(e.metrics_json) if e.metrics_json else None,
        created_at=str(e.created_at) if e.created_at else None,
    )

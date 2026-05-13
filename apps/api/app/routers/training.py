import asyncio
import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.models import TrainingEvent, TrainingJob
from app.db.session import get_db
from app.security.auth import Principal, require_role

router = APIRouter()


class TrainingJobCreate(BaseModel):
    workspace_id: str
    dataset_version_id: str | None = None
    model_type: str | None = None
    epochs: int = Field(default=5, ge=1, le=500)
    config: dict | None = None


class TrainingJobRead(BaseModel):
    id: str
    workspace_id: str
    status: str
    progress: int
    epochs: int
    current_epoch: int
    model_type: str | None = None
    created_at: str | None = None


@router.post("", response_model=TrainingJobRead, status_code=status.HTTP_201_CREATED)
async def create_job(
    payload: TrainingJobCreate,
    principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> TrainingJobRead:
    job = TrainingJob(
        workspace_id=payload.workspace_id,
        dataset_version_id=payload.dataset_version_id,
        model_type=payload.model_type,
        status="queued",
        progress=0,
        epochs=payload.epochs,
        current_epoch=0,
        config_json=json.dumps(payload.config) if payload.config else None,
        created_by=principal.user_id,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    asyncio.create_task(_run_training(job.id))
    return _job_to_read(job)


@router.get("", response_model=list[TrainingJobRead])
def list_jobs(
    workspace_id: str | None = None,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> list[TrainingJobRead]:
    query = db.query(TrainingJob).order_by(TrainingJob.created_at.desc())
    if workspace_id:
        query = query.filter(TrainingJob.workspace_id == workspace_id)
    return [_job_to_read(j) for j in query.limit(50).all()]


@router.get("/{job_id}", response_model=TrainingJobRead)
def get_job(
    job_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> TrainingJobRead:
    job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return _job_to_read(job)


@router.post("/{job_id}/pause")
def pause_job(
    job_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> dict:
    job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    job.status = "paused"
    db.commit()
    return {"status": job.status}


@router.post("/{job_id}/resume")
async def resume_job(
    job_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> dict:
    job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    job.status = "running"
    db.commit()
    asyncio.create_task(_run_training(job.id))
    return {"status": job.status}


@router.post("/{job_id}/cancel")
def cancel_job(
    job_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> dict:
    job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    job.status = "cancelled"
    db.commit()
    return {"status": job.status}


@router.get("/{job_id}/events")
async def stream_events(
    job_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    async def event_gen():
        last_id = 0
        while True:
            events = (
                db.query(TrainingEvent)
                .filter(TrainingEvent.job_id == job_id, TrainingEvent.id > last_id)
                .order_by(TrainingEvent.id.asc())
                .all()
            )
            for event in events:
                last_id = event.id
                yield f"data: {event.payload_json}\n\n"
            job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
            if job and job.status in {"succeeded", "failed", "cancelled"} and not events:
                break
            await asyncio.sleep(0.2)

    return StreamingResponse(event_gen(), media_type="text/event-stream")


# ---------- helpers ----------

def _job_to_read(job: TrainingJob) -> TrainingJobRead:
    return TrainingJobRead(
        id=job.id,
        workspace_id=job.workspace_id,
        status=job.status,
        progress=job.progress,
        epochs=job.epochs,
        current_epoch=job.current_epoch,
        model_type=job.model_type,
        created_at=str(job.created_at) if job.created_at else None,
    )


async def _run_training(job_id: str) -> None:
    """Simulated training loop — runs in background."""
    from app.db.session import SessionLocal

    db = SessionLocal()
    try:
        job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
        if not job:
            return
        job.status = "running"
        db.commit()

        for epoch in range(1, job.epochs + 1):
            db.refresh(job)
            if job.status in {"cancelled", "paused"}:
                _append_event(db, job.id, "state", {"status": job.status})
                return

            await asyncio.sleep(0.25)
            loss = round(1.0 / epoch, 5)
            acc = round(min(0.99, 0.5 + (epoch / (job.epochs * 1.8))), 5)
            job.current_epoch = epoch
            job.progress = int(epoch * 100 / job.epochs)
            db.commit()
            _append_event(db, job.id, "metric", {"epoch": epoch, "loss": loss, "accuracy": acc, "progress": job.progress})

        job.status = "succeeded"
        db.commit()
        _append_event(db, job.id, "state", {"status": "succeeded"})
    finally:
        db.close()


def _append_event(db, job_id: str, event_type: str, payload: dict) -> None:
    event = TrainingEvent(job_id=job_id, event_type=event_type, payload_json=json.dumps(payload))
    db.add(event)
    db.commit()

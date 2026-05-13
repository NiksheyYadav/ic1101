import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.models import TrainingEvent, TrainingJob
from app.db.session import get_db
from app.security.auth import Principal, require_role
from app.services.trainer import get_model_zip_path, start_training
from app.services.training_status import status_manager

router = APIRouter()


class TrainingJobCreate(BaseModel):
    workspace_id: str = "default"
    dataset_version_id: str | None = None
    model_type: str | None = "image"
    epochs: int = Field(default=10, ge=1, le=500)
    batch_size: int = Field(default=32, ge=1, le=512)
    learning_rate: float = Field(default=0.001, gt=0, lt=1)
    optimizer: str = "AdamW"
    precision: str = "fp32"
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
        config_json=json.dumps({
            "model_type": payload.model_type,
            "epochs": payload.epochs,
            "batch_size": payload.batch_size,
            "learning_rate": payload.learning_rate,
            "optimizer": payload.optimizer,
            "precision": payload.precision,
            **(payload.config or {}),
        }),
        created_by=principal.user_id,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Start real PyTorch training in background thread
    training_config = {
        "model_type": payload.model_type or "image",
        "epochs": payload.epochs,
        "batch_size": payload.batch_size,
        "learning_rate": payload.learning_rate,
        "optimizer": payload.optimizer,
        "precision": payload.precision,
        "num_classes": 5 if payload.model_type == "image" else 3,
    }

    try:
        start_training(job.id, training_config)
        job.status = "running"
        db.commit()
    except RuntimeError as exc:
        job.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=str(exc))

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


@router.get("/{job_id}/status")
def get_training_status(
    job_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> dict:
    """Live polling endpoint — safe to call every 1 second."""
    live = status_manager.get_dict(job_id)
    if live:
        # Sync status back to DB
        job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
        if job:
            job.progress = live["progress"]
            job.current_epoch = live["epoch"]
            if live["status"] in ("completed", "failed"):
                job.status = "succeeded" if live["status"] == "completed" else "failed"
            else:
                job.status = live["status"]
            db.commit()
        return live

    # Fallback: return basic info from DB if no live status (old/finished jobs)
    job = db.query(TrainingJob).filter(TrainingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return {
        "job_id": job.id,
        "status": "completed" if job.status == "succeeded" else job.status,
        "epoch": job.current_epoch,
        "total_epochs": job.epochs,
        "loss": 0,
        "accuracy": 0,
        "progress": job.progress,
        "cpu_usage": 0,
        "ram_usage": 0,
        "device": "cpu",
        "cuda_status": "offline",
        "current_model": job.model_type or "",
        "elapsed_time": 0,
        "estimated_time_remaining": 0,
        "training_complete": job.status == "succeeded",
        "logs": [],
        "epoch_history": [],
    }


@router.get("/{job_id}/download")
def download_model(
    job_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member")),
) -> FileResponse:
    """Download the trained model as a ZIP file."""
    zip_path = get_model_zip_path(job_id)
    if not zip_path:
        raise HTTPException(status_code=404, detail="Model not ready or job not found")
    return FileResponse(
        path=str(zip_path),
        filename=f"aetheris_model_{job_id[:8]}.zip",
        media_type="application/zip",
    )


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
    # Signal the trainer thread
    st = status_manager.get(job_id)
    if st:
        st.status = "paused"
        st.add_log("Training paused by user")
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
    # Signal the trainer thread
    st = status_manager.get(job_id)
    if st:
        st.status = "cancelled"
        st.add_log("Training cancelled by user")
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

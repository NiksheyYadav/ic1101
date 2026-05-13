import asyncio
import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.models import TrainingJob
from app.db.session import get_db
from app.security.auth import Principal, require_role
from app.services.training_jobs import service

router = APIRouter()


class TrainingJobCreate(BaseModel):
    workspace_id: str
    dataset_version_id: str | None = None
    epochs: int = Field(default=5, ge=1, le=500)


class TrainingJobRead(BaseModel):
    id: str
    status: str
    progress: int
    epochs: int
    current_epoch: int


def parse_uuid(raw: str, field_name: str) -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"invalid {field_name}") from exc


@router.post("", response_model=TrainingJobRead, status_code=status.HTTP_201_CREATED)
async def create_job(payload: TrainingJobCreate, principal: Principal = Depends(require_role("owner", "admin", "member")), db: Session = Depends(get_db)) -> TrainingJobRead:
    job = service.create(
        db=db,
        workspace_id=parse_uuid(payload.workspace_id, "workspace_id"),
        created_by=parse_uuid(principal.user_id, "user_id"),
        dataset_version_id=parse_uuid(payload.dataset_version_id, "dataset_version_id") if payload.dataset_version_id else None,
        epochs=payload.epochs,
    )
    asyncio.create_task(service.run(str(job.id)))
    return TrainingJobRead(id=str(job.id), status=job.status, progress=job.progress, epochs=job.epochs, current_epoch=job.current_epoch)


@router.get("/{job_id}", response_model=TrainingJobRead)
def get_job(job_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")), db: Session = Depends(get_db)) -> TrainingJobRead:
    job = db.query(TrainingJob).filter(TrainingJob.id == parse_uuid(job_id, "job_id")).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return TrainingJobRead(id=str(job.id), status=job.status, progress=job.progress, epochs=job.epochs, current_epoch=job.current_epoch)


@router.post("/{job_id}/pause")
def pause_job(job_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member")), db: Session = Depends(get_db)) -> dict:
    job = db.query(TrainingJob).filter(TrainingJob.id == parse_uuid(job_id, "job_id")).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    job.status = "paused"
    db.commit()
    return {"status": job.status}


@router.post("/{job_id}/resume")
async def resume_job(job_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member")), db: Session = Depends(get_db)) -> dict:
    job = db.query(TrainingJob).filter(TrainingJob.id == parse_uuid(job_id, "job_id")).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    job.status = "running"
    db.commit()
    asyncio.create_task(service.run(str(job.id)))
    return {"status": job.status}


@router.post("/{job_id}/cancel")
def cancel_job(job_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member")), db: Session = Depends(get_db)) -> dict:
    job = db.query(TrainingJob).filter(TrainingJob.id == parse_uuid(job_id, "job_id")).first()
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    job.status = "cancelled"
    db.commit()
    return {"status": job.status}


@router.get("/{job_id}/events")
async def stream_events(job_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")), db: Session = Depends(get_db)) -> StreamingResponse:
    parsed = parse_uuid(job_id, "job_id")

    async def event_gen():
        last_id = 0
        while True:
            events = service.read_events(db, parsed, after_id=last_id)
            for event in events:
                last_id = event.id
                payload = json.dumps({"id": event.id, "type": event.event_type, **event.payload_json})
                yield f"data: {payload}\n\n"
            job = db.query(TrainingJob).filter(TrainingJob.id == parsed).first()
            if job and job.status in {"succeeded", "failed", "cancelled"} and not events:
                break
            await asyncio.sleep(0.2)

    return StreamingResponse(event_gen(), media_type="text/event-stream")

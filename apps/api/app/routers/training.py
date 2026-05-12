import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.security.auth import Principal, require_role
from app.services.training_jobs import jobs

router = APIRouter()


class TrainingJobRead(BaseModel):
    id: str
    status: str
    progress: int


@router.post("", response_model=TrainingJobRead, status_code=status.HTTP_201_CREATED)
async def create_job(_principal: Principal = Depends(require_role("owner", "admin", "member"))) -> TrainingJobRead:
    job = jobs.create()
    job.status = "running"
    jobs.start_job(job.id)
    return TrainingJobRead(id=job.id, status=job.status, progress=job.progress)


@router.get("/{job_id}", response_model=TrainingJobRead)
def get_job(job_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer"))) -> TrainingJobRead:
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return TrainingJobRead(id=job.id, status=job.status, progress=job.progress)


@router.get("/{job_id}/events")
async def stream_events(job_id: str, _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer"))) -> StreamingResponse:
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job not found")

    async def event_gen():
        index = 0
        while True:
            while index < len(job.events):
                payload = json.dumps(job.events[index])
                yield f"data: {payload}\n\n"
                index += 1
            if job.status == "succeeded" and index >= len(job.events):
                break
            await asyncio.sleep(0.1)

    return StreamingResponse(event_gen(), media_type="text/event-stream")

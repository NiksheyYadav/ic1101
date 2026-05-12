import asyncio
import uuid
from dataclasses import dataclass, field


@dataclass
class TrainingJob:
    id: str
    status: str
    progress: int = 0
    events: list[dict] = field(default_factory=list)


class TrainingJobStore:
    def __init__(self) -> None:
        self.jobs: dict[str, TrainingJob] = {}

    async def run_job(self, job_id: str) -> None:
        job = self.jobs[job_id]
        for i in range(1, 6):
            await asyncio.sleep(0.1)
            job.progress = i * 20
            event = {"type": "metric", "progress": job.progress, "loss": round(1.0 / i, 4)}
            job.events.append(event)
        job.status = "succeeded"
        job.events.append({"type": "state", "status": "succeeded"})

    def create(self) -> TrainingJob:
        job = TrainingJob(id=str(uuid.uuid4()), status="queued")
        self.jobs[job.id] = job
        return job

    def get(self, job_id: str) -> TrainingJob | None:
        return self.jobs.get(job_id)


jobs = TrainingJobStore()

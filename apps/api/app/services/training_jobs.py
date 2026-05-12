import threading
import time
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
        self._lock = threading.Lock()

    def run_job(self, job_id: str) -> None:
        try:
            for i in range(1, 6):
                time.sleep(0.1)
                with self._lock:
                    job = self.jobs.get(job_id)
                    if not job:
                        return
                    job.progress = i * 20
                    event = {"type": "metric", "progress": job.progress, "loss": round(1.0 / i, 4)}
                    job.events.append(event)
            with self._lock:
                job = self.jobs.get(job_id)
                if not job:
                    return
                job.status = "succeeded"
                job.events.append({"type": "state", "status": "succeeded"})
        except Exception as exc:
            with self._lock:
                job = self.jobs.get(job_id)
                if job:
                    job.status = "failed"
                    job.events.append({"type": "state", "status": "failed", "error": str(exc)})

    def start_job(self, job_id: str) -> None:
        with self._lock:
            job = self.jobs[job_id]
            job.status = "running"
        worker = threading.Thread(target=self.run_job, args=(job_id,), daemon=True)
        worker.start()

    def create(self) -> TrainingJob:
        job = TrainingJob(id=str(uuid.uuid4()), status="queued")
        with self._lock:
            self.jobs[job.id] = job
        return job

    def get(self, job_id: str) -> TrainingJob | None:
        with self._lock:
            return self.jobs.get(job_id)

    def read(self, job_id: str) -> dict | None:
        with self._lock:
            job = self.jobs.get(job_id)
            if not job:
                return None
            return {"id": job.id, "status": job.status, "progress": job.progress}

    def events_since(self, job_id: str, index: int) -> tuple[list[dict], bool] | tuple[None, None]:
        with self._lock:
            job = self.jobs.get(job_id)
            if not job:
                return None, None
            events = list(job.events[index:])
            done = job.status in {"succeeded", "failed"} and index == len(job.events)
            return events, done


jobs = TrainingJobStore()

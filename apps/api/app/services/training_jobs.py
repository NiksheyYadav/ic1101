import asyncio
import json
import uuid

from sqlalchemy.orm import Session

from app.db.models import DatasetVersion, TrainingEvent, TrainingJob
from app.db.session import SessionLocal


class TrainingJobService:
    @staticmethod
    def create(db: Session, workspace_id: uuid.UUID, created_by: uuid.UUID | None, dataset_version_id: uuid.UUID | None, epochs: int) -> TrainingJob:
        job = TrainingJob(
            workspace_id=workspace_id,
            dataset_version_id=dataset_version_id,
            status="queued",
            progress=0,
            epochs=epochs,
            current_epoch=0,
            created_by=created_by,
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def append_event(db: Session, job_id: uuid.UUID, event_type: str, payload: dict) -> None:
        event = TrainingEvent(job_id=job_id, event_type=event_type, payload_json=payload)
        db.add(event)
        db.commit()

    @staticmethod
    async def run(job_id: str) -> None:
        db = SessionLocal()
        try:
            job = db.query(TrainingJob).filter(TrainingJob.id == uuid.UUID(job_id)).first()
            if not job:
                return

            job.status = "running"
            db.commit()

            base_loss = 1.0
            if job.dataset_version_id:
                version = db.query(DatasetVersion).filter(DatasetVersion.id == job.dataset_version_id).first()
                if version and version.rows_count > 0:
                    base_loss = max(0.2, min(2.0, version.columns_count / max(1, version.rows_count)))

            for epoch in range(1, job.epochs + 1):
                db.refresh(job)
                if job.status in {"cancelled", "paused"}:
                    TrainingJobService.append_event(db, job.id, "state", {"status": job.status})
                    return

                await asyncio.sleep(0.25)
                loss = round(base_loss / epoch, 5)
                acc = round(min(0.99, 0.5 + (epoch / (job.epochs * 1.8))), 5)
                job.current_epoch = epoch
                job.progress = int(epoch * 100 / job.epochs)
                db.commit()
                TrainingJobService.append_event(
                    db,
                    job.id,
                    "metric",
                    {"epoch": epoch, "loss": loss, "accuracy": acc, "progress": job.progress},
                )

            job.status = "succeeded"
            db.commit()
            TrainingJobService.append_event(db, job.id, "state", {"status": "succeeded"})
        finally:
            db.close()

    @staticmethod
    def read_events(db: Session, job_id: uuid.UUID, after_id: int = 0) -> list[TrainingEvent]:
        return (
            db.query(TrainingEvent)
            .filter(TrainingEvent.job_id == job_id, TrainingEvent.id > after_id)
            .order_by(TrainingEvent.id.asc())
            .all()
        )


service = TrainingJobService()

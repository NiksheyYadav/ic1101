"""Thread-safe shared training status manager.

Maintains a ``dict[job_id, TrainingStatus]`` that is written to by the
background training thread and read by the polling API endpoint every
second.  All access is guarded by a ``threading.Lock``.
"""

from __future__ import annotations

import threading
import time
from dataclasses import dataclass, field
from typing import Any


@dataclass
class TrainingStatus:
    job_id: str
    status: str = "idle"                    # idle | running | completed | failed | cancelled | paused
    epoch: int = 0
    total_epochs: int = 0
    loss: float = 0.0
    accuracy: float = 0.0
    progress: int = 0                       # 0-100
    cpu_usage: float = 0.0
    ram_usage: float = 0.0
    device: str = "cpu"
    cuda_status: str = "offline"
    current_model: str = ""
    elapsed_time: float = 0.0               # seconds
    estimated_time_remaining: float = 0.0   # seconds
    training_complete: bool = False
    logs: list[str] = field(default_factory=list)
    epoch_history: list[dict[str, Any]] = field(default_factory=list)
    start_time: float = 0.0                 # internal, not exposed via API

    # ---------- convenience helpers ----------

    def add_log(self, msg: str) -> None:
        ts = time.strftime("%H:%M:%S")
        self.logs.insert(0, f"[{ts}] {msg}")
        if len(self.logs) > 100:
            self.logs = self.logs[:100]

    def to_dict(self) -> dict[str, Any]:
        return {
            "job_id": self.job_id,
            "status": self.status,
            "epoch": self.epoch,
            "total_epochs": self.total_epochs,
            "loss": round(self.loss, 5),
            "accuracy": round(self.accuracy, 5),
            "progress": self.progress,
            "cpu_usage": round(self.cpu_usage, 1),
            "ram_usage": round(self.ram_usage, 1),
            "device": self.device,
            "cuda_status": self.cuda_status,
            "current_model": self.current_model,
            "elapsed_time": round(self.elapsed_time, 1),
            "estimated_time_remaining": round(self.estimated_time_remaining, 1),
            "training_complete": self.training_complete,
            "logs": self.logs[:50],
            "epoch_history": self.epoch_history,
        }


class TrainingStatusManager:
    """Singleton-style thread-safe status store."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._statuses: dict[str, TrainingStatus] = {}

    def create(self, job_id: str, total_epochs: int, model_name: str) -> TrainingStatus:
        with self._lock:
            st = TrainingStatus(
                job_id=job_id,
                total_epochs=total_epochs,
                current_model=model_name,
                start_time=time.time(),
            )
            self._statuses[job_id] = st
            return st

    def get(self, job_id: str) -> TrainingStatus | None:
        with self._lock:
            return self._statuses.get(job_id)

    def get_dict(self, job_id: str) -> dict[str, Any] | None:
        with self._lock:
            st = self._statuses.get(job_id)
            return st.to_dict() if st else None

    def update(self, job_id: str, **kwargs: Any) -> None:
        with self._lock:
            st = self._statuses.get(job_id)
            if st:
                for k, v in kwargs.items():
                    if hasattr(st, k):
                        setattr(st, k, v)

    def remove(self, job_id: str) -> None:
        with self._lock:
            self._statuses.pop(job_id, None)


# Global singleton
status_manager = TrainingStatusManager()

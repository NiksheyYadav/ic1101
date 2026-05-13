"""System telemetry endpoint — exposes live CPU/RAM/CUDA status."""

import platform

import psutil
from fastapi import APIRouter

try:
    import torch

    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

router = APIRouter()


@router.get("/info")
def system_info() -> dict:
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    cuda_available = TORCH_AVAILABLE and torch.cuda.is_available()
    device_name = torch.cuda.get_device_name(0) if cuda_available else "CPU"

    return {
        "cpu_usage": psutil.cpu_percent(interval=0),
        "cpu_count": psutil.cpu_count(logical=True),
        "ram_usage": mem.percent,
        "ram_total_gb": round(mem.total / (1024 ** 3), 1),
        "ram_used_gb": round(mem.used / (1024 ** 3), 1),
        "disk_usage": disk.percent,
        "disk_total_gb": round(disk.total / (1024 ** 3), 1),
        "cuda_available": cuda_available,
        "cuda_status": "active" if cuda_available else "offline",
        "device": "cuda" if cuda_available else "cpu",
        "device_name": device_name,
        "gpu_memory_used_mb": round(torch.cuda.memory_allocated(0) / (1024 ** 2), 1) if cuda_available else 0,
        "gpu_memory_total_mb": round(torch.cuda.get_device_properties(0).total_mem / (1024 ** 2), 1) if cuda_available else 0,
        "platform": platform.system(),
        "python_version": platform.python_version(),
        "torch_version": torch.__version__ if TORCH_AVAILABLE else "not installed",
    }

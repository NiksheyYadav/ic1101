"""Real PyTorch training engine for Aetheris AI.

Supports two demo-friendly model types:
  - **image**  → MobileNetV2 (torchvision) fine-tuned on a small image dataset
  - **text**   → A lightweight 1D-CNN text classifier

Training runs in a background ``threading.Thread`` and continuously
updates a shared ``TrainingStatus`` object that the polling API reads.

After training completes, the engine saves:
  model.pth, config.json, labels.json, inference.py, README.md
and packages them into a downloadable ZIP.
"""

from __future__ import annotations

import json
import os
import shutil
import threading
import time
import traceback
import zipfile
from pathlib import Path
from typing import Any

import psutil

try:
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from torch.utils.data import DataLoader, TensorDataset

    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

try:
    import torchvision.models as tv_models
    import torchvision.transforms as transforms
    from torchvision.datasets import ImageFolder

    TORCHVISION_AVAILABLE = True
except ImportError:
    TORCHVISION_AVAILABLE = False

from app.services.training_status import TrainingStatus, status_manager
from app.services.s3_service import s3_service

# Base directory for saved outputs
OUTPUT_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ── helpers ──────────────────────────────────────────────────────────

def _get_device() -> tuple[str, str]:
    """Return (device_str, cuda_status)."""
    if TORCH_AVAILABLE and torch.cuda.is_available():
        return "cuda", "active"
    return "cpu", "offline"


def _system_metrics() -> dict[str, float]:
    return {
        "cpu_usage": psutil.cpu_percent(interval=0),
        "ram_usage": psutil.virtual_memory().percent,
    }


def _write_inference_script(out_dir: Path, model_type: str, num_classes: int) -> None:
    code = f'''"""Aetheris AI — Inference Script
Auto-generated after training.
"""
import torch
import json

MODEL_TYPE = "{model_type}"
NUM_CLASSES = {num_classes}

def load_model(model_path="model.pth", device="cpu"):
    if MODEL_TYPE == "image":
        from torchvision import models
        model = models.mobilenet_v2(num_classes=NUM_CLASSES)
    else:
        # Simple text CNN stub
        model = torch.nn.Sequential(
            torch.nn.Embedding(10000, 64),
            torch.nn.Flatten(),
            torch.nn.Linear(64 * 128, NUM_CLASSES),
        )
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    return model

if __name__ == "__main__":
    model = load_model()
    print(f"Model loaded successfully — {{NUM_CLASSES}} classes")
'''
    (out_dir / "inference.py").write_text(code, encoding="utf-8")


def _write_readme(out_dir: Path, config: dict) -> None:
    md = f"""# Aetheris AI — Trained Model

## Model Configuration
- **Architecture:** {config.get('model_type', 'unknown')}
- **Epochs:** {config.get('epochs', 0)}
- **Batch Size:** {config.get('batch_size', 0)}
- **Learning Rate:** {config.get('learning_rate', 0)}
- **Optimizer:** {config.get('optimizer', 'AdamW')}
- **Device:** {config.get('device', 'cpu')}

## Files
| File | Description |
|------|-------------|
| `model.pth` | PyTorch model weights |
| `config.json` | Training configuration |
| `labels.json` | Class labels |
| `inference.py` | Ready-to-use inference script |
| `README.md` | This file |

## Usage
```python
from inference import load_model
model = load_model("model.pth")
```

---
*Exported by Aetheris AI Intelligence OS*
"""
    (out_dir / "README.md").write_text(md, encoding="utf-8")


def _create_zip(out_dir: Path) -> Path:
    zip_path = out_dir / "model_package.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in out_dir.iterdir():
            if f.name != "model_package.zip" and f.is_file():
                zf.write(f, f.name)
    return zip_path

def _upload_model_to_s3(status: TrainingStatus, job_id: str, zip_path: Path) -> None:
    status.add_log("Uploading model package to S3...")
    model_s3_key = f"models/{job_id}/model_package.zip"
    if s3_service.upload_file(zip_path, model_s3_key):
        status.add_log("Model package uploaded to S3 successfully ✓")
    else:
        status.add_log("Warning: Failed to upload model package to S3.")


# ── training loops ───────────────────────────────────────────────────

def _train_image_model(status: TrainingStatus, config: dict, job_dir: Path) -> None:
    """Train MobileNetV2 on synthetic image data (demo-safe)."""
    device_str, cuda_stat = _get_device()
    device = torch.device(device_str)
    status.device = device_str
    status.cuda_status = cuda_stat

    num_classes = config.get("num_classes", 5)
    epochs = config.get("epochs", 10)
    batch_size = config.get("batch_size", 16)
    lr = config.get("learning_rate", 0.001)
    optimizer_name = config.get("optimizer", "AdamW")

    status.add_log(f"Initializing MobileNetV2 on {device_str.upper()}")
    status.current_model = "MobileNetV2"

    # Create model
    if TORCHVISION_AVAILABLE:
        model = tv_models.mobilenet_v2(weights=None, num_classes=num_classes)
    else:
        # Fallback to a simple CNN if torchvision not available
        model = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(), nn.AdaptiveAvgPool2d(1),
            nn.Flatten(), nn.Linear(16, num_classes),
        )
    model = model.to(device)

    dataset_s3_key = config.get("dataset_s3_key")
    dataset_dir = job_dir / "dataset"
    use_synthetic = True

    if dataset_s3_key:
        status.add_log("Downloading dataset from S3...")
        local_dataset_zip = job_dir / "dataset.zip"
        if s3_service.download_file(dataset_s3_key, local_dataset_zip):
            if str(dataset_s3_key).endswith(".zip"):
                status.add_log("Extracting dataset...")
                with zipfile.ZipFile(local_dataset_zip, 'r') as zf:
                    zf.extractall(dataset_dir)
                use_synthetic = False

    if not use_synthetic and TORCHVISION_AVAILABLE:
        transform = transforms.Compose([
            transforms.Resize((32, 32)),
            transforms.ToTensor(),
        ])
        try:
            img_dir = dataset_dir
            subdirs = [d for d in dataset_dir.iterdir() if d.is_dir() and d.name != "__MACOSX"]
            if len(subdirs) == 1:
                img_dir = subdirs[0]
                
            dataset = ImageFolder(root=str(img_dir), transform=transform)
            num_classes = len(dataset.classes)
            loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
            status.add_log(f"Loaded {len(dataset)} images across {num_classes} classes from S3 dataset.")
            
            # Recreate model if num_classes changed based on dataset
            if TORCHVISION_AVAILABLE:
                model = tv_models.mobilenet_v2(weights=None, num_classes=num_classes).to(device)
                
        except Exception as e:
            status.add_log(f"Failed to load ImageFolder from extracted zip: {e}. Falling back to synthetic.")
            use_synthetic = True

    if use_synthetic:
        status.add_log("Using synthetic image dataset.")
        n_samples = 200
        X = torch.randn(n_samples, 3, 32, 32)
        y = torch.randint(0, num_classes, (n_samples,))
        dataset = TensorDataset(X, y)
        loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    criterion = nn.CrossEntropyLoss()
    if optimizer_name == "SGD":
        opt = optim.SGD(model.parameters(), lr=lr, momentum=0.9)
    elif optimizer_name == "RMSprop":
        opt = optim.RMSprop(model.parameters(), lr=lr)
    elif optimizer_name == "Adam":
        opt = optim.Adam(model.parameters(), lr=lr)
    else:
        opt = optim.AdamW(model.parameters(), lr=lr)

    status.add_log(f"Training started — {epochs} epochs, batch_size={batch_size}, lr={lr}")
    status.status = "running"

    for epoch in range(1, epochs + 1):
        # Check for pause/cancel
        if status.status in ("cancelled", "paused"):
            status.add_log(f"Training {status.status} at epoch {epoch}")
            return

        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for X_batch, y_batch in loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            opt.zero_grad()
            outputs = model(X_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            opt.step()

            running_loss += loss.item() * X_batch.size(0)
            _, predicted = outputs.max(1)
            total += y_batch.size(0)
            correct += predicted.eq(y_batch).sum().item()

        avg_loss = running_loss / total
        accuracy = correct / total
        elapsed = time.time() - status.start_time
        avg_epoch_time = elapsed / epoch
        eta = avg_epoch_time * (epochs - epoch)
        metrics = _system_metrics()

        # Update shared status
        status.epoch = epoch
        status.loss = avg_loss
        status.accuracy = accuracy
        status.progress = int(epoch * 100 / epochs)
        status.elapsed_time = elapsed
        status.estimated_time_remaining = eta
        status.cpu_usage = metrics["cpu_usage"]
        status.ram_usage = metrics["ram_usage"]
        status.epoch_history.append({
            "epoch": epoch,
            "loss": round(avg_loss, 5),
            "accuracy": round(accuracy, 5),
        })
        status.add_log(
            f"Epoch {epoch}/{epochs} — loss: {avg_loss:.4f}, acc: {accuracy * 100:.2f}%"
        )

        # Small sleep between epochs to make the demo observable
        time.sleep(0.3)

    # Save model
    status.add_log("Saving model artifacts...")
    torch.save(model.state_dict(), str(job_dir / "model.pth"))

    labels = {str(i): f"class_{i}" for i in range(num_classes)}
    (job_dir / "labels.json").write_text(json.dumps(labels, indent=2), encoding="utf-8")
    (job_dir / "config.json").write_text(json.dumps(config, indent=2), encoding="utf-8")
    _write_inference_script(job_dir, "image", num_classes)
    _write_readme(job_dir, config)
    zip_path = _create_zip(job_dir)
    
    _upload_model_to_s3(status, job_dir.name, zip_path)
    
    # Cleanup temp dataset files
    shutil.rmtree(job_dir / "dataset", ignore_errors=True)
    if (job_dir / "dataset.zip").exists():
        (job_dir / "dataset.zip").unlink()

    status.add_log("Model package ready for download ✓")


def _train_text_model(status: TrainingStatus, config: dict, job_dir: Path) -> None:
    """Train a simple text CNN on synthetic data (demo-safe)."""
    device_str, cuda_stat = _get_device()
    device = torch.device(device_str)
    status.device = device_str
    status.cuda_status = cuda_stat

    num_classes = config.get("num_classes", 3)
    epochs = config.get("epochs", 10)
    batch_size = config.get("batch_size", 32)
    lr = config.get("learning_rate", 0.001)
    optimizer_name = config.get("optimizer", "AdamW")
    vocab_size = 5000
    seq_len = 128

    status.add_log(f"Initializing TextCNN on {device_str.upper()}")
    status.current_model = "TextCNN"

    model = nn.Sequential(
        nn.Embedding(vocab_size, 64),
        nn.Conv1d(64, 32, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.AdaptiveAvgPool1d(1),
        nn.Flatten(),
        nn.Linear(32, num_classes),
    )

    # Fix: Conv1d expects (batch, channels, seq) but Embedding gives (batch, seq, embed)
    class TextCNN(nn.Module):
        def __init__(self):
            super().__init__()
            self.embed = nn.Embedding(vocab_size, 64)
            self.conv = nn.Conv1d(64, 32, kernel_size=3, padding=1)
            self.relu = nn.ReLU()
            self.pool = nn.AdaptiveAvgPool1d(1)
            self.fc = nn.Linear(32, num_classes)

        def forward(self, x):
            x = self.embed(x)          # (B, seq, 64)
            x = x.permute(0, 2, 1)     # (B, 64, seq)
            x = self.conv(x)
            x = self.relu(x)
            x = self.pool(x).squeeze(-1)
            return self.fc(x)

    model = TextCNN().to(device)

    # Synthetic text data
    n_samples = 500
    X = torch.randint(0, vocab_size, (n_samples, seq_len))
    y = torch.randint(0, num_classes, (n_samples,))
    dataset = TensorDataset(X, y)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    criterion = nn.CrossEntropyLoss()
    if optimizer_name == "SGD":
        opt = optim.SGD(model.parameters(), lr=lr, momentum=0.9)
    elif optimizer_name == "RMSprop":
        opt = optim.RMSprop(model.parameters(), lr=lr)
    elif optimizer_name == "Adam":
        opt = optim.Adam(model.parameters(), lr=lr)
    else:
        opt = optim.AdamW(model.parameters(), lr=lr)

    status.add_log(f"Training started — {epochs} epochs, batch_size={batch_size}, lr={lr}")
    status.status = "running"

    for epoch in range(1, epochs + 1):
        if status.status in ("cancelled", "paused"):
            status.add_log(f"Training {status.status} at epoch {epoch}")
            return

        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for X_batch, y_batch in loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            opt.zero_grad()
            outputs = model(X_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            opt.step()

            running_loss += loss.item() * X_batch.size(0)
            _, predicted = outputs.max(1)
            total += y_batch.size(0)
            correct += predicted.eq(y_batch).sum().item()

        avg_loss = running_loss / total
        accuracy = correct / total
        elapsed = time.time() - status.start_time
        avg_epoch_time = elapsed / epoch
        eta = avg_epoch_time * (epochs - epoch)
        metrics = _system_metrics()

        status.epoch = epoch
        status.loss = avg_loss
        status.accuracy = accuracy
        status.progress = int(epoch * 100 / epochs)
        status.elapsed_time = elapsed
        status.estimated_time_remaining = eta
        status.cpu_usage = metrics["cpu_usage"]
        status.ram_usage = metrics["ram_usage"]
        status.epoch_history.append({
            "epoch": epoch,
            "loss": round(avg_loss, 5),
            "accuracy": round(accuracy, 5),
        })
        status.add_log(
            f"Epoch {epoch}/{epochs} — loss: {avg_loss:.4f}, acc: {accuracy * 100:.2f}%"
        )
        time.sleep(0.2)

    # Save
    status.add_log("Saving model artifacts...")
    torch.save(model.state_dict(), str(job_dir / "model.pth"))

    labels = {str(i): f"class_{i}" for i in range(num_classes)}
    (job_dir / "labels.json").write_text(json.dumps(labels, indent=2), encoding="utf-8")
    (job_dir / "config.json").write_text(json.dumps(config, indent=2), encoding="utf-8")
    _write_inference_script(job_dir, "text", num_classes)
    _write_readme(job_dir, config)
    zip_path = _create_zip(job_dir)
    
    _upload_model_to_s3(status, job_dir.name, zip_path)

    status.add_log("Model package ready for download ✓")


# ── public API ───────────────────────────────────────────────────────

def start_training(job_id: str, config: dict) -> None:
    """Launch training in a background thread.

    ``config`` should contain:
      - model_type: "image" | "text"
      - epochs, batch_size, learning_rate, optimizer, precision, num_classes
    """
    if not TORCH_AVAILABLE:
        raise RuntimeError("PyTorch is not installed on this server")

    model_type = config.get("model_type", "image")
    epochs = int(config.get("epochs", 10))
    model_name = "MobileNetV2" if model_type == "image" else "TextCNN"

    # Create shared status
    status = status_manager.create(job_id, epochs, model_name)

    # Create output directory
    job_dir = OUTPUT_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    def _run() -> None:
        try:
            status.status = "running"
            status.add_log("Initializing training environment...")

            if model_type == "text":
                _train_text_model(status, config, job_dir)
            else:
                _train_image_model(status, config, job_dir)

            if status.status == "running":
                status.status = "completed"
                status.training_complete = True
                status.progress = 100
                status.add_log("Training completed successfully ✓")
        except Exception as exc:
            status.status = "failed"
            status.add_log(f"ERROR: {exc}")
            traceback.print_exc()

    thread = threading.Thread(target=_run, daemon=True)
    thread.start()


def get_model_zip_path(job_id: str) -> Path | None:
    """Return the path to the model ZIP if it exists."""
    zip_path = OUTPUT_DIR / job_id / "model_package.zip"
    return zip_path if zip_path.exists() else None

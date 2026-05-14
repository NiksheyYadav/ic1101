import json
import logging
import shutil
import tempfile
import time
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.services.models import TextCNN
from app.services.s3_service import s3_service

try:
    import torch
    import torchvision.models as tv_models
    import torchvision.transforms as transforms
    from PIL import Image

    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

logger = logging.getLogger(__name__)

# Basic in-memory cache for loaded models
# Key: job_id, Value: CachedModel
_MODEL_CACHE = {}
MAX_CACHE_SIZE = 3

@dataclass
class CachedModel:
    job_id: str
    model: Any
    model_type: str
    num_classes: int
    labels: dict[str, str]
    last_accessed: float


class ModelPredictor:
    def __init__(self):
        if not TORCH_AVAILABLE:
            logger.warning("PyTorch not available. Predictor will not work.")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu") if TORCH_AVAILABLE else None

    def _ensure_local_model(self, job_id: str) -> Path:
        """Download model ZIP from S3 if needed, and extract it to a temp dir."""
        temp_dir = Path(tempfile.gettempdir()) / f"aetheris_model_{job_id}"
        if (temp_dir / "model.pth").exists() and (temp_dir / "config.json").exists():
            return temp_dir

        temp_dir.mkdir(parents=True, exist_ok=True)
        zip_path = temp_dir / "model_package.zip"
        
        s3_key = f"models/{job_id}/model_package.zip"
        logger.info(f"Downloading model {job_id} from S3: {s3_key}")
        
        if not s3_service.download_file(s3_key, zip_path):
            raise ValueError(f"Model package for job {job_id} not found in S3")

        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(temp_dir)
            
        return temp_dir

    def _load_model_into_cache(self, job_id: str) -> CachedModel:
        if not TORCH_AVAILABLE:
            raise RuntimeError("PyTorch is not installed")

        if len(_MODEL_CACHE) >= MAX_CACHE_SIZE:
            # Evict LRU
            lru_job = min(_MODEL_CACHE.keys(), key=lambda k: _MODEL_CACHE[k].last_accessed)
            del _MODEL_CACHE[lru_job]
            logger.info(f"Evicted model {lru_job} from cache")

        model_dir = self._ensure_local_model(job_id)
        
        with open(model_dir / "config.json", "r") as f:
            config = json.load(f)
            
        with open(model_dir / "labels.json", "r") as f:
            labels = json.load(f)

        model_type = config.get("model_type", "image")
        num_classes = config.get("num_classes", len(labels))
        
        if model_type == "image":
            model = tv_models.mobilenet_v2(weights=None, num_classes=num_classes)
        else:
            model = TextCNN(vocab_size=5000, num_classes=num_classes)
            
        model.load_state_dict(torch.load(str(model_dir / "model.pth"), map_location=self.device))
        model.to(self.device)
        model.eval()

        cached_model = CachedModel(
            job_id=job_id,
            model=model,
            model_type=model_type,
            num_classes=num_classes,
            labels=labels,
            last_accessed=time.time()
        )
        _MODEL_CACHE[job_id] = cached_model
        return cached_model

    def predict(self, job_id: str, input_data: Any) -> dict[str, Any]:
        """Run prediction. input_data is a PIL Image or a text string."""
        start_time = time.time()
        
        if job_id not in _MODEL_CACHE:
            cached = self._load_model_into_cache(job_id)
        else:
            cached = _MODEL_CACHE[job_id]
            cached.last_accessed = time.time()

        model = cached.model
        model_type = cached.model_type

        try:
            if model_type == "image":
                # input_data is expected to be a PIL Image
                transform = transforms.Compose([
                    transforms.Resize((32, 32)),
                    transforms.ToTensor(),
                ])
                tensor_img = transform(input_data).unsqueeze(0).to(self.device)
                
                with torch.no_grad():
                    outputs = model(tensor_img)
                    
            elif model_type == "text":
                # input_data is a string
                # Fake tokenization for the demo
                tokens = [ord(c) % 5000 for c in str(input_data)[:128]]
                # pad or truncate
                if len(tokens) < 128:
                    tokens += [0] * (128 - len(tokens))
                else:
                    tokens = tokens[:128]
                    
                tensor_txt = torch.tensor(tokens).unsqueeze(0).to(self.device)
                
                with torch.no_grad():
                    outputs = model(tensor_txt)
            else:
                raise ValueError(f"Unknown model_type: {model_type}")

            # Calculate probabilities
            probs = torch.nn.functional.softmax(outputs, dim=1).squeeze().tolist()
            if not isinstance(probs, list):
                probs = [probs]
                
            pred_idx = int(torch.argmax(outputs, dim=1).item())
            confidence = float(probs[pred_idx])
            pred_class = cached.labels.get(str(pred_idx), f"class_{pred_idx}")

            latency_ms = int((time.time() - start_time) * 1000)
            
            return {
                "prediction": pred_class,
                "confidence": confidence,
                "latency_ms": latency_ms,
                "model_type": model_type
            }

        except Exception as e:
            logger.error(f"Prediction error for job {job_id}: {e}")
            raise

predictor = ModelPredictor()

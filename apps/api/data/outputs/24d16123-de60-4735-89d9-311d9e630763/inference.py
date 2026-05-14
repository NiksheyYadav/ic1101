"""Aetheris AI — Inference Script
Auto-generated after training.
"""
import torch
import json

MODEL_TYPE = "text"
NUM_CLASSES = 3

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
    print(f"Model loaded successfully — {NUM_CLASSES} classes")

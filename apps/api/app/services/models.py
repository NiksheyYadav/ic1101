import torch.nn as nn

class TextCNN(nn.Module):
    """A lightweight 1D-CNN text classifier."""
    def __init__(self, vocab_size: int = 5000, num_classes: int = 3):
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

import csv
import io
import uuid
from dataclasses import dataclass, field


@dataclass
class DatasetVersion:
    version: int
    filename: str
    rows: int
    columns: int
    headers: list[str]


@dataclass
class DatasetRecord:
    id: str
    name: str
    versions: list[DatasetVersion] = field(default_factory=list)


class DatasetStore:
    def __init__(self) -> None:
        self.datasets: dict[str, DatasetRecord] = {}

    def upload_csv(self, name: str, filename: str, content: bytes) -> DatasetRecord:
        text = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))
        rows = list(reader)
        if not reader.fieldnames:
            raise ValueError("missing headers")

        dataset = next((d for d in self.datasets.values() if d.name == name), None)
        if not dataset:
            dataset = DatasetRecord(id=str(uuid.uuid4()), name=name)
            self.datasets[dataset.id] = dataset

        dataset.versions.append(
            DatasetVersion(
                version=len(dataset.versions) + 1,
                filename=filename,
                rows=len(rows),
                columns=len(reader.fieldnames),
                headers=list(reader.fieldnames),
            )
        )
        return dataset

    def list(self) -> list[DatasetRecord]:
        return list(self.datasets.values())


store = DatasetStore()

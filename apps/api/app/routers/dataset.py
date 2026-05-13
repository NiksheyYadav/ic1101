import csv
import io
import json
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import Dataset, DatasetVersion
from app.db.session import get_db
from app.security.auth import Principal, require_role

router = APIRouter()


class DatasetVersionRead(BaseModel):
    version: int
    filename: str
    rows: int
    columns: int
    headers: list[str]


class DatasetRead(BaseModel):
    id: str
    workspace_id: str
    name: str
    versions: list[DatasetVersionRead]


@router.post("", response_model=DatasetRead, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    workspace_id: str = Form(...),
    name: str = Form(...),
    file: UploadFile = File(...),
    principal: Principal = Depends(require_role("owner", "admin", "member")),
    db: Session = Depends(get_db),
) -> DatasetRead:
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="only csv supported in m1")

    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode("utf-8")))
    rows = list(reader)
    if not reader.fieldnames:
        raise HTTPException(status_code=422, detail="missing headers")

    dataset = db.query(Dataset).filter(Dataset.workspace_id == workspace_id, Dataset.name == name).first()
    if not dataset:
        dataset = Dataset(workspace_id=workspace_id, name=name, created_by=principal.user_id)
        db.add(dataset)
        db.flush()

    current = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset.id).order_by(DatasetVersion.version.desc()).first()
    next_version = 1 if not current else current.version + 1
    record = DatasetVersion(
        dataset_id=dataset.id,
        version=next_version,
        filename=file.filename,
        rows_count=len(rows),
        columns_count=len(reader.fieldnames),
        headers_json=json.dumps(list(reader.fieldnames)),
    )
    db.add(record)
    db.commit()

    versions = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset.id).order_by(DatasetVersion.version.asc()).all()
    return DatasetRead(
        id=dataset.id,
        workspace_id=dataset.workspace_id,
        name=dataset.name,
        versions=[DatasetVersionRead(version=v.version, filename=v.filename, rows=v.rows_count, columns=v.columns_count, headers=json.loads(v.headers_json)) for v in versions],
    )


@router.get("", response_model=list[DatasetRead])
def list_datasets(
    workspace_id: str | None = None,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> list[DatasetRead]:
    query = db.query(Dataset)
    if workspace_id:
        query = query.filter(Dataset.workspace_id == workspace_id)
    datasets = query.all()
    result: list[DatasetRead] = []
    for ds in datasets:
        versions = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == ds.id).order_by(DatasetVersion.version.asc()).all()
        result.append(
            DatasetRead(
                id=ds.id,
                workspace_id=ds.workspace_id,
                name=ds.name,
                versions=[DatasetVersionRead(version=v.version, filename=v.filename, rows=v.rows_count, columns=v.columns_count, headers=json.loads(v.headers_json)) for v in versions],
            )
        )
    return result


@router.get("/{dataset_id}", response_model=DatasetRead)
def get_dataset(
    dataset_id: str,
    _principal: Principal = Depends(require_role("owner", "admin", "member", "viewer")),
    db: Session = Depends(get_db),
) -> DatasetRead:
    ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="dataset not found")
    versions = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == ds.id).order_by(DatasetVersion.version.asc()).all()
    return DatasetRead(
        id=ds.id,
        workspace_id=ds.workspace_id,
        name=ds.name,
        versions=[DatasetVersionRead(version=v.version, filename=v.filename, rows=v.rows_count, columns=v.columns_count, headers=json.loads(v.headers_json)) for v in versions],
    )

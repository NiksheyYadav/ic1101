import csv
import io
import json
import os
import shutil
import zipfile
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import Dataset, DatasetVersion
from app.db.session import get_db
from app.security.auth import Principal, require_role
from app.services.s3_service import s3_service

router = APIRouter()

DATASETS_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "datasets"
DATASETS_DIR.mkdir(parents=True, exist_ok=True)


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
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename required")
    if not (file.filename.endswith(".csv") or file.filename.endswith(".zip")):
        raise HTTPException(status_code=400, detail="Only .csv and .zip (image datasets) supported")

    dataset = db.query(Dataset).filter(Dataset.workspace_id == workspace_id, Dataset.name == name).first()
    if not dataset:
        dataset = Dataset(workspace_id=workspace_id, name=name, created_by=principal.user_id)
        db.add(dataset)
        db.flush()

    current = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset.id).order_by(DatasetVersion.version.desc()).first()
    next_version = 1 if not current else current.version + 1

    # Temporarily persist the file securely to local disk for validation
    dataset_dir = DATASETS_DIR / dataset.id / f"v{next_version}"
    dataset_dir.mkdir(parents=True, exist_ok=True)
    file_path = dataset_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Check file size for ZIPs (<100MB)
    if file.filename.endswith(".zip"):
        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        if file_size_mb > 100:
            shutil.rmtree(dataset_dir)
            raise HTTPException(status_code=400, detail="ZIP dataset must be under 100MB")

    # Parse and validate based on type
    rows_count = 0
    columns_count = 0
    headers = []
    
    if file.filename.endswith(".csv"):
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            reader = csv.reader(f)
            try:
                headers = next(reader)
                columns_count = len(headers)
                rows_count = sum(1 for _ in reader)
            except StopIteration:
                shutil.rmtree(dataset_dir)
                raise HTTPException(status_code=422, detail="Empty CSV file")
    elif file.filename.endswith(".zip"):
        try:
            with zipfile.ZipFile(file_path, "r") as zf:
                image_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".webp")
                valid_images = [n for n in zf.namelist() if n.lower().endswith(image_extensions) and not n.startswith("__MACOSX")]
                if not valid_images:
                    shutil.rmtree(dataset_dir)
                    raise HTTPException(status_code=422, detail="No valid images found in ZIP")
                
                # Extract class names from folder structure
                folders = {Path(img).parent.name for img in valid_images if Path(img).parent.name}
                headers = list(folders)
                columns_count = len(headers)
                rows_count = len(valid_images)
        except zipfile.BadZipFile:
            shutil.rmtree(dataset_dir)
            raise HTTPException(status_code=422, detail="Invalid ZIP file")

    # Upload to S3
    s3_key = f"datasets/{workspace_id}/{dataset.id}/v{next_version}/{file.filename}"
    upload_success = s3_service.upload_file(file_path, s3_key)
    
    # Cleanup local temp
    try:
        shutil.rmtree(dataset_dir)
    except Exception:
        pass
        
    if not upload_success:
        raise HTTPException(status_code=500, detail="Failed to upload dataset to S3")

    # Store S3 metadata in headers_json
    metadata = {
        "classes_or_columns": headers,
        "s3_key": s3_key,
        "is_zip": file.filename.endswith(".zip")
    }

    record = DatasetVersion(
        dataset_id=dataset.id,
        version=next_version,
        filename=file.filename,
        rows_count=rows_count,
        columns_count=columns_count,
        headers_json=json.dumps(metadata),
    )
    db.add(record)
    db.commit()

    versions = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset.id).order_by(DatasetVersion.version.asc()).all()
    return DatasetRead(
        id=dataset.id,
        workspace_id=dataset.workspace_id,
        name=dataset.name,
        versions=[DatasetVersionRead(
            version=v.version, 
            filename=v.filename, 
            rows=v.rows_count, 
            columns=v.columns_count, 
            headers=json.loads(v.headers_json).get("classes_or_columns", []) if isinstance(json.loads(v.headers_json), dict) else json.loads(v.headers_json)
        ) for v in versions],
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
                versions=[DatasetVersionRead(
                    version=v.version, 
                    filename=v.filename, 
                    rows=v.rows_count, 
                    columns=v.columns_count, 
                    headers=json.loads(v.headers_json).get("classes_or_columns", []) if isinstance(json.loads(v.headers_json), dict) else json.loads(v.headers_json)
                ) for v in versions],
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
        versions=[DatasetVersionRead(
            version=v.version, 
            filename=v.filename, 
            rows=v.rows_count, 
            columns=v.columns_count, 
            headers=json.loads(v.headers_json).get("classes_or_columns", []) if isinstance(json.loads(v.headers_json), dict) else json.loads(v.headers_json)
        ) for v in versions],
    )

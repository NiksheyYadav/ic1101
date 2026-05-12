from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel

from app.security.auth import Principal, require_role
from app.services.dataset_store import DatasetRecord, store

router = APIRouter()


class DatasetVersionRead(BaseModel):
    version: int
    filename: str
    rows: int
    columns: int
    headers: list[str]


class DatasetRead(BaseModel):
    id: str
    name: str
    versions: list[DatasetVersionRead]


@router.post("", response_model=DatasetRead, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    name: str = Form(...),
    file: UploadFile = File(...),
    _principal: Principal = Depends(require_role("owner", "admin", "member")),
) -> DatasetRecord:
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="only csv supported in m1")

    content = await file.read()
    try:
        dataset = store.upload_csv(name=name, filename=file.filename, content=content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return dataset


@router.get("", response_model=list[DatasetRead])
def list_datasets(_principal: Principal = Depends(require_role("owner", "admin", "member", "viewer"))) -> list[DatasetRecord]:
    return store.list()

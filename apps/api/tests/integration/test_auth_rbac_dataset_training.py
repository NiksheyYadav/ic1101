import io
import time

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def token(role: str = "admin") -> str:
    response = client.post("/v1/auth/token", json={"user_id": "00000000-0000-0000-0000-000000000001", "role": role})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_dataset_upload_requires_auth() -> None:
    response = client.get("/v1/datasets")
    assert response.status_code == 401


def test_dataset_upload_and_versioning_happy_path() -> None:
    t = token("member")
    files = {"file": ("sample.csv", io.BytesIO(b"a,b\n1,2\n3,4\n"), "text/csv")}

    r1 = client.post("/v1/datasets", data={"workspace_id": "00000000-0000-0000-0000-000000000010", "name": "train-ds"}, files=files, headers={"Authorization": f"Bearer {t}"})
    assert r1.status_code == 201
    assert len(r1.json()["versions"]) == 1

    files2 = {"file": ("sample2.csv", io.BytesIO(b"a,b\n5,6\n"), "text/csv")}
    r2 = client.post("/v1/datasets", data={"workspace_id": "00000000-0000-0000-0000-000000000010", "name": "train-ds"}, files=files2, headers={"Authorization": f"Bearer {t}"})
    assert r2.status_code == 201
    assert len(r2.json()["versions"]) == 2


def test_training_job_lifecycle_and_events() -> None:
    t = token("admin")
    created = client.post("/v1/training-jobs", json={"workspace_id": "00000000-0000-0000-0000-000000000010"}, headers={"Authorization": f"Bearer {t}"})
    assert created.status_code == 201
    job_id = created.json()["id"]

    deadline = time.time() + 3
    status = "running"
    while time.time() < deadline and status != "succeeded":
        result = client.get(f"/v1/training-jobs/{job_id}", headers={"Authorization": f"Bearer {t}"})
        assert result.status_code == 200
        status = result.json()["status"]
        time.sleep(0.1)

    assert status == "succeeded"


def test_rbac_viewer_cannot_create_training_job() -> None:
    t = token("viewer")
    response = client.post("/v1/training-jobs", json={"workspace_id": "00000000-0000-0000-0000-000000000010"}, headers={"Authorization": f"Bearer {t}"})
    assert response.status_code == 403

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_workspace_list_requires_auth() -> None:
    response = client.get('/v1/workspaces')
    assert response.status_code == 401


def test_project_filter_invalid_uuid_returns_401_without_auth() -> None:
    response = client.get('/v1/projects', params={'workspace_id': 'not-a-uuid'})
    assert response.status_code == 401

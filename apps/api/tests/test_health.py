from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_healthz() -> None:
    response = client.get('/healthz')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_v1_info() -> None:
    response = client.get('/v1')
    assert response.status_code == 200
    assert response.json()['version'] == 'v1'


def test_auth_me_placeholder() -> None:
    response = client.get('/v1/auth/me')
    assert response.status_code == 200

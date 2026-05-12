# Aetheris Studio v1

A web-first scaffold for the no-code AI training platform using **Next.js + FastAPI + Postgres**.

## Progress
- ✅ **M1 completed foundation:** auth token issuance, RBAC guards, workspace/project APIs, dataset ingestion API, training job abstraction + realtime stream hooks.
- 🚧 **M2 started:** preprocessing pipeline API and persistent metadata schema extensions for datasets/training/pipelines.

## Stack
- Frontend: Next.js 14
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL migrations in `db/migrations`

## New API surfaces
- `POST /v1/auth/token`
- `GET/POST /v1/workspaces`
- `GET/POST /v1/projects`
- `GET/POST /v1/datasets`
- `POST /v1/training-jobs`
- `GET /v1/training-jobs/{job_id}`
- `GET /v1/training-jobs/{job_id}/events`
- `GET/POST /v1/preprocessing-pipelines`

## Local development
```bash
npm install
python -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements-dev.txt
./scripts/dev-up.sh
```

## Tests
```bash
source .venv/bin/activate
PYTHONPATH=apps/api pytest apps/api/tests -q
```

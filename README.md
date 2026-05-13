# Aetheris Studio v1

A web-first scaffold for the no-code AI training platform using **Next.js + FastAPI + Postgres**.

## Progress
- ✅ **M1 completed foundation:** auth token issuance, RBAC guards, workspace/project APIs, dataset ingestion API, training job abstraction + realtime stream hooks.
- 🚧 **M2 started:** preprocessing pipeline API and persistent metadata schema extensions for datasets/training/pipelines.

## Stack
- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Backend:** Python FastAPI + SQLAlchemy
- **Database:** PostgreSQL migrations in `db/migrations`

## Repository layout
- `apps/web` → Next.js web app scaffold
- `apps/api` → FastAPI API and service scaffolds
- `db/migrations` → initial schema migrations
- `docs/*` → PRD, architecture, API, UX, and build plan docs

## API surfaces
- `POST /v1/auth/token`
- `GET/POST /v1/workspaces`
- `GET/POST /v1/projects`
- `GET/POST /v1/datasets`
- `POST /v1/training-jobs`
- `GET /v1/training-jobs/{job_id}`
- `POST /v1/training-jobs/{job_id}/pause`
- `POST /v1/training-jobs/{job_id}/resume`
- `POST /v1/training-jobs/{job_id}/cancel`
- `GET /v1/training-jobs/{job_id}/events`
- `GET/POST /v1/preprocessing-pipelines`

## Local development

### 1) Install dependencies
```bash
# web
npm install

# api
python -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements-dev.txt
```

### 2) Run app
```bash
./scripts/dev-up.sh
```

- Web: `http://localhost:3000`
- API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Tests
```bash
source .venv/bin/activate
PYTHONPATH=apps/api pytest apps/api/tests -q
```

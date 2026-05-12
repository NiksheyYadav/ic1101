# Aetheris Studio v1

A web-first scaffold for the no-code AI training platform using **Next.js + FastAPI + Postgres**.

## Stack (M1)
- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Backend:** Python FastAPI
- **Database:** PostgreSQL with SQL migrations in `db/migrations`

## Repository layout
- `apps/web` → Next.js web app scaffold
- `apps/api` → FastAPI API and service scaffolds
- `db/migrations` → initial schema migrations
- `docs/*` → PRD, architecture, API, UX, and build plan docs

## Implemented backend capabilities
- JWT token issuance (`/v1/auth/token`)
- RBAC-protected workspace/project CRUD scaffolds
- Dataset service (CSV upload, schema/shape profiling, in-memory versioning)
- Training job abstraction with mocked worker loop + SSE event stream

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

## API tests
```bash
source .venv/bin/activate
PYTHONPATH=apps/api pytest apps/api/tests -q
```

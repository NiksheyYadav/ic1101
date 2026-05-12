#!/usr/bin/env bash
set -euo pipefail

( cd apps/api && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 ) &
( cd apps/web && npm run dev -- --port 3000 ) &

wait

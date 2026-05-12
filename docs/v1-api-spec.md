# Aetheris Studio v1 API Spec (Draft)

## Authentication
- OAuth2/OIDC access tokens
- API keys for deployment inference endpoints

## Endpoints

### POST /v1/projects
Create project.

Request:
```json
{"name":"Churn Prediction","workspace_id":"ws_123"}
```

Response:
```json
{"project_id":"prj_001","status":"created"}
```

### POST /v1/datasets
Create dataset upload session.

### POST /v1/datasets/{dataset_id}/validate
Run schema + quality validation.

### POST /v1/training-jobs
Create a training run from UI config.

Request includes:
- dataset version refs
- preprocessing pipeline ref
- model config
- hyperparameters
- resource config

### POST /v1/training-jobs/{job_id}/pause
Pause run and persist checkpoint pointer.

### POST /v1/training-jobs/{job_id}/resume
Resume run from checkpoint.

### POST /v1/training-jobs/{job_id}/cancel
Cancel run safely.

### GET /v1/training-jobs/{job_id}/logs
Fetch paginated logs.

### GET /v1/experiments
List runs with filtering.

### POST /v1/experiments/compare
Compare multiple runs.

### POST /v1/models/register
Register selected run artifact in model registry.

### POST /v1/deployments
Deploy model to managed endpoint.

### GET /v1/training-jobs/{job_id}/metrics/stream (WebSocket)
Realtime metric channel.

## API Requirements
- Idempotency key required for create and state-change endpoints
- Standard error envelope:
```json
{"error":{"code":"RESOURCE_EXHAUSTED","message":"GPU quota exceeded","details":{}}}
```
- Tenant and role checks on all endpoints
- Rate limiting per workspace + endpoint class


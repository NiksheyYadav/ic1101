# Aetheris Studio v1 PRD

## Product Goal
Ship a no-code AI training platform that enables end-to-end model creation, training, comparison, and deployment from UI-only workflows.

## v1 Success Criteria
- Time to first training run: < 15 minutes
- Dataset validation success: > 98%
- Training run completion: > 92%
- Live dashboard data delay (p95): < 3 seconds

## In Scope (v1)
1. Project and workspace management
2. Dataset upload + connectors + schema validation
3. Preprocessing pipeline builder (block-based)
4. Model/task selection (tabular, image, text baseline)
5. Hyperparameter configuration (simple + advanced)
6. Training job lifecycle (start, pause, resume, cancel)
7. Real-time training dashboard
8. Experiment tracking + comparison
9. Model registry + basic deployment to managed API
10. RBAC (Owner/Admin/Member/Viewer)

## Out of Scope (v1)
- Full edge deployment matrix
- Full enterprise compliance bundles
- Fully autonomous agentic tuning

## Core User Stories
- As a beginner, I can upload a CSV and train a baseline model without writing code.
- As an ML engineer, I can configure full hyperparameters and monitor gradients + hardware telemetry in real time.
- As a team lead, I can compare runs and promote the best model to registry and deployment.

## Functional Requirements
### Dataset Manager
- Upload formats: CSV, JSON, Parquet, image folders, text files
- Source connectors: GCS, S3, Drive (batch import)
- Dataset versioning with immutable snapshots
- Data preview and sampling

### Preprocessing Studio
- Pipeline blocks: missing value handling, encoding, normalization, augmentation (image/text basic)
- Train/validation/test split with stratification support
- Pipeline version tied to training runs

### Training Setup Wizard
- Task detection + manual override
- Model recommendations with speed/accuracy/cost tags
- Hyperparameter editor with validation guardrails

### Real-time Monitoring
- Metrics: loss/accuracy/precision/recall/F1
- System telemetry: CPU/GPU/RAM/VRAM
- Throughput, ETA, epoch progress
- Checkpoint and anomaly events

### Experimentation
- Compare runs by metric, cost, and runtime
- Filter by model/task/dataset/version
- Promote run to model registry

### Deployment Center
- One-click managed endpoint deployment
- Endpoint health + latency panel
- API key-based access

## Non-Functional Requirements
- Availability target: 99.9% control plane
- Training orchestration recoverability with checkpoint resume
- Auditability for model/dataset lineage
- Multi-tenant isolation at workspace level

## UX Principles
- Progressive disclosure (Beginner vs Expert mode)
- Intelligent defaults with transparent rationale
- Immediate feedback loops (live validation and run telemetry)
- Consistent page architecture across workflow steps


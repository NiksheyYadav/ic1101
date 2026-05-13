# Graph Report - .  (2026-05-13)

## Corpus Check
- Corpus is ~3,387 words - fits in a single context window. You may not need a graph.

## Summary
- 113 nodes · 111 edges · 29 communities (16 shown, 13 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Dataset Management|Dataset Management]]
- [[_COMMUNITY_Configuration and Schemas|Configuration and Schemas]]
- [[_COMMUNITY_Workspace and DB Models|Workspace and DB Models]]
- [[_COMMUNITY_Auth and Security|Auth and Security]]
- [[_COMMUNITY_Training Job Store|Training Job Store]]
- [[_COMMUNITY_Integration Tests|Integration Tests]]
- [[_COMMUNITY_Web UI Components|Web UI Components]]
- [[_COMMUNITY_Project Management|Project Management]]
- [[_COMMUNITY_Training Job Routing|Training Job Routing]]
- [[_COMMUNITY_Dataset Documentation|Dataset Documentation]]
- [[_COMMUNITY_Training Documentation|Training Documentation]]
- [[_COMMUNITY_Web Layout|Web Layout]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Product and UX Docs|Product and UX Docs]]
- [[_COMMUNITY_Deployment Docs|Deployment Docs]]
- [[_COMMUNITY_Experiment Docs|Experiment Docs]]
- [[_COMMUNITY_Monitoring Docs|Monitoring Docs]]
- [[_COMMUNITY_Web UI Docs|Web UI Docs]]
- [[_COMMUNITY_API Gateway Docs|API Gateway Docs]]
- [[_COMMUNITY_Auth Service Docs|Auth Service Docs]]
- [[_COMMUNITY_Model Registry Docs|Model Registry Docs]]
- [[_COMMUNITY_M1 Foundations|M1 Foundations]]
- [[_COMMUNITY_M4 Deploy Docs|M4 Deploy Docs]]

## God Nodes (most connected - your core abstractions)
1. `TrainingJobRead` - 5 edges
2. `Principal` - 5 edges
3. `TrainingJobStore` - 5 edges
4. `DatasetVersionRead` - 4 edges
5. `DatasetRead` - 4 edges
6. `DatasetRecord` - 4 edges
7. `DatasetStore` - 4 edges
8. `token()` - 4 edges
9. `Workspace` - 3 edges
10. `Project` - 3 edges

## Surprising Connections (you probably didn't know these)
- `create_project()` --calls--> `Project`  [INFERRED]
  apps/api/app/routers/project.py → apps/api/app/db/models.py
- `DatasetVersionRead` --uses--> `Principal`  [INFERRED]
  apps/api/app/routers/dataset.py → apps/api/app/security/auth.py
- `DatasetRead` --uses--> `Principal`  [INFERRED]
  apps/api/app/routers/dataset.py → apps/api/app/security/auth.py
- `TrainingJobRead` --uses--> `Principal`  [INFERRED]
  apps/api/app/routers/training.py → apps/api/app/security/auth.py
- `create_workspace()` --calls--> `Workspace`  [INFERRED]
  apps/api/app/routers/workspace.py → apps/api/app/db/models.py

## Communities (29 total, 13 thin omitted)

### Community 0 - "Dataset Management"
Cohesion: 0.23
Nodes (5): DatasetRead, DatasetVersionRead, DatasetRecord, DatasetStore, DatasetVersion

### Community 1 - "Configuration and Schemas"
Cohesion: 0.22
Nodes (8): BaseModel, Settings, Config, ProjectCreate, ProjectRead, Config, WorkspaceCreate, WorkspaceRead

### Community 2 - "Workspace and DB Models"
Cohesion: 0.27
Nodes (6): Base, Project, User, Workspace, create_workspace(), parse_uuid()

### Community 3 - "Auth and Security"
Cohesion: 0.22
Nodes (5): issue_token(), TokenRequest, create_access_token(), get_principal(), Principal

### Community 5 - "Integration Tests"
Cohesion: 0.53
Nodes (4): test_dataset_upload_and_versioning_happy_path(), test_rbac_viewer_cannot_create_training_job(), test_training_job_lifecycle_and_events(), token()

### Community 6 - "Web UI Components"
Cohesion: 0.4
Nodes (3): services, Props, ServiceStatus()

### Community 7 - "Project Management"
Cohesion: 0.6
Nodes (3): create_project(), list_projects(), parse_uuid()

### Community 8 - "Training Job Routing"
Cohesion: 0.6
Nodes (3): create_job(), get_job(), TrainingJobRead

### Community 9 - "Dataset Documentation"
Cohesion: 0.4
Nodes (5): API Datasets, Dataset Service, M2 Data Pipeline, Dataset Manager, Preprocessing Studio

### Community 11 - "Training Documentation"
Cohesion: 0.5
Nodes (4): API Training Jobs, Training Orchestrator, M3 Training Realtime, Training Setup Wizard

## Knowledge Gaps
- **24 isolated node(s):** `Config`, `Config`, `nextConfig`, `metadata`, `services` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DatasetVersionRead` connect `Dataset Management` to `Configuration and Schemas`, `Auth and Security`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `DatasetRead` connect `Dataset Management` to `Configuration and Schemas`, `Auth and Security`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Principal` (e.g. with `DatasetVersionRead` and `DatasetRead`) actually correct?**
  _`Principal` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `DatasetVersionRead` (e.g. with `Principal` and `DatasetRecord`) actually correct?**
  _`DatasetVersionRead` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Config`, `Config`, `nextConfig` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
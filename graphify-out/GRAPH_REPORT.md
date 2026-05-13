# Graph Report - C:\ic1101\ic1101  (2026-05-14)

## Corpus Check
- 50 files · ~47,697 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 184 nodes · 246 edges · 53 communities detected
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 74 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]

## God Nodes (most connected - your core abstractions)
1. `Principal` - 15 edges
2. `TrainingJob` - 14 edges
3. `TrainingEvent` - 8 edges
4. `DatasetVersionRead` - 8 edges
5. `DatasetRead` - 8 edges
6. `MLModel` - 7 edges
7. `Deployment` - 7 edges
8. `ModelRead` - 7 edges
9. `DeployRead` - 7 edges
10. `upload_dataset()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Workspace` --calls--> `create_workspace()`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\db\models.py → C:\ic1101\ic1101\apps\api\app\routers\workspace.py
- `Project` --calls--> `create_project()`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\db\models.py → C:\ic1101\ic1101\apps\api\app\routers\project.py
- `DatasetVersion` --uses--> `TrainingJobService`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\db\models.py → C:\ic1101\ic1101\apps\api\app\services\training_jobs.py
- `TrainingJob` --uses--> `ExperimentRead`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\db\models.py → C:\ic1101\ic1101\apps\api\app\routers\experiments.py
- `TrainingJob` --uses--> `CompareRequest`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\db\models.py → C:\ic1101\ic1101\apps\api\app\routers\experiments.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (16): TrainingEvent, TrainingJob, _append_event(), create_job(), get_job(), _job_to_read(), append_event(), create() (+8 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (11): create_access_token(), get_principal(), issue_token(), Principal, TokenRequest, PreprocessingPipeline, create_pipeline(), list_pipelines() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (13): BaseModel, Settings, deploy_model(), Deployment, DeployRead, DeployRequest, get_model(), list_models() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (11): Base, DatasetRead, DatasetVersionRead, get_dataset(), list_datasets(), upload_dataset(), Dataset, DatasetVersion (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (3): lifespan(), init_db(), Create all tables — used in dev mode.

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (5): Config, create_project(), list_projects(), ProjectCreate, ProjectRead

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (5): Config, create_workspace(), list_workspaces(), WorkspaceCreate, WorkspaceRead

### Community 7 - "Community 7"
Cohesion: 0.46
Nodes (7): compare_experiments(), CompareRequest, create_experiment_from_job(), _exp_to_read(), ExperimentRead, list_experiments(), Experiment

### Community 8 - "Community 8"
Cohesion: 0.43
Nodes (3): DatasetRecord, DatasetStore, DatasetVersion

### Community 9 - "Community 9"
Cohesion: 0.53
Nodes (4): test_dataset_upload_and_versioning_happy_path(), test_rbac_viewer_cannot_create_training_job(), test_training_job_lifecycle_and_events(), token()

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (2): apiFetch(), handleAction()

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (5): API Datasets, Dataset Service, M2 Data Pipeline, Dataset Manager, Preprocessing Studio

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (4): API Training Jobs, Training Orchestrator, M3 Training Realtime, Training Setup Wizard

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (2): Aetheris Studio, Primary Flow

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (2): Experiment Service, Experimentation

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (2): Deployment Service, Deployment Center

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Real-time Monitoring

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (1): Web UI

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (1): API Gateway

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (1): Auth Service

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (1): Model Registry

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (1): M1 Foundations

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (1): M4 Experiment Registry Deploy

## Knowledge Gaps
- **21 isolated node(s):** `Create all tables — used in dev mode.`, `Config`, `Config`, `Aetheris Studio`, `Preprocessing Studio` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 16`** (2 nodes): `middleware.ts`, `middleware()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `InteractiveMesh.tsx`, `InteractiveMesh()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `service-status.tsx`, `ServiceStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `Aetheris Studio`, `Primary Flow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `Experiment Service`, `Experimentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `Deployment Service`, `Deployment Center`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `BackgroundSimulation.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `BootLoader.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `sidebar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `dev-up.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `Real-time Monitoring`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `Web UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `API Gateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `Auth Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `Model Registry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `M1 Foundations`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `M4 Experiment Registry Deploy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Principal` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 7`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `upload_dataset()` connect `Community 3` to `Community 8`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `TrainingJob` connect `Community 0` to `Community 2`, `Community 3`, `Community 7`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Principal` (e.g. with `DatasetVersionRead` and `DatasetRead`) actually correct?**
  _`Principal` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `TrainingJob` (e.g. with `ExperimentRead` and `CompareRequest`) actually correct?**
  _`TrainingJob` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `TrainingEvent` (e.g. with `TrainingJobCreate` and `TrainingJobRead`) actually correct?**
  _`TrainingEvent` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Create all tables — used in dev mode.`, `Config`, `Config` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
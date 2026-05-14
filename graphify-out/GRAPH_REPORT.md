# Graph Report - C:\ic1101\ic1101  (2026-05-14)

## Corpus Check
- 64 files · ~62,170 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 281 nodes · 451 edges · 56 communities detected
- Extraction: 61% EXTRACTED · 39% INFERRED · 0% AMBIGUOUS · INFERRED: 176 edges (avg confidence: 0.65)
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
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 23 edges
2. `Principal` - 20 edges
3. `TrainingJob` - 19 edges
4. `TextCNN` - 16 edges
5. `TrainingStatus` - 15 edges
6. `_train_image_model()` - 12 edges
7. `_train_text_model()` - 12 edges
8. `TrainingEvent` - 11 edges
9. `DatasetVersion` - 9 edges
10. `DatasetVersionRead` - 8 edges

## Surprising Connections (you probably didn't know these)
- `TrainingJob` --calls--> `create()`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\db\models.py → C:\ic1101\ic1101\apps\api\app\services\training_jobs.py
- `Download model ZIP from S3 if needed, and extract it to a temp dir.` --uses--> `TextCNN`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\services\predictor.py → C:\ic1101\ic1101\apps\api\app\services\models.py
- `Run prediction. input_data is a PIL Image or a text string.` --uses--> `TextCNN`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\services\predictor.py → C:\ic1101\ic1101\apps\api\app\services\models.py
- `Redirect to GitHub OAuth consent screen.` --uses--> `User`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\routers\auth.py → C:\ic1101\ic1101\apps\api\app\db\models.py
- `Handle GitHub callback, exchange code, create user, issue JWT.` --uses--> `User`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\routers\auth.py → C:\ic1101\ic1101\apps\api\app\db\models.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (32): Principal, Base, BaseModel, Settings, CompareRequest, ExperimentRead, Run live inference on the chosen experiment., DatasetVersion (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (24): A lightweight 1D-CNN text classifier., TextCNN, _create_zip(), _get_device(), get_model_zip_path(), Real PyTorch training engine for Aetheris AI.  Supports two demo-friendly model, Train MobileNetV2 on synthetic image data (demo-safe)., Train MobileNetV2 on synthetic image data (demo-safe). (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (18): get_principal(), DELETE(), GET(), handleProxy(), POST(), PUT(), test_dataset_upload_and_versioning_happy_path(), test_dataset_upload_requires_auth() (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (9): Upload a file to an S3 bucket, Download a file from an S3 bucket, Generate a presigned URL to share an S3 object, S3Service, create_job(), download_model(), get_job(), _job_to_read() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.19
Nodes (9): compare_experiments(), create_experiment_from_job(), _exp_to_read(), list_experiments(), predict_experiment(), CachedModel, ModelPredictor, Run prediction. input_data is a PIL Image or a text string. (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.27
Nodes (9): DatasetRead, DatasetVersionRead, get_dataset(), list_datasets(), DatasetRecord, DatasetStore, DatasetVersion, upload_dataset() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.21
Nodes (8): create_access_token(), github_callback(), github_login(), issue_token(), Redirect to GitHub OAuth consent screen., Handle GitHub callback, exchange code, create user, issue JWT., TokenRequest, User

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (4): apiFetch(), handleAction(), handleSave(), poll()

### Community 8 - "Community 8"
Cohesion: 0.2
Nodes (4): get_training_status(), Thread-safe shared training status manager.  Maintains a ``dict[job_id, Training, Singleton-style thread-safe status store., TrainingStatusManager

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (3): lifespan(), init_db(), Create all tables — used in dev mode.

### Community 10 - "Community 10"
Cohesion: 0.43
Nodes (6): PreprocessingPipeline, create_pipeline(), list_pipelines(), PipelineCreate, PipelineRead, _to_read()

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (5): Config, create_project(), list_projects(), ProjectCreate, ProjectRead

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (5): Config, create_workspace(), list_workspaces(), WorkspaceCreate, WorkspaceRead

### Community 13 - "Community 13"
Cohesion: 0.53
Nodes (2): load_model(), Aetheris AI — Inference Script Auto-generated after training.

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (3): append_event(), create(), run()

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (5): API Datasets, Dataset Service, M2 Data Pipeline, Dataset Manager, Preprocessing Studio

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (4): API Training Jobs, Training Orchestrator, M3 Training Realtime, Training Setup Wizard

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (1): System telemetry endpoint — exposes live CPU/RAM/CUDA status.

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

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
Nodes (2): Aetheris Studio, Primary Flow

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (2): Experiment Service, Experimentation

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (2): Deployment Service, Deployment Center

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
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (1): Real-time Monitoring

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (1): Web UI

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (1): API Gateway

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (1): Auth Service

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (1): Model Registry

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): M1 Foundations

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): M4 Experiment Registry Deploy

## Knowledge Gaps
- **33 isolated node(s):** `Create all tables — used in dev mode.`, `System telemetry endpoint — exposes live CPU/RAM/CUDA status.`, `Config`, `Config`, `A lightweight 1D-CNN text classifier.` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 20`** (2 nodes): `middleware.ts`, `middleware()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `page.tsx`, `handleFileChange()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `page.tsx`, `handleLaunch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `page.tsx`, `handleGithubLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `InteractiveMesh.tsx`, `InteractiveMesh()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `service-status.tsx`, `ServiceStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `Aetheris Studio`, `Primary Flow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `Experiment Service`, `Experimentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `Deployment Service`, `Deployment Center`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `layout.tsx`
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
- **Thin community `Community 39`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `BackgroundSimulation.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `BootLoader.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `sidebar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `dev-up.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `Real-time Monitoring`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `Web UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `API Gateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `Auth Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `Model Registry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `M1 Foundations`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `M4 Experiment Registry Deploy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `Community 2` to `Community 1`, `Community 4`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `Principal` connect `Community 0` to `Community 2`, `Community 10`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `upload_dataset()` connect `Community 5` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `GET()` (e.g. with `github_callback()` and `upload_dataset()`) actually correct?**
  _`GET()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `Principal` (e.g. with `DatasetVersionRead` and `DatasetRead`) actually correct?**
  _`Principal` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `TrainingJob` (e.g. with `ExperimentRead` and `CompareRequest`) actually correct?**
  _`TrainingJob` has 17 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `TextCNN` (e.g. with `CachedModel` and `ModelPredictor`) actually correct?**
  _`TextCNN` has 12 INFERRED edges - model-reasoned connections that need verification._
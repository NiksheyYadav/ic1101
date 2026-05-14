# Graph Report - C:\ic1101\ic1101\apps  (2026-05-14)

## Corpus Check
- 63 files · ~39,303 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 250 nodes · 412 edges · 44 communities detected
- Extraction: 67% EXTRACTED · 33% INFERRED · 0% AMBIGUOUS · INFERRED: 137 edges (avg confidence: 0.64)
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

## God Nodes (most connected - your core abstractions)
1. `GET()` - 23 edges
2. `Principal` - 17 edges
3. `TrainingJob` - 16 edges
4. `TextCNN` - 16 edges
5. `_train_image_model()` - 11 edges
6. `_train_text_model()` - 11 edges
7. `TrainingStatus` - 10 edges
8. `DatasetVersion` - 9 edges
9. `TrainingEvent` - 8 edges
10. `DatasetVersionRead` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Download model ZIP from S3 if needed, and extract it to a temp dir.` --uses--> `TextCNN`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\services\predictor.py → C:\ic1101\ic1101\apps\api\app\services\models.py
- `Run prediction. input_data is a PIL Image or a text string.` --uses--> `TextCNN`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\services\predictor.py → C:\ic1101\ic1101\apps\api\app\services\models.py
- `test_dataset_upload_requires_auth()` --calls--> `GET()`  [INFERRED]
  C:\ic1101\ic1101\apps\api\tests\integration\test_auth_rbac_dataset_training.py → C:\ic1101\ic1101\apps\web\app\api\[...path]\route.ts
- `Redirect to GitHub OAuth consent screen.` --uses--> `User`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\routers\auth.py → C:\ic1101\ic1101\apps\api\app\db\models.py
- `Handle GitHub callback, exchange code, create user, issue JWT.` --uses--> `User`  [INFERRED]
  C:\ic1101\ic1101\apps\api\app\routers\auth.py → C:\ic1101\ic1101\apps\api\app\db\models.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (29): Principal, Base, BaseModel, Settings, CompareRequest, DatasetVersion, deploy_model(), Deployment (+21 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (19): A lightweight 1D-CNN text classifier., TextCNN, _create_zip(), _get_device(), get_model_zip_path(), Real PyTorch training engine for Aetheris AI.  Supports two demo-friendly model, Train MobileNetV2 on synthetic image data (demo-safe)., Train a simple text CNN on synthetic data (demo-safe). (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (7): CachedModel, ModelPredictor, Run prediction. input_data is a PIL Image or a text string., Download model ZIP from S3 if needed, and extract it to a temp dir., Upload a file to an S3 bucket, Download a file from an S3 bucket, S3Service

### Community 3 - "Community 3"
Cohesion: 0.23
Nodes (12): DatasetRead, DatasetVersionRead, get_dataset(), list_datasets(), upload_dataset(), Dataset, GET(), test_auth_me_placeholder() (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.19
Nodes (9): create_access_token(), get_principal(), github_callback(), github_login(), issue_token(), Redirect to GitHub OAuth consent screen., Handle GitHub callback, exchange code, create user, issue JWT., TokenRequest (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (4): apiFetch(), handleAction(), handleSave(), poll()

### Community 6 - "Community 6"
Cohesion: 0.21
Nodes (8): Generate a presigned URL to share an S3 object, cancel_job(), create_job(), download_model(), get_job(), _job_to_read(), list_jobs(), pause_job()

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (4): get_training_status(), Thread-safe shared training status manager.  Maintains a ``dict[job_id, Training, Singleton-style thread-safe status store., TrainingStatusManager

### Community 8 - "Community 8"
Cohesion: 0.35
Nodes (9): DELETE(), handleProxy(), POST(), PUT(), test_dataset_upload_and_versioning_happy_path(), test_dataset_upload_requires_auth(), test_rbac_viewer_cannot_create_training_job(), test_training_job_lifecycle_and_events() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (3): lifespan(), init_db(), Create all tables — used in dev mode.

### Community 10 - "Community 10"
Cohesion: 0.39
Nodes (8): compare_experiments(), create_experiment_from_job(), _exp_to_read(), ExperimentRead, list_experiments(), predict_experiment(), Run live inference on the chosen experiment., Experiment

### Community 11 - "Community 11"
Cohesion: 0.43
Nodes (6): PreprocessingPipeline, create_pipeline(), list_pipelines(), PipelineCreate, PipelineRead, _to_read()

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (5): Config, create_project(), list_projects(), ProjectCreate, ProjectRead

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (5): Config, create_workspace(), list_workspaces(), WorkspaceCreate, WorkspaceRead

### Community 14 - "Community 14"
Cohesion: 0.43
Nodes (3): DatasetRecord, DatasetStore, DatasetVersion

### Community 15 - "Community 15"
Cohesion: 0.53
Nodes (2): load_model(), Aetheris AI — Inference Script Auto-generated after training.

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (1): System telemetry endpoint — exposes live CPU/RAM/CUDA status.

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
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

## Knowledge Gaps
- **10 isolated node(s):** `Create all tables — used in dev mode.`, `System telemetry endpoint — exposes live CPU/RAM/CUDA status.`, `Config`, `Config`, `A lightweight 1D-CNN text classifier.` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 19`** (2 nodes): `middleware.ts`, `middleware()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `page.tsx`, `handleFileChange()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `page.tsx`, `handleLaunch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `InteractiveMesh.tsx`, `InteractiveMesh()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `service-status.tsx`, `ServiceStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `layout.tsx`
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
- **Thin community `Community 37`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `BackgroundSimulation.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `BootLoader.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `sidebar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `Community 3` to `Community 1`, `Community 2`, `Community 4`, `Community 6`, `Community 8`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Why does `upload_dataset()` connect `Community 3` to `Community 2`, `Community 14`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `Principal` connect `Community 0` to `Community 11`, `Community 10`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `GET()` (e.g. with `github_callback()` and `upload_dataset()`) actually correct?**
  _`GET()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `Principal` (e.g. with `DatasetVersionRead` and `DatasetRead`) actually correct?**
  _`Principal` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 14 inferred relationships involving `TrainingJob` (e.g. with `ExperimentRead` and `CompareRequest`) actually correct?**
  _`TrainingJob` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `TextCNN` (e.g. with `CachedModel` and `ModelPredictor`) actually correct?**
  _`TextCNN` has 12 INFERRED edges - model-reasoned connections that need verification._
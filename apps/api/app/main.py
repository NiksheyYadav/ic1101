from fastapi import FastAPI

from app.routers import auth, dataset, preprocessing, project, training, workspace

app = FastAPI(title="Aetheris API Gateway", version="0.1.0")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "api-gateway"}


@app.get("/v1")
def v1() -> dict[str, str]:
    return {"name": "aetheris-api", "version": "v1"}


app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])
app.include_router(workspace.router, prefix="/v1/workspaces", tags=["workspaces"])
app.include_router(project.router, prefix="/v1/projects", tags=["projects"])
app.include_router(dataset.router, prefix="/v1/datasets", tags=["datasets"])
app.include_router(training.router, prefix="/v1/training-jobs", tags=["training"])

app.include_router(preprocessing.router, prefix="/v1/preprocessing-pipelines", tags=["preprocessing"])

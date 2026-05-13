from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.db.session import init_db
from app.routers import auth, dataset, experiments, models, preprocessing, project, training, workspace


@asynccontextmanager
async def lifespan(_app: FastAPI):
    if settings.dev_mode:
        init_db()
    yield


app = FastAPI(
    title="Aetheris API Gateway",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


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
app.include_router(experiments.router, prefix="/v1/experiments", tags=["experiments"])
app.include_router(models.router, prefix="/v1/models", tags=["models"])

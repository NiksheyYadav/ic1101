from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    workspace_id: str
    name: str = Field(min_length=3, max_length=100)
    description: str | None = None
    created_by: str | None = None


class ProjectRead(BaseModel):
    id: str
    workspace_id: str
    name: str
    description: str | None
    created_by: str | None

    class Config:
        from_attributes = True

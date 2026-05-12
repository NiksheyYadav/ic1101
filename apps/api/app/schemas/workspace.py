from pydantic import BaseModel, Field


class WorkspaceCreate(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    slug: str = Field(min_length=3, max_length=100)
    owner_user_id: str


class WorkspaceRead(BaseModel):
    id: str
    name: str
    slug: str
    owner_user_id: str

    class Config:
        from_attributes = True

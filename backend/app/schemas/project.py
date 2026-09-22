from uuid import UUID

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    product_description: str
    target_audience: str
    research_objectives: str


class ProjectResponse(ProjectCreate):
    id: UUID

    class Config:
        from_attributes = True
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
):
    project = Project(
        name=project_data.name,
        product_description=project_data.product_description,
        target_audience=project_data.target_audience,
        research_objectives=project_data.research_objectives,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project
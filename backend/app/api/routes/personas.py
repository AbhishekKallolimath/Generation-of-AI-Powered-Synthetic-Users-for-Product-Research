from fastapi import APIRouter
from pydantic import BaseModel

from app.persona_agent import generate_persona


router = APIRouter(
    prefix="/personas",
    tags=["Personas"],
)


class PersonaRequest(BaseModel):
    product: str
    target_audience: str
    research_objectives: str


@router.post("/generate")
def generate_persona_route(request: PersonaRequest):
    persona = generate_persona(
        product=request.product,
        target_audience=request.target_audience,
        research_objectives=request.research_objectives,
    )

    return persona.model_dump()
from fastapi import APIRouter
from pydantic import BaseModel

from app.validation_agent import validate_response


router = APIRouter(
    prefix="/validation",
    tags=["Validation"],
)


class ValidationRequest(BaseModel):
    product: str
    persona: dict
    question: str
    response_text: str


@router.post("/validate")
def validate_persona_response(request: ValidationRequest):
    result = validate_response(
        product=request.product,
        persona=request.persona,
        question=request.question,
        response_text=request.response_text,
    )

    return result.model_dump()
from fastapi import APIRouter
from pydantic import BaseModel
from app.survey_agent import generate_survey_response

router = APIRouter(prefix="/interviews", tags=["Interviews"])


class InterviewRequest(BaseModel):
    product: str
    persona: dict
    question: str
    history: list = []


@router.post("/chat")
def interview_chat(request: InterviewRequest):
    response = generate_survey_response(
    product=request.product,
    persona=request.persona,
    question=request.question,
    history=request.history,
)

    return {
        "persona_name": request.persona.get("name"),
        "response": response,
        "history": request.history + [
            {
                "question": request.question,
                "response": response,
            }
        ],
    }
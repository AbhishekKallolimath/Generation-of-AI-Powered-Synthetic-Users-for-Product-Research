from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter
from pydantic import BaseModel

from app.survey_agent import generate_survey_response


router = APIRouter(
    prefix="/surveys",
    tags=["Surveys"],
)


class SurveyPersona(BaseModel):
    name: str
    age: int
    occupation: str
    personality: str
    behavioral_patterns: str
    psychological_profile: str
    goals: str
    pain_points: str


class SurveyRequest(BaseModel):
    product: str
    question: str
    personas: list[SurveyPersona]


def generate_response(
    product: str,
    persona: SurveyPersona,
    question: str,
):
    response = generate_survey_response(
        product=product,
        persona=persona.model_dump(),
        question=question,
    )

    return {
        "persona_name": persona.name,
        "occupation": persona.occupation,
        "response": response,
    }


@router.post("/run")
def run_survey(request: SurveyRequest):
    with ThreadPoolExecutor(max_workers=len(request.personas)) as executor:
        results = list(
            executor.map(
                lambda persona: generate_response(
                    request.product,
                    persona,
                    request.question,
                ),
                request.personas,
            )
        )

    return {
        "question": request.question,
        "responses": results,
    }
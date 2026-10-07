from fastapi import APIRouter
from pydantic import BaseModel

from app.insight_agent import generate_insights

router = APIRouter(prefix="/insights", tags=["Insights"])


class InsightRequest(BaseModel):
    product: str
    responses: list


@router.post("/analyze")
def analyze_insights(request: InsightRequest):
    insights = generate_insights(
        product=request.product,
        responses=request.responses,
    )

    return insights
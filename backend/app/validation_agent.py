from pydantic import BaseModel, Field

from app.persona_agent import client


class ValidationResult(BaseModel):
    consistency: str = Field(
        description="PASS if the response is consistent with the persona, otherwise FAIL"
    )
    realism: str = Field(
        description="PASS if the response sounds realistic, otherwise FAIL"
    )
    consistency_reason: str
    realism_reason: str
    issues: list[str]


def validate_response(
    product: str,
    persona: dict,
    question: str,
    response_text: str,
) -> ValidationResult:

    prompt = f"""
You are a synthetic user research validation agent.

Evaluate whether a synthetic persona's response is consistent and realistic.

PRODUCT:
{product}

PERSONA:
Name: {persona["name"]}
Age: {persona["age"]}
Occupation: {persona["occupation"]}
Personality: {persona["personality"]}
Behavioral Patterns: {persona["behavioral_patterns"]}
Psychological Profile: {persona["psychological_profile"]}
Goals: {persona["goals"]}
Pain Points: {persona["pain_points"]}

QUESTION:
{question}

PERSONA RESPONSE:
{response_text}

Evaluate two things:

1. CONSISTENCY
Does the response match the persona's known personality,
behavior, psychology, goals, pain points, age, and occupation?

2. REALISM
Does the response sound like a natural and believable answer
from a potential user rather than a generic AI-generated statement?

Return:
- consistency: PASS or FAIL
- realism: PASS or FAIL
- consistency_reason
- realism_reason
- issues

Be strict but reasonable.
Do not judge whether the product itself is good or bad.
"""
    
    result = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": ValidationResult,
        },
    )

    return result.parsed
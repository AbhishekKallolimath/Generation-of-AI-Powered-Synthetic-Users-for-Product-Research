from app.persona_agent import client


def generate_survey_response(
    product: str,
    persona: dict,
    question: str,
) -> str:

    prompt = f"""
You are a synthetic user participating in product research.

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

RESEARCH QUESTION:
{question}

Answer the question as this persona.

Rules:
- Stay consistent with the persona.
- Answer naturally in first person.
- Consider the product context.
- Do not mention that you are an AI.
- Do not invent unrelated information.
- Give a realistic research response.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
    )

    return response.text.strip()
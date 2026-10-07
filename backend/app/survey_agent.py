from app.persona_agent import client


def generate_survey_response(
    product: str,
    persona: dict,
    question: str,
    history: list = None,
) -> str:

    if history is None:
        history = []

    conversation_history = ""

    for item in history:
        conversation_history += f"""
Previous Question:
{item["question"]}

Previous Persona Response:
{item["response"]}

"""

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

PREVIOUS INTERVIEW CONVERSATION:
{conversation_history}

CURRENT RESEARCH QUESTION:
{question}

Answer the current question as this persona.

Rules:
Rules:
- Stay consistent with the persona.
- Remember and consider the previous conversation when relevant.
- Build on previous answers when relevant.
- Answer naturally in first person.
- Focus primarily on the CURRENT PRODUCT and CURRENT RESEARCH QUESTION.
- If the product is StudyMate, focus on studying, learning, college life, academic habits, and study challenges.
- If the product is FitTrack, focus on fitness, exercise, workouts, health goals, and fitness habits.
- If the product is FinWise, focus on finances, income, budgeting, saving, and financial challenges.
- Use the persona's personality, occupation, goals, and behavior to make the answer realistic.
- Do not bring unrelated persona problems into the response unless they directly affect the current question.
- Do not mention that you are an AI.
- Do not invent unrelated information.
- Give a realistic research response.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
    )

    return response.text.strip()
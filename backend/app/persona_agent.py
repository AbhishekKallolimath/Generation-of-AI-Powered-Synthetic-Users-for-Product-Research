import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel


load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class Persona(BaseModel):
    name: str
    age: int
    occupation: str
    personality: str
    behavioral_patterns: str
    psychological_profile: str
    goals: str
    pain_points: str


def generate_persona(
    product: str,
    target_audience: str,
    research_objectives: str,
) -> Persona:

    prompt = f"""
You are a synthetic user persona generation agent.

Create ONE realistic synthetic user for product research.

Product:
{product}

Target Audience:
{target_audience}

Research Objectives:
{research_objectives}

The persona must be realistic, internally consistent, and clearly
different from a generic fictional character.

Return:
- Name
- Age
- Occupation
- Personality
- Behavioral patterns
- Psychological profile
- Goals
- Pain points

The persona is simulated and must not claim to represent a real person.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": Persona,
        },
    )

    return response.parsed
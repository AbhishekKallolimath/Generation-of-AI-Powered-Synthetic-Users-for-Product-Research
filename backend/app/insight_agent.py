import json
from google import genai

from app.core.config import settings

client = genai.Client(api_key=settings.gemini_api_key)

def generate_insights(product, responses):
    prompt = f"""
You are a product research insight analyst.

Product:
{product}

Research responses:
{json.dumps(responses, indent=2)}

Analyze the responses and return ONLY valid JSON with this structure:

{{
    "themes": [],
    "sentiment": {{
        "positive": 0,
        "neutral": 0,
        "negative": 0
    }},
    "agreement_patterns": [],
    "behavioral_trends": [],
    "would_use_score": 0,
    "would_use_reasoning": []
}}

Rules:
- would_use_score must be between 0 and 100.
- Identify recurring themes.
- Identify whether users agree or disagree.
- Identify behavioral patterns.
- Give a useful reason for the would-use score.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)
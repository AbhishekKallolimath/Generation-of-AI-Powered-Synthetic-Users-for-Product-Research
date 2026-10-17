
import json
from google import genai
from google.genai import errors

from app.core.config import settings

client = genai.Client(api_key=settings.gemini_api_key)


def generate_insights(product, responses):
    prompt = f"""
You are a product research insight analyst.

Product:
{product}

Research responses:
{json.dumps(responses, indent=2, ensure_ascii=False)}

Analyze only the supplied responses. Do not invent quotes or claim
that synthetic responses represent real customers.

Return ONLY valid JSON with this exact structure:

{{
    "themes": [
        {{
            "name": "Theme name",
            "description": "What the responses reveal",
            "mentions": 1
        }}
    ],
    "sentiment": {{
        "positive": 0,
        "neutral": 0,
        "negative": 0
    }},
    "key_quotes": [
        {{
            "persona_name": "Persona name from the input",
            "quote": "Exact short quote from a supplied response",
            "theme": "Related theme"
        }}
    ],
    "agreement_patterns": [],
    "behavioral_trends": [],
    "would_use_score": 0,
    "would_use_reasoning": []
}}

Rules:
- would_use_score must be an integer between 0 and 100.
- Sentiment values must be counts, not percentages.
- Classify each supplied response as positive, neutral, or negative.
- The sentiment counts must add up to the number of supplied responses.
- Identify recurring themes and estimate mentions from the responses.
- Use only persona names and quotes found in the supplied data.
- Include up to 5 representative quotes.
- Identify agreements and disagreements across personas.
- Describe behavioral patterns supported by the responses.
- Explain the product-use score and its limitations.
- If the input has no usable responses, return empty lists,
  zero sentiment counts, a score of 0, and an explanatory reason.
- Return valid JSON only, without Markdown fences.
"""

    response = None
    models_to_try = ["gemini-3.5-flash", "gemini-2.5-flash"]

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            break
        except errors.ServerError:
            continue

    if response is None or not response.text:
        raise RuntimeError(
            "Insight generation is temporarily unavailable. "
            "Please try again in a moment."
        )

    text = (response.text or "").strip()

    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    insights = json.loads(text)

    return insights

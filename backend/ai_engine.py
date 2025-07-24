# backend/ai_engine.py
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

from logger import logger
from exceptions import AIGenerationError # <-- THE CRITICAL FIX IS HERE

load_dotenv()

def generate_pain_cards(context: str, company_name: str) -> list[dict]:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in .env file.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""
    You are a Tier-1 management consultant from a top firm, advising the CFO of {company_name}.
    Based on the following context from their company profile and 10-K filing, identify exactly 8 significant, CFO-level business and financial pain points.

    Guidelines:
    1.  Focus on challenges related to profitability, cash flow, operational efficiency, market pressures, or financial systems.
    2.  Each pain point must have a short 'title' and a concise 'blurb' (under 40 words).
    3.  A significant portion of the pain points MUST be problems directly solvable by an SAP S/4HANA transformation.
    4.  Return your response as a single valid JSON array of objects, where each object has a "title" key and a "blurb" key.
    5.  Do not include any text or explanation outside of the single JSON array.

    Context:
    ---
    {context}
    ---

    JSON Output:
    """

    try:
        logger.info(f"Generating pain cards for {company_name} with Gemini AI...")
        response = model.generate_content(prompt)
        
        json_text = response.text.strip().lstrip("```json").rstrip("```")
        
        pain_cards = json.loads(json_text)
        
        logger.info(f"Successfully generated and parsed {len(pain_cards)} pain cards.")
        return pain_cards

    except Exception as e:
        logger.error(f"Unexpected AI generation error for {company_name}: {e}")
        raise AIGenerationError(f"Failed to generate or parse AI response for {company_name}")
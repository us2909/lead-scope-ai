import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def generate_pain_cards(context: str, company_name: str) -> list[dict]:
    """
    Uses the Gemini AI to analyze context and generate pain cards.

    Args:
        context: The string of scraped news headlines.
        company_name: The name of the company being analyzed.

    Returns:
        A list of dictionaries, where each dictionary is a pain card.
        Returns an empty list if generation fails.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found. Please check your .env file.")
        return []

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # This is our engineered prompt. Note the detailed instructions.
    prompt = f"""
    You are a Tier-1 management consultant advising the CFO of {company_name}.
    Based on the following recent news headlines, identify exactly five significant, CFO-level business or financial pain points.

    Guidelines:
    1.  Focus on challenges related to profitability, cash flow, operational efficiency, market pressures, or financial systems.
    2.  Each pain point should have a short 'title' and a concise 'blurb' (under 40 words).
    3.  The first three pain points MUST be problems directly solvable by an SAP S/4HANA transformation (e.g., fragmented financial data, slow closing processes, supply chain inefficiencies, lack of real-time margin analysis).
    4.  The last two pain points can be broader strategic challenges.
    5.  Return your response as a valid JSON array of objects, where each object has a "title" key and a "blurb" key. Do not include any other text or explanation outside of the JSON array.

    News Context:
    ---
    {context}
    ---

    JSON Output:
    """

    try:
        print("Generating pain cards with Gemini AI...")
        response = model.generate_content(prompt)

        # Clean up the response to get only the JSON part
        json_text = response.text.strip().lstrip("```json").rstrip("```")

        pain_cards = json.loads(json_text)
        print("Successfully generated and parsed pain cards.")
        return pain_cards
    except Exception as e:
        print(f"An error occurred during AI generation or JSON parsing: {e}")
        return []
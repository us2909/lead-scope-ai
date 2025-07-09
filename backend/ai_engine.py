# backend/ai_engine.py
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def generate_pain_cards(context: str, company_name: str) -> list[dict]:
    """
    Uses the Gemini AI to analyze context and generate a list of
    categorized pain cards.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found. Please check your .env file.")
        return []

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # --- UPGRADED PROMPT ---
    prompt = f"""
    You are a Tier-1 management consultant from a top firm, advising the CFO of {company_name}.
    Based on the following context from their company profile and 10-K filing, exactly 8 significant, CFO-level business and financial pain points.

    Guidelines:
    1.  Focus on challenges related to profitability, cash flow, operational efficiency, market pressures, or financial systems.
    2.  Each pain point must have a short 'title' and a concise 'blurb' (under 40 words).
    3.  A significant portion of the pain points MUST be problems directly solvable by an SAP S/4HANA transformation.
    4.  For each pain point, you MUST categorize it as one of the following: "Finance", "Supply Chain", "Operations", or "Strategy".
    5.  Return your response as a single valid JSON object. The keys of the object must be the category names, and the value for each key must be an array of the pain card objects for that category.
    6.  Do not include any text or explanation outside of the single JSON object.

    Context:
    ---
    {context}
    ---

    JSON Output:
    """

    try:
        print("Generating categorized pain cards with Gemini AI...")
        response = model.generate_content(prompt)
        
        # Clean up the response to get only the JSON part
        json_text = response.text.strip().lstrip("```json").rstrip("```")
        
        # The AI now returns a dictionary of lists (e.g., {"Finance": [...]})
        categorized_cards = json.loads(json_text)
        
        # For our current pipeline, we will flatten this structure into a single list.
        # This makes it compatible with our existing scope_engine.
        all_cards = []
        for category, cards_in_category in categorized_cards.items():
            all_cards.extend(cards_in_category)
        
        print(f"Successfully generated and parsed {len(all_cards)} categorized pain cards.")
        return all_cards

    except Exception as e:
        print(f"An error occurred during AI generation or JSON parsing: {e}")
        return []
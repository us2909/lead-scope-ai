# backend/main.py
from fastapi import FastAPI, HTTPException
import scraper
import ai_engine
import schemas

app = FastAPI(
    title="Lead-Scope AI API",
    description="API for generating CFO-level pain points from company data.",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Lead-Scope AI Backend!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# MODIFIED ENDPOINT
@app.get("/api/v1/assessment/{company_identifier}", response_model=schemas.AssessmentResponse)
async def get_assessment_data(company_identifier: str):
    """
    Takes a company identifier (ticker), scrapes context, runs AI analysis,
    and returns a structured assessment.
    """
    # Step 1: Scrape the context
    context = await scraper.get_company_context(company_identifier)
    if "Failed to fetch" in context or "No news" in context:
        raise HTTPException(status_code=404, detail=context)

    # Step 2: Run the AI engine to generate pain cards
    raw_cards = ai_engine.generate_pain_cards(context, company_identifier)
    if not raw_cards:
        raise HTTPException(status_code=500, detail="AI engine failed to generate pain cards.")

    # Step 3: Validate the output with Pydantic and return
    # This ensures the AI's output matches our defined schema.
    validated_cards = [schemas.PainCard(**card) for card in raw_cards]

    return schemas.AssessmentResponse(pain_cards=validated_cards)
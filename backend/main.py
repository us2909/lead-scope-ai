# backend/main.py

from fastapi import FastAPI, HTTPException
# IMPORT THE CORS MIDDLEWARE
from fastapi.middleware.cors import CORSMiddleware

import scraper
import ai_engine
import schemas
import scope_engine
from taxonomy import ALL_SCOPE_TILES

app = FastAPI(
    title="Lead-Scope AI API",
    description="API for generating CFO-level pain points from company data.",
    version="0.1.0"
)

# DEFINE THE ALLOWED ORIGINS (your frontend's address)
origins = [
    "http://localhost:3000",
]

# ADD THE CORS MIDDLEWARE CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Lead-Scope AI Backend!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/v1/assessment/{company_identifier}", response_model=schemas.AssessmentResponse)
def get_assessment_data(company_identifier: str):
    """
    Takes a company identifier (ticker), fetches news via API, runs AI analysis,
    and returns a structured assessment.
    """
    try:
        context = scraper.get_company_context(company_identifier)
    except Exception as e:
        # If the scraper (API call) fails, return a 500 Internal Server Error
        raise HTTPException(status_code=500, detail=f"Failed to retrieve company data: {e}")

    if "No news" in context:
        raise HTTPException(status_code=404, detail=context)

    raw_cards = ai_engine.generate_pain_cards(context, company_identifier)
    if not raw_cards:
        raise HTTPException(status_code=500, detail="AI engine failed to generate pain cards.")

    validated_cards = [schemas.PainCard(**card) for card in raw_cards]

    activated_tiles = scope_engine.determine_scope(validated_cards)

    scope_summary = f"Phase 1 Scope includes {len(activated_tiles)} key modules focusing on core finance and logistics."

    return schemas.AssessmentResponse(
        pain_cards=validated_cards,
        scope_summary=scope_summary,
        activated_tiles=activated_tiles,
        all_tiles=ALL_SCOPE_TILES
    )
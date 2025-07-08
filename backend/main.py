# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Tuple

# Import all our custom modules
import scraper
import ai_engine
import schemas
import scope_engine
import classifier 

app = FastAPI(
    title="Lead-Scope AI API",
    description="API for generating CFO-level pain points from company data.",
    version="0.1.0"
)

# CORS Middleware (no changes needed)
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Lead-Scope AI Backend!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/v1/assessment/{company_identifier}", response_model=schemas.AssessmentResponse)
def get_assessment_data(company_identifier: str):
    # Step 1: Get data from our data fetching module
    try:
        # The function now returns both the context for the AI and the full profile for classification
        context, company_profile = scraper.get_company_context(company_identifier)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve company data: {e}")

    # Handle cases where the ticker might be invalid
    if not company_profile:
         raise HTTPException(status_code=404, detail=f"Could not find company profile for ticker: {company_identifier}")

    # Step 2: Generate pain cards using the context
    raw_cards = ai_engine.generate_pain_cards(context, company_identifier)
    if not raw_cards:
        raise HTTPException(status_code=500, detail="AI engine failed to generate pain cards.")
    
    # Step 3: Run the scope engine to determine tiles and enrich cards
    enriched_cards_data, activated_tiles = scope_engine.process_scope_and_cards(raw_cards)
    validated_cards = [schemas.PainCard(**card) for card in enriched_cards_data]
    scope_summary = f"Phase 1 Scope includes {len(activated_tiles)} key modules..."

    # Step 4: NEW - Run the classifier on the company profile
    classified_industry, geo_scope = classifier.classify_company(company_profile)

    # Step 5: Assemble the complete response payload
    return schemas.AssessmentResponse(
        pain_cards=validated_cards,
        scope_summary=scope_summary,
        activated_tiles=activated_tiles,
        
        # Add the raw data from the profile
        industry=company_profile.get("industry"),
        revenue=company_profile.get("revenue"),
        
        # Add the newly classified data
        classified_industry=classified_industry,
        geo_scope=geo_scope
    )
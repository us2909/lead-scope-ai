# backend/main.py - FINAL CORRECTED VERSION

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tenacity import retry, stop_after_attempt, wait_exponential

# Import custom modules and error types
from exceptions import (
    ValidationError,
    ExternalAPIError,
    DataParsingError,
    AIGenerationError,
)
from logger import logger
from config import settings
import scraper
import ai_engine
import scope_engine
import classifier
from schemas import AssessmentResponse, PainCard # <-- Ensure PainCard is also imported
from validators import validate_ticker

app = FastAPI(
    title=settings.project_name,
    version=settings.project_version,
    description="API for generating CFO-level pain points from company data.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "ok", "timestamp": settings.start_time}


@app.get("/api/v1/assessment/{ticker}", response_model=AssessmentResponse)
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def get_assessment_data(ticker: str):
    logger.info(f"Assessment request started for: {ticker}")
    try:
        validated_ticker = validate_ticker(ticker)
        logger.info(f"Validated ticker: {validated_ticker}")

        context, company_profile = scraper.get_company_context(validated_ticker)
        logger.info(f"Successfully retrieved company context for {validated_ticker}")

        raw_cards = ai_engine.generate_pain_cards(context, validated_ticker)
        
        enriched_cards_data, activated_tiles = scope_engine.process_scope_and_cards(raw_cards)
        
        # This line now works because 'PainCard' is imported
        validated_cards = [PainCard(**card) for card in enriched_cards_data]
        
        classified_industry, geo_scope = classifier.classify_company(company_profile)

        return AssessmentResponse(
            pain_cards=validated_cards,
            scope_summary=f"Phase 1 Scope includes {len(activated_tiles)} key modules...",
            activated_tiles=activated_tiles,
            industry=company_profile.get("industry"),
            revenue=company_profile.get("revenue"),
            classified_industry=classified_industry,
            geo_scope=geo_scope,
        )
    except ValidationError as e:
        logger.warning(f"Validation error for ticker {ticker}: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except (ExternalAPIError, DataParsingError) as e:
        logger.error(f"Unexpected error retrieving company data for {ticker}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve or parse company data.")
    except AIGenerationError as e:
        logger.error(f"AI generation failed for {ticker}: {e}")
        raise HTTPException(status_code=500, detail="AI engine failed to generate pain cards.")
    except Exception as e:
        logger.critical(f"An unhandled exception occurred for ticker {ticker}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected internal server error occurred.")
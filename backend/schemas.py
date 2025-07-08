from pydantic import BaseModel, constr
from typing import Optional

class PainCard(BaseModel):
    title: str
    blurb: constr(max_length=280)
    triggered_tiles: list[str]
    triggering_keywords: list[str]

class AssessmentResponse(BaseModel):
    pain_cards: list[PainCard]
    scope_summary: str
    activated_tiles: list[str]
    # all_tiles field removed
    industry: Optional[str] = None
    revenue: Optional[float] = None
    classified_industry: Optional[str] = None
    geo_scope: Optional[str] = None
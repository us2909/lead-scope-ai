from pydantic import BaseModel, constr

class PainCard(BaseModel):
    """
    Defines the data structure for a single CFO-level pain card.
    The 'constr' function enforces a max length on the string.
    """
    title: str
    blurb: constr(max_length=280) # Limit blurb to 280 chars (~40 words)

class AssessmentResponse(BaseModel):
    """
    Defines the structure for the final API response.
    """
    pain_cards: list[PainCard]
    # We will add scope_json here later
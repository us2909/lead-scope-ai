from pydantic import BaseModel, constr

class PainCard(BaseModel):
    title: str
    blurb: constr(max_length=280)

# UPDATE THIS CLASS
class AssessmentResponse(BaseModel):
    pain_cards: list[PainCard]
    scope_summary: str
    activated_tiles: list[str]
    all_tiles: dict[str, str]
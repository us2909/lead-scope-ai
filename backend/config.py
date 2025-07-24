"""Configuration management for Lead-Scope AI backend."""

# backend/config.py
import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""

    project_name: str = "Lead-Scope AI"
    project_version: str = "1.0.0"

    # API Configuration
    google_api_key: str
    fmp_api_key: str

    # CORS Configuration
    # We accept a string from the .env file and will convert it to a list
    cors_origins: Union[List[str], str] = "http://localhost:3000"

    log_level: str = "INFO"

    @field_validator("cors_origins", mode='before')
    @classmethod
    def assemble_cors_origins(cls, v: Union[List[str], str]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            # If it's a simple string, split it by comma
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            # If it's already a list or a JSON string list, pydantic handles it
            return v
        raise ValueError(v)

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

# AI Prompts Configuration
AI_PROMPTS = {
    "pain_cards": """
You are a Tier-1 management consultant from a top firm, advising the CFO of {company_name}.
Based on the following context from their company profile and 10-K filing, exactly {max_cards} significant, CFO-level business and financial pain points.

Guidelines:
1. Focus on challenges related to profitability, cash flow, operational efficiency, market pressures, or financial systems.
2. Each pain point must have a short 'title' and a concise 'blurb' (under 40 words).
3. A significant portion of the pain points MUST be problems directly solvable by an SAP S/4HANA transformation.
4. For each pain point, you MUST categorize it as one of the following: "Finance", "Supply Chain", "Operations", or "Strategy".
5. Return your response as a single valid JSON object. The keys of the object must be the category names, and the value for each key must be an array of the pain card objects for that category.
6. Do not include any text or explanation outside of the single JSON object.

Context:
---
{context}
---

JSON Output:
"""
}

# SEC Headers for compliance
SEC_HEADERS = {
    'User-Agent': 'MoonSlate Consulting sample@example.com'
}
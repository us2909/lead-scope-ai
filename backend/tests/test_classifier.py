import pytest
from backend.classifier import classify_company


def test_classifies_tmt_when_sector_contains_tech():
    profile = {
        "sector": "Technology",
        "industry": "",
        "description": "We build cool products.",
        "country": "US",
    }
    industry, scope = classify_company(profile)
    assert industry == "TMT (Technology, Media & Telecom)"
    assert scope == "US-based only"


def test_geo_scope_us_only_vs_global():
    us_only_profile = {
        "sector": "Retail",
        "industry": "",
        "description": "Leading provider of domestic retail solutions.",
        "country": "US",
    }
    _, scope_us = classify_company(us_only_profile)
    assert scope_us == "US-based only"

    global_profile = {
        "sector": "Retail",
        "industry": "",
        "description": "Global provider of retail solutions with international operations.",
        "country": "US",
    }
    _, scope_global = classify_company(global_profile)
    assert scope_global == "More than 5 countries"

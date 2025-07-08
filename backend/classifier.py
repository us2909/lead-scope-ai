def classify_company(profile: dict) -> tuple[str, str]:
    """
    Takes a company profile from the FMP API and classifies it into
    a custom industry group and geographical scope.
    """
    industry = profile.get("industry", "").lower()
    sector = profile.get("sector", "").lower()
    description = profile.get("description", "").lower()
    country = profile.get("country", "").upper()

    # --- Industry Classification Logic ---
    classified_industry = "C&IP (Consumer & Industrial Products)" # Default

    if "tech" in sector or "communication" in sector or "software" in industry or "media" in industry or "entertainment" in industry:
        classified_industry = "TMT (Technology, Media & Telecom)"
    elif "financial" in sector or "insurance" in industry or "asset management" in industry:
        classified_industry = "FSI (Financial Services Industry)"
    elif "healthcare" in sector or "pharmaceuticals" in industry or "biotechnology" in industry:
        classified_industry = "LSHC (Life Sciences & Health Care)"
    elif "services" in sector and "business" in industry:
        classified_industry = "Professional Services"

    # --- Geographical Scope Logic ---
    geo_scope = "More than 5 countries" # Default for large public companies

    if country == "US":
        # A simple check: if it's US-based and doesn't mention global operations, assume US-only.
        if "global" not in description and "international" not in description and "worldwide" not in description:
            geo_scope = "US-based only"

    return classified_industry, geo_scope
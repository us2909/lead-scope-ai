# backend/scraper.py
import os
import re
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from typing import Tuple, Dict, Any

load_dotenv()

# We need a compliant User-Agent to access the SEC website
SEC_HEADERS = {'User-Agent': 'MoonSlate Consulting sample@example.com'}

def _get_company_profile(ticker: str, api_key: str) -> Dict[str, Any]:
    """Helper function to get the structured company profile from FMP."""
    print(f"Fetching company profile for {ticker}...")
    try:
        profile_url = f"https://financialmodelingprep.com/api/v3/profile/{ticker}?apikey={api_key}"
        response = requests.get(profile_url)
        response.raise_for_status()
        profile_data_list = response.json()
        if not profile_data_list:
            return {}
        print("Successfully fetched company profile.")
        return profile_data_list[0]
    except Exception as e:
        print(f"Could not fetch FMP profile: {e}")
        return {}


def _get_10k_risk_factors(ticker: str, api_key: str) -> str:
    """Helper function to find the latest 10-K and scrape its Risk Factors."""
    print("Fetching 10-K filing link from FMP...")
    try:
        filings_url = f"https://financialmodelingprep.com/api/v3/sec_filings/{ticker}?type=10-K&page=0&limit=1&apikey={api_key}"
        filings = requests.get(filings_url).json()
        
        if not filings:
            print("No 10-K filings link found.")
            return ""

        filing_url = filings[0].get('finalLink')
        if not filing_url:
            print("Could not find a valid link in the filing data.")
            return ""

        print(f"Fetching 10-K content from: {filing_url}")
        response = requests.get(filing_url, headers=SEC_HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        risk_header = soup.find(string=re.compile(r'Risk Factors|Item 1A', re.IGNORECASE))
        if not risk_header:
            print("Could not find 'Risk Factors' section in 10-K.")
            return ""

        content = []
        for sibling in risk_header.find_all_next(['p', 'h2', 'h3', 'h4']):
            if sibling.name.startswith('h') and re.search(r'Item \d+[A-Z]?', sibling.get_text(), re.IGNORECASE):
                break
            if sibling.name == 'p':
                content.append(sibling.get_text(strip=True))
        
        print("Successfully extracted text from 10-K Risk Factors.")
        return " ".join(content)

    except Exception as e:
        print(f"Could not fetch or parse 10-K: {e}")
        return ""


def get_company_context(identifier: str) -> Tuple[str, Dict[str, Any]]:
    """
    Main function called by main.py.
    Orchestrates getting both the company profile and the 10-K risk factors.
    """
    api_key = os.getenv("FMP_API_KEY")
    if not api_key:
        raise ValueError("FMP API key not found.")

    # Step 1: Get the structured profile data (for the dashboard)
    company_profile = _get_company_profile(identifier, api_key)
    
    # Step 2: Get the rich text from the 10-K (for the AI)
    risk_factors_text = _get_10k_risk_factors(identifier, api_key)
    
    # Step 3: Use the 10-K text as our primary context. If it's empty, fall back to the profile description.
    final_context = risk_factors_text if risk_factors_text else company_profile.get("description", "")
    
    if not final_context:
        # If both are empty, we can't proceed.
        return "Could not retrieve any context for AI.", {}

    # Limit the context to ~3000 words to not overwhelm the AI model
    final_context_truncated = " ".join(final_context.split()[:3000])

    return final_context_truncated, company_profile
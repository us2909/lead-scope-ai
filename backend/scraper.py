# backend/scraper.py
import os
import re
import requests
from bs4 import BeautifulSoup, NavigableString
from dotenv import load_dotenv

load_dotenv()

# We need to send a browser-like User-Agent header to the SEC website
SEC_HEADERS = {'User-Agent': 'MoonSlate Consulting uchit@moonslateconsulting.com'}

def get_10k_risk_factors(ticker: str, api_key: str) -> str:
    """
    Finds the latest 10-K filing URL from FMP and scrapes the 'Risk Factors' section.
    """
    # Step 1: Get the list of SEC filings from FMP
    filings_url = f"https://financialmodelingprep.com/api/v3/sec_filings/{ticker}?type=10-K&page=0&limit=1&apikey={api_key}"
    filings = requests.get(filings_url).json()

    if not filings:
        return f"No 10-K filings found for {ticker}."

    # Get the URL of the most recent 10-K filing
    filing_url = filings[0].get('finalLink')
    if not filing_url:
        return "Could not find the link to the 10-K filing."

    # Step 2: Scrape the content from the SEC filing URL
    print(f"Fetching 10-K filing from: {filing_url}")
    response = requests.get(filing_url, headers=SEC_HEADERS)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')

    # Step 3: Extract text from the "Risk Factors" section
    # SEC documents have complex structures. We'll search for text patterns.
    # This looks for "Risk Factors" or "Item 1A" which usually marks the section.
    # We use regex for case-insensitive matching.
    risk_header = soup.find(string=re.compile(r'Risk Factors|Item 1A', re.IGNORECASE))

    if not risk_header:
        return "Could not find the 'Risk Factors' or 'Item 1A' section in the 10-K filing."

    content = []
    # Navigate from the header to extract all subsequent text until the next major heading
    for sibling in risk_header.find_all_next(['p', 'h2', 'h3', 'h4']):
        # Stop if we hit the next major section (e.g., "Item 1B", "Item 2")
        if sibling.name.startswith('h') and re.search(r'Item \d', sibling.get_text(), re.IGNORECASE):
            break
        if sibling.name == 'p':
            content.append(sibling.get_text(strip=True))

    return " ".join(content)


def get_company_context(identifier: str) -> str:
    """
    Main function to get context for a company. Now uses the 10-K scraper.
    """
    print(f"Fetching 10-K context for {identifier}...")
    api_key = os.getenv("FMP_API_KEY")
    if not api_key:
        raise ValueError("FMP API key not found in .env file.")

    try:
        context = get_10k_risk_factors(identifier, api_key)
        if not context or "not found" in context:
             return f"Could not retrieve sufficient context for {identifier} from SEC filings."

        print(f"Successfully extracted context from 10-K filing for {identifier}.")
        # Return only the first ~3000 words to not overwhelm the AI
        return " ".join(context.split()[:3000])

    except Exception as e:
        print(f"An error occurred during 10-K processing: {e}")
        raise e
# backend/scraper.py
import os
import re
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from typing import Tuple, Dict, Any

from logger import logger
from exceptions import ExternalAPIError, DataParsingError

load_dotenv()

SEC_HEADERS = {'User-Agent': 'MoonSlate Consulting sample@example.com'}

def _get_company_profile(ticker: str, api_key: str) -> Dict[str, Any]:
    logger.info(f"Fetching company profile for {ticker}")
    try:
        profile_url = f"https://financialmodelingprep.com/api/v3/profile/{ticker}?apikey={api_key}"
        response = requests.get(profile_url)
        response.raise_for_status()
        profile_data_list = response.json()
        if not profile_data_list:
            logger.warning(f"Empty profile data for ticker {ticker}")
            raise ExternalAPIError(f"No company profile found for ticker: {ticker}")
        logger.info(f"Successfully fetched company profile for {ticker}")
        return profile_data_list[0]
    except requests.exceptions.RequestException as e:
        logger.error(f"HTTP error fetching profile for {ticker}: {e}")
        raise ExternalAPIError(f"Failed to fetch company profile for {ticker}")
    except Exception as e:
        logger.error(f"Unexpected error fetching profile for {ticker}: {e}")
        raise

def _get_latest_revenue(ticker: str, api_key: str) -> float | None:
    logger.info(f"Fetching latest annual revenue for {ticker}")
    try:
        income_url = f"https://financialmodelingprep.com/api/v3/income-statement/{ticker}?period=annual&limit=1&apikey={api_key}"
        income_response = requests.get(income_url)
        income_response.raise_for_status()
        income_data = income_response.json()
        if income_data and 'revenue' in income_data[0]:
            revenue = income_data[0]['revenue']
            logger.info(f"Updated revenue to latest annual figure: {revenue}")
            return revenue
        return None
    except Exception as e:
        logger.warning(f"Could not fetch quarterly revenue: {e}")
        return None

def _get_10k_risk_factors(ticker: str, api_key: str) -> str:
    logger.info(f"Fetching 10-K filing for {ticker}")
    try:
        filings_url = f"https://financialmodelingprep.com/api/v3/sec_filings/{ticker}?type=10-K&page=0&limit=1&apikey={api_key}"
        filings = requests.get(filings_url).json()
        if not filings or 'finalLink' not in filings[0]:
            logger.warning(f"No 10-K filings link found for {ticker}")
            return ""

        filing_url = filings[0]['finalLink']
        logger.info(f"Fetching 10-K content from: {filing_url}")
        response = requests.get(filing_url, headers=SEC_HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # More robust search for the "Risk Factors" section
        risk_header = soup.find(string=re.compile(r'Item\s+1A\.\s+Risk\s+Factors', re.IGNORECASE))
        if not risk_header:
            risk_header = soup.find(string=re.compile(r'Risk\s+Factors', re.IGNORECASE))
        
        if not risk_header:
            logger.warning(f"Could not find 'Risk Factors' section in 10-K for {ticker}.")
            return ""

        content = []
        # Iterate through siblings until the next major "Item" is found
        for element in risk_header.find_all_next(['p', 'h2', 'h3', 'h4']):
            if element.name.startswith('h'):
                # Stop if we hit the next item (e.g., "Item 1B", "Item 2")
                if re.search(r'Item\s+\d+[A-Z]?\.', element.get_text(), re.IGNORECASE):
                    break
            if element.name == 'p':
                content.append(element.get_text(strip=True))
        
        full_text = " ".join(content)
        logger.info(f"Successfully extracted {len(full_text)} characters from 10-K Risk Factors")
        return full_text

    except Exception as e:
        logger.error(f"Could not fetch or parse 10-K for {ticker}: {e}")
        raise DataParsingError(f"Failed to parse 10-K filing for {ticker}")

def get_company_context(ticker: str) -> Tuple[str, Dict[str, Any]]:
    logger.info(f"Starting company context retrieval for {ticker}")
    api_key = os.getenv("FMP_API_KEY")
    if not api_key:
        raise ValueError("FMP API key not found.")

    company_profile = _get_company_profile(ticker, api_key)
    latest_revenue = _get_latest_revenue(ticker, api_key)
    if latest_revenue:
        company_profile['revenue'] = latest_revenue

    risk_factors_text = _get_10k_risk_factors(ticker, api_key)
    
    final_context = risk_factors_text if risk_factors_text else company_profile.get("description", "")
    
    if not final_context:
        raise DataParsingError(f"Could not retrieve any context for AI for {ticker}")

    logger.info(f"Successfully retrieved context for {ticker}: {len(final_context)} characters")
    return " ".join(final_context.split()[:3000]), company_profile
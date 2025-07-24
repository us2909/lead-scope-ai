"""Input validation utilities."""

import re
from exceptions import ValidationError

def validate_ticker(ticker: str) -> str:
    """Validate and sanitize company ticker."""
    if not ticker:
        raise ValidationError("Ticker cannot be empty")
    
    # Remove whitespace and convert to uppercase
    ticker = ticker.strip().upper()
    
    # Check ticker format (1-5 characters, letters only)
    if not re.match(r'^[A-Z]{1,5}$', ticker):
        raise ValidationError("Ticker must be 1-5 uppercase letters only")
    
    return ticker

def validate_api_key(api_key: str, key_name: str) -> None:
    """Validate API key is present and non-empty."""
    if not api_key or not api_key.strip():
        raise ValidationError(f"{key_name} is required but not found")

def sanitize_text(text: str, max_length: int = 10000) -> str:
    """Sanitize text input by removing potentially harmful content."""
    if not text:
        return ""
    
    # Truncate if too long
    if len(text) > max_length:
        text = text[:max_length]
    
    # Remove potential script tags and other harmful content
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    
    return text.strip()
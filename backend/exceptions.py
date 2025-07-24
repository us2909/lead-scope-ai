# backend/exceptions.py

class LeadScopeAIError(Exception):
    """Base exception for the application."""
    pass

class ValidationError(LeadScopeAIError):
    """Raised for input validation errors."""
    pass

class ExternalAPIError(LeadScopeAIError):
    """Raised when an external API call fails."""
    pass

class DataParsingError(LeadScopeAIError):
    """Raised when parsing external data fails (e.g., scraping)."""
    pass

class AIGenerationError(LeadScopeAIError):
    """Raised for errors during AI content generation."""
    pass
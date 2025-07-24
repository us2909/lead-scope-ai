import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

class TestMainEndpoints:
    """Test cases for main API endpoints."""

    def test_read_root(self):
        """Test root endpoint returns welcome message."""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Welcome to the Lead-Scope AI Backend!"}

    def test_health_check(self):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "timestamp" in data

    @patch('scraper.get_company_context')
    @patch('ai_engine.generate_pain_cards')
    @patch('scope_engine.process_scope_and_cards')
    @patch('classifier.classify_company')
    def test_assessment_success(self, mock_classifier, mock_scope, mock_ai, mock_scraper):
        """Test successful assessment generation."""
        # Mock return values
        mock_scraper.return_value = ("Test context", {"companyName": "Test Corp", "industry": "Tech"})
        mock_ai.return_value = [{"title": "Test Pain", "blurb": "Test description"}]
        mock_scope.return_value = ([{"title": "Test Pain", "blurb": "Test description", "triggered_tiles": [], "triggering_keywords": []}], ["TEST-TILE"])
        mock_classifier.return_value = ("TMT", "US-based only")

        response = client.get("/api/v1/assessment/AAPL")
        assert response.status_code == 200
        
        data = response.json()
        assert "pain_cards" in data
        assert "scope_summary" in data
        assert "activated_tiles" in data

    def test_assessment_invalid_ticker(self):
        """Test assessment with invalid ticker format."""
        response = client.get("/api/v1/assessment/INVALID123")
        assert response.status_code == 400

    def test_assessment_empty_ticker(self):
        """Test assessment with empty ticker."""
        response = client.get("/api/v1/assessment/ ")
        assert response.status_code == 400

    @patch('scraper.get_company_context')
    def test_assessment_company_not_found(self, mock_scraper):
        """Test assessment when company is not found."""
        from exceptions import CompanyDataNotFoundError
        mock_scraper.side_effect = CompanyDataNotFoundError("Company not found")
        
        response = client.get("/api/v1/assessment/FAKE")
        assert response.status_code == 404
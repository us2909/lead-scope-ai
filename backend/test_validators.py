import pytest
from validators import validate_ticker, validate_api_key, sanitize_text
from exceptions import ValidationError

class TestValidators:
    """Test cases for input validators."""

    def test_validate_ticker_valid(self):
        """Test ticker validation with valid inputs."""
        assert validate_ticker("AAPL") == "AAPL"
        assert validate_ticker("msft") == "MSFT"
        assert validate_ticker(" GOOGL ") == "GOOGL"
        assert validate_ticker("T") == "T"

    def test_validate_ticker_invalid(self):
        """Test ticker validation with invalid inputs."""
        with pytest.raises(ValidationError):
            validate_ticker("")
        
        with pytest.raises(ValidationError):
            validate_ticker("TOOLONG")
        
        with pytest.raises(ValidationError):
            validate_ticker("123")
        
        with pytest.raises(ValidationError):
            validate_ticker("AA@L")

    def test_validate_api_key_valid(self):
        """Test API key validation with valid input."""
        validate_api_key("valid-key-123", "TEST_KEY")  # Should not raise

    def test_validate_api_key_invalid(self):
        """Test API key validation with invalid inputs."""
        with pytest.raises(ValidationError):
            validate_api_key("", "TEST_KEY")
        
        with pytest.raises(ValidationError):
            validate_api_key("   ", "TEST_KEY")
        
        with pytest.raises(ValidationError):
            validate_api_key(None, "TEST_KEY")

    def test_sanitize_text_normal(self):
        """Test text sanitization with normal input."""
        text = "This is normal text."
        assert sanitize_text(text) == text

    def test_sanitize_text_html(self):
        """Test text sanitization removes HTML."""
        text = "This has <script>alert('xss')</script> content"
        result = sanitize_text(text)
        assert "<script>" not in result
        assert "alert" not in result

    def test_sanitize_text_truncation(self):
        """Test text sanitization truncates long content."""
        text = "a" * 20000
        result = sanitize_text(text, max_length=1000)
        assert len(result) <= 1000
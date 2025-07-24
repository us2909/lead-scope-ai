# Lead-Scope AI

A full-stack application that generates CFO-level pain points and business transformation scope recommendations using AI analysis of company data.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google's Gemini AI to generate relevant pain points from company 10-K filings
- **Interactive Dashboard**: Multi-step wizard interface for pain point selection and customization
- **Real-time Data**: Fetches live company data from Financial Modeling Prep API
- **Scope Visualization**: Dynamic visualization of SAP S/4HANA transformation modules
- **Responsive Design**: Mobile-friendly interface built with Next.js and Tailwind CSS

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **FastAPI** web framework with automatic API documentation
- **Pydantic** for data validation and serialization
- **Rate limiting** and security middleware
- **Comprehensive error handling** and logging
- **Retry logic** for external API calls
- **Modular architecture** with separation of concerns

### Frontend (Next.js + TypeScript)
- **Next.js 15** with React 19
- **TypeScript** for type safety
- **Component-based architecture** with custom hooks
- **Tailwind CSS** for styling
- **Accessibility features** (ARIA labels, keyboard navigation)
- **Performance optimizations** (React.memo, proper state management)

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Google AI API key
- Financial Modeling Prep API key

## 🛠️ Installation

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lead-scope-ai
   ```

2. **Set up environment variables**
   ```bash
   # Copy example files
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   
   # Edit .env with your API keys
   GOOGLE_API_KEY=your_google_ai_api_key_here
   FMP_API_KEY=your_financial_modeling_prep_api_key_here
   ```

3. **Install dependencies**
   ```bash
   make install
   # OR manually:
   # cd backend && pip install -r requirements.txt
   # cd frontend && npm install
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   make dev-backend
   
   # Terminal 2 - Frontend  
   make dev-frontend
   ```

### Option 2: Docker

1. **Set up environment variables** (same as Option 1)

2. **Start with Docker Compose**
   ```bash
   make docker-build
   make docker-up
   ```

## 🧪 Testing

### Run all tests
```bash
make test
```

### Run tests with coverage
```bash
make test-coverage
```

### Backend tests only
```bash
cd backend && python -m pytest
```

### Frontend tests only
```bash
cd frontend && npm test
```

## 🔧 Code Quality

### Linting
```bash
make lint
```

### Formatting
```bash
make format
```

### Type checking
```bash
make type-check
```

### Pre-commit hooks
```bash
make pre-commit
```

## 📁 Project Structure

```
lead-scope-ai/
├── backend/                    # FastAPI backend
│   ├── main.py                # Main application entry point
│   ├── config.py              # Configuration management
│   ├── logger.py              # Logging setup
│   ├── validators.py          # Input validation
│   ├── exceptions.py          # Custom exceptions
│   ├── ai_engine.py           # AI integration
│   ├── scraper.py             # Data fetching
│   ├── scope_engine.py        # Business logic
│   ├── classifier.py          # Company classification
│   ├── schemas.py             # Pydantic models
│   ├── taxonomy.py            # Business rules
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   └── test_*.py              # Test files
├── frontend/                   # Next.js frontend
│   ├── app/                   # Next.js app directory
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/            # Reusable components
│   │   ├── PainCard.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── ScopeGrid.tsx
│   │   ├── FinalDashboard.tsx
│   │   └── __tests__/        # Component tests
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAssessment.ts
│   │   ├── usePainCardSelection.ts
│   │   └── __tests__/        # Hook tests
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   ├── lib/                   # Utility functions
│   │   └── scope-data.ts
│   ├── package.json           # Node.js dependencies
│   └── Dockerfile             # Docker configuration
├── docker-compose.yml         # Multi-container setup
├── .pre-commit-config.yaml    # Pre-commit hooks
├── Makefile                   # Development commands
└── README.md                  # This file
```

## 🔒 Security Features

- **Input validation** and sanitization
- **Rate limiting** to prevent abuse  
- **API key validation**
- **CORS configuration**
- **Security scanning** with Bandit
- **No hardcoded secrets**

## 🚀 API Endpoints

### `GET /`
Welcome message

### `GET /health`
Health check endpoint

### `GET /api/v1/assessment/{company_identifier}`
Generate assessment for a company ticker

**Parameters:**
- `company_identifier`: Company ticker symbol (e.g., "AAPL", "MSFT")

**Response:**
```json
{
  "pain_cards": [...],
  "scope_summary": "...",
  "activated_tiles": [...],
  "industry": "...",
  "revenue": 123456789,
  "classified_industry": "...",
  "geo_scope": "..."
}
```

## 🔧 Configuration

### Backend Environment Variables
- `GOOGLE_API_KEY`: Google AI API key
- `FMP_API_KEY`: Financial Modeling Prep API key
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `RATE_LIMIT_REQUESTS`: Rate limit per hour (default: 100)
- `LOG_LEVEL`: Logging level (default: INFO)
- `MAX_CONTEXT_WORDS`: Max words for AI context (default: 3000)

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://127.0.0.1:8000)

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure your `.env` file has valid API keys
   - Check API key permissions and quotas

2. **CORS Errors**
   - Verify `CORS_ORIGINS` includes your frontend URL
   - Check that both services are running

3. **Import Errors**
   - Run `pip install -r requirements.txt` in backend
   - Run `npm install` in frontend

4. **Rate Limiting**
   - Reduce request frequency
   - Check rate limit configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Install pre-commit hooks: `make install`
4. Make your changes
5. Run tests: `make test`
6. Run linting: `make lint`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google AI for Gemini API
- Financial Modeling Prep for market data
- FastAPI and Next.js communities
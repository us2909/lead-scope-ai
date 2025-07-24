.PHONY: help install test lint format build clean docker-build docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies for both frontend and backend
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing pre-commit hooks..."
	pre-commit install

test: ## Run tests for both frontend and backend
	@echo "Running backend tests..."
	cd backend && python -m pytest
	@echo "Running frontend tests..."
	cd frontend && npm test

test-coverage: ## Run tests with coverage
	@echo "Running backend tests with coverage..."
	cd backend && python -m pytest --cov=. --cov-report=html
	@echo "Running frontend tests with coverage..."
	cd frontend && npm run test:coverage

lint: ## Run linting for both frontend and backend
	@echo "Linting backend..."
	cd backend && flake8 .
	@echo "Linting frontend..."
	cd frontend && npm run lint

format: ## Format code for both frontend and backend
	@echo "Formatting backend code..."
	cd backend && black . && isort .
	@echo "Formatting frontend code..."
	cd frontend && prettier --write .

type-check: ## Run type checking
	@echo "Type checking backend..."
	cd backend && mypy . || true
	@echo "Type checking frontend..."
	cd frontend && npm run type-check

build: ## Build both applications
	@echo "Building backend..."
	cd backend && python -c "import compileall; compileall.compile_dir('.', force=True)"
	@echo "Building frontend..."
	cd frontend && npm run build

clean: ## Clean build artifacts
	@echo "Cleaning backend..."
	cd backend && find . -type d -name "__pycache__" -exec rm -rf {} + || true
	cd backend && find . -name "*.pyc" -delete || true
	@echo "Cleaning frontend..."
	cd frontend && rm -rf .next node_modules/.cache || true

docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start services with Docker Compose
	docker-compose up -d

docker-down: ## Stop services with Docker Compose
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

dev-backend: ## Start backend in development mode
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Start frontend in development mode
	cd frontend && npm run dev

pre-commit: ## Run pre-commit hooks
	pre-commit run --all-files
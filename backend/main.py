# backend/main.py
from fastapi import FastAPI

# Create an instance of the FastAPI application
app = FastAPI(
    title="Lead-Scope AI API",
    description="API for generating CFO-level pain points from company data.",
    version="0.1.0"
)

# Define the root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Lead-Scope AI Backend!"}

# Define the health check endpoint from our architecture plan
@app.get("/health")
def health_check():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok"}
# Lead-Scope AI: Generative AI Scoping Wizard

**Lead-Scope AI** is a full-stack web application designed to automate the initial research and scoping phase for business consultants. By leveraging Generative AI to analyze public SEC filings, this tool transforms hours of manual work into a 15-second, interactive "scoping wizard," providing a data-driven starting point for SAP S/4HANA transformation projects.

## The Problem

Consultants traditionally spend hours reading dense SEC 10-K filings to understand a potential client's business challenges. This manual process is slow, inconsistent, and delays the ability to provide immediate strategic value. Lead-Scope AI was built to solve this by automating the intelligence-gathering process.

## The Solution: An Interactive Wizard

This application provides an intuitive, gamified user experience:

1.  **Enter Ticker:** The user provides a public company's stock ticker.
2.  **AI Analysis:** The backend fetches the company's latest 10-K "Risk Factors" section and uses Google's Gemini AI to generate 8 distinct, CFO-level pain points.
3.  **Gamified Selection:** The UI presents these pain points in a paginated format (4 at a time), allowing the user to select the most relevant issues.
4.  **Contextual Questions:** The wizard asks targeted questions to gather data that cannot be found automatically (e.g., On-prem vs. Cloud infrastructure).
5.  **Dashboard Reveal:** Based on all inputs, the application generates a final dashboard mimicking the `igniteNow` UI, complete with auto-discovered company data and a pre-filled Business Transformation Scope Grid.

## Tech Stack

This project is a modern full-stack application built with the following technologies:

### Backend

* **Framework:** Python, FastAPI
* **AI:** Google Generative AI (Gemini), Prompt Engineering
* **Data:** Pydantic, Financial Modeling Prep API, BeautifulSoup4 (for SEC filing parsing)
* **Environment:** Python Virtual Environment (`venv`)

### Frontend

* **Framework:** React, Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Hooks (`useState`, `useMemo`)

## Local Setup and Installation

To run this project on your local machine, you will need two separate terminals.

### Prerequisites

* Node.js (LTS version recommended)
* Python 3.8+
* API Keys for [Google AI Studio](https://aistudio.google.com/) and [Financial Modeling Prep](https://site.financialmodelingprep.com/register) (free tiers are sufficient).

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate the environment:**
    * Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    * macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Create your environment file:**
    * Create a file named `.env` in the `backend` directory.
    * Add your API keys to it:
        ```
        GOOGLE_API_KEY="your_google_key_here"
        FMP_API_KEY="your_fmp_key_here"
        ```

6.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running on `http://localhost:8000`.

### Frontend Setup

1.  **Open a new terminal** and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend server:**
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:3000`. You can now access the application in your browser.

## Architectural Flow

```mermaid
graph TD
    A[User @ Next.js Frontend] -- Enters Ticker --> B(FastAPI Backend);
    B -- Gets 10-K Link --> C[FMP API];
    C -- Returns Filing URL --> B;
    B -- Scrapes 'Risk Factors' --> D[SEC EDGAR Database];
    D -- Returns Raw Text --> B;
    B -- Sends Context to AI --> E[Google Gemini API];
    E -- Generates Pain Cards --> B;
    B -- Runs Classifier & Scope Engine --> B;
    B -- Returns Full Assessment --> A;
    A -- Renders Interactive Wizard --> A;

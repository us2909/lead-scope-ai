Lead-Scope AI: Project Overview & Technical Summary
1. Executive Summary
Lead-Scope AI is a full-stack, Generative AI-powered web application designed to dramatically accelerate the pre-sales and initial engagement cycle for business consultants. By ingesting and analyzing real-time public financial data, the tool automates the generation of CFO-level pain points for any given public company. It transforms hours of manual research into a 15-second, interactive "scoping wizard," empowering consultants to lead with data-driven, strategic insights from the very first client interaction. This Proof-of-Concept (PoC) successfully validates the core hypothesis and provides a robust foundation for future enterprise-grade enhancements.

2. The Business Problem
In the competitive consulting landscape, the initial client engagement is critical. However, the preparation process is often inefficient and inconsistent:

Time-Consuming: Consultants spend several hours manually reading dense SEC 10-K filings and financial news to understand a potential client's challenges.

Inconsistent Quality: The depth of insight varies significantly based on the consultant's experience and the time available for research.

Reactive Engagement: This manual-first approach delays the ability to provide immediate, tangible value, forcing consultants to spend initial meetings on discovery rather than strategy.

The core challenge was to automate this intelligence-gathering process, freeing up consultants to focus on high-value strategic activities.

3. The Solution: An Interactive Scoping Wizard
Lead-Scope AI addresses this challenge through an intuitive, gamified user experience:

The Hook: A consultant enters a company's stock ticker (e.g., AAPL). The application's backend fetches and analyzes the company's latest 10-K "Risk Factors" section.

AI-Powered Insight: Using a sophisticated prompt with Google's Gemini LLM, the system generates 8 distinct, CFO-level pain points.

Gamified Selection: The UI presents these pain points to the user in a paginated "wizard" format (4 cards at a time), allowing the consultant to review and select the most relevant issues.

Contextual Questions: The wizard then asks a few targeted questions to gather information that cannot be found automatically (e.g., "Is the current infrastructure on-prem?").

The Reveal: Based on the user's selections, the application instantly generates a final dashboard that mimics the igniteNow input screen. This dashboard displays:

Auto-discovered company data (Industry, Revenue).

The user's answers to the contextual questions.

A pre-filled Business Transformation Scope Grid, where the selected modules are dynamically calculated based on the chosen pain points.

This workflow transforms a tedious research task into an engaging, interactive process that delivers a tailored, defensible starting point for a client proposal.

4. Technical Architecture
The application is built on a modern full-stack architecture, with a clear separation between the frontend user experience and the backend data processing engine.

Backend (Python & FastAPI)
Framework: FastAPI was chosen for its high performance, asynchronous capabilities, and automatic data validation powered by Pydantic.

Data Aggregation (scraper.py): The system uses a multi-step data fetching pipeline. It calls the Financial Modeling Prep (FMP) API to get both a company's structured profile data (for revenue, industry) and the direct link to its latest 10-K filing on the SEC's EDGAR database. It then scrapes the "Risk Factors" section from the filing to use as a high-quality context for the AI.

AI Engine (ai_engine.py): This module uses the Google Generative AI SDK to interact with the gemini-1.5-flash model. It leverages advanced Prompt Engineering to instruct the AI to generate a specific number of pain points and categorize them.

Business Logic (classifier.py, scope_engine.py):

A custom Classifier maps raw industry data from the API into the firm's standard categories (e.g., TMT, FSI).

A two-layer Rule Engine parses the AI-generated pain cards, using both thematic and keyword-based rules defined in taxonomy.py to determine which SAP modules should be included in the initial scope.

Frontend (React & Next.js)
Framework: Next.js (App Router) was chosen for its robust framework, server-side rendering capabilities, and seamless developer experience with TypeScript.

State Management: The application's complex, multi-step "wizard" flow is managed using React Hooks, primarily useState (to track the current step, user inputs, and API responses) and useMemo (to performantly recalculate the scope grid based on user selections).

Styling: Tailwind CSS is used for all styling, enabling rapid development of a clean, modern, and fully responsive user interface.

Component-Based Architecture: The UI is broken down into reusable components (PainCard, ScopeGrid, DashboardView, etc.), making the code clean, maintainable, and scalable.

5. Key Learnings & Challenges Overcome
The development of this PoC involved overcoming several real-world engineering challenges, demonstrating robust problem-solving skills:

Architectural Pivot (Scraping vs. API): The initial approach involved web scraping news headlines. After encountering significant reliability issues due to anti-bot measures and changing website layouts (a common problem in scraping), a strategic decision was made to pivot. The final architecture is far more robust, using a direct API call to get a link to a stable data source (SEC filings), demonstrating the ability to choose the right tool for the job and prioritize reliability.

Environment & Dependency Debugging: The project required overcoming a series of complex local environment issues related to Node.js versions, build tool caches (Turbopack vs. Webpack), and CSS compilation. Successfully diagnosing and resolving these issues required a deep, systematic approach to debugging that went beyond simple code changes.

Iterative UI/UX Refinement: The project evolved from a simple "one-shot" display to a sophisticated, multi-step wizard based on user feedback and design thinking. This demonstrates an agile approach and a focus on building a truly effective and engaging user experience.

6. Technology & Skills Showcase
This project provided hands-on experience across the full stack, from backend API design to modern frontend development and AI integration.

Backend Development:

Python & FastAPI: Built a high-performance RESTful API from scratch, defining routes, handling requests, and structuring responses with Pydantic data models.

API Integration: Successfully integrated with third-party APIs (Financial Modeling Prep) for data retrieval and managed authentication using API keys and environment variables.

Web Scraping: Implemented a robust web scraper using requests and BeautifulSoup to parse complex HTML from official SEC filings, including handling necessary HTTP headers for compliance.

Business Logic: Designed and implemented a multi-layered rule engine and a custom classifier to translate raw data into actionable business insights.

Frontend Development:

React & Next.js: Developed a dynamic, single-page application (SPA) using modern React features, including functional components and hooks (useState, useMemo).

TypeScript: Built a type-safe frontend, defining interfaces for API data structures to prevent common errors and improve code quality.

State Management & UI/UX: Architected a complex, multi-step "wizard" interface, managing application state to create a seamless and interactive user journey.

CSS & Styling: Utilized Tailwind CSS for rapid, utility-first styling to create a clean and responsive user interface.

Generative AI & LLMs:

Prompt Engineering: Designed and iterated on sophisticated prompts to control the output of the Gemini LLM, instructing it to generate structured JSON, categorize information, and adhere to specific business rules.

AI Integration: Implemented the end-to-end flow of fetching real-world context, passing it to an LLM, and parsing the structured JSON response for use in an application.

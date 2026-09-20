# System Architecture

## 1. Overview

The **Generation of AI Powered Synthetic Users for Product Research** platform follows a modular full-stack architecture.

The system consists of:

* Frontend
* Backend API
* AI Service Layer
* Database
* Report Generation Service

The architecture is designed to keep the user interface, business logic, database operations, and AI functionality separate.

---

# 2. High-Level Architecture

```text
                         RESEARCHER
                             │
                             ▼
                ┌─────────────────────────┐
                │   React + Vite +        │
                │   Tailwind CSS          │
                │       FRONTEND          │
                └────────────┬────────────┘
                             │
                       REST API / JSON
                             │
                             ▼
                ┌─────────────────────────┐
                │        FastAPI          │
                │       BACKEND            │
                ├─────────────────────────┤
                │ Authentication          │
                │ Project Management       │
                │ Persona Management      │
                │ Survey Management        │
                │ Interview Management     │
                │ Insight Management       │
                │ Report Management        │
                └───────┬─────────┬───────┘
                        │         │
                        │         │
                        ▼         ▼
              ┌──────────────┐  ┌────────────────────┐
              │ PostgreSQL   │  │    AI Service      │
              │  Database   │  │      Layer         │
              └──────────────┘  ├────────────────────┤
                                │ Persona Generator  │
                                │ Survey Agent       │
                                │ Interview Agent    │
                                │ Insight Agent      │
                                │ Report Generator   │
                                └─────────┬──────────┘
                                          │
                                          ▼
                                ┌────────────────────┐
                                │   AI Provider      │
                                │ OpenAI / Gemini    │
                                └────────────────────┘
```

---

# 3. Frontend

## Technology

* React
* Vite
* Tailwind CSS

The frontend provides the interface through which the researcher interacts with the platform.

## Main Frontend Sections

```text
Dashboard
│
├── Projects
│
├── Product Configuration
│
├── Personas
│
├── Surveys
│
├── Interviews
│
├── Insights
│
├── Reports
│
└── Settings
```

## Responsibilities

The frontend will:

* Allow researchers to create projects.
* Collect product information.
* Collect target-market information.
* Request persona generation.
* Display generated personas.
* Create and manage surveys.
* Display survey responses.
* Provide an interview chat interface.
* Display extracted insights.
* Display research reports.
* Allow PDF report downloads.

The frontend should not directly communicate with the AI provider or database.

All requests should go through the FastAPI backend.

---

# 4. Backend

## Technology

**FastAPI + Python**

The backend acts as the central application layer.

It receives requests from the frontend, performs validation and business logic, communicates with the database, and invokes the required AI service.

## Backend Responsibilities

### Authentication

Handles:

* User registration
* User login
* Password hashing
* JWT authentication
* Access control

### Project Management

Handles:

* Creating projects
* Updating projects
* Retrieving projects
* Deleting projects

A project contains the product being researched and its target market.

### Persona Management

Handles:

* Persona generation requests
* Persona validation
* Persona storage
* Persona retrieval

### Survey Management

Handles:

* Survey creation
* Question management
* Survey execution
* Response storage
* Response retrieval

### Interview Management

Handles:

* Interview session creation
* Message storage
* Persona context retrieval
* Interview response generation
* Conversation memory

### Insight Management

Handles:

* Starting insight extraction
* Storing extracted insights
* Retrieving insights

### Report Management

Handles:

* Report generation
* Report status
* PDF generation
* Report retrieval

---

# 5. AI Service Layer

The AI service layer separates AI functionality from the rest of the application.

This makes it possible to change the AI provider without rewriting the entire backend.

For example:

```text
FastAPI
   │
   ▼
AI Service Layer
   │
   ├── OpenAI Provider
   │
   └── Gemini Provider
```

The application can select the provider through configuration.

---

# 6. AI Agents

## 6.1 Persona Generator

### Input

```text
Product
Product Description
Target Market
Required Persona Count
```

### Processing

The AI generates diverse synthetic users according to the target market.

### Output

Structured persona data.

```text
Persona
├── Identity
├── Financial Profile
├── Goals
├── Psychology
├── Technology Profile
└── Behavioral Profile
```

The generated output is validated using a structured schema before being stored in PostgreSQL.

---

# 6.2 Survey Response Agent

The Survey Response Agent generates answers to survey questions from the perspective of a selected synthetic persona.

### Input

```text
Persona Profile
+
Survey Question
+
Research Context
```

### Output

```text
Persona Response
```

The response is stored in the database.

Each persona answers independently so that responses can later be compared.

---

# 6.3 Interview Agent

The Interview Agent simulates a conversation between the researcher and a selected synthetic persona.

### Input

```text
Persona Core Profile
+
Long-Term Memory Summary
+
Recent Conversation
+
Researcher Question
```

### Output

```text
Persona Response
```

The agent must preserve the persona's:

* Identity
* Personality
* Goals
* Preferences
* Behavioral characteristics
* Relevant previous statements

This prevents the persona from changing characteristics randomly during an interview.

---

# 6.4 Insight Extraction Agent

The Insight Extraction Agent analyzes collected synthetic-user responses.

### Input

```text
Survey Responses
+
Interview Conversations
+
Persona Profiles
```

### Output

```text
Themes
Sentiment
Pain Points
Feature Preferences
Behavioral Patterns
User Segments
Recommendations
```

The output should be structured and stored in the database.

---

# 6.5 Report Generator

The Report Generator converts structured insights into a research report.

### Input

```text
Research Information
+
Persona Summary
+
Survey Results
+
Interview Results
+
Extracted Insights
```

### Output

```text
Structured Research Report
        ↓
PDF
```

The initial implementation will use **ReportLab** for PDF generation.

---

# 7. Database Layer

## Technology

**PostgreSQL**

The database stores persistent application data.

The backend communicates with PostgreSQL through:

**SQLAlchemy ORM**

The database will contain the following core entities:

```text
Users
Projects
Personas
Surveys
Survey Questions
Survey Responses
Interview Sessions
Interview Messages
Insights
Reports
```

The detailed database structure is defined separately in:

```text
docs/database-design.md
```

---

# 8. Request Flow

## Example: Generate Personas

```text
Researcher
    │
    ▼
React Frontend
    │
    │ POST /projects/{id}/personas/generate
    ▼
FastAPI
    │
    ▼
Persona Service
    │
    ▼
AI Service Layer
    │
    ▼
AI Provider
    │
    ▼
Structured Persona JSON
    │
    ▼
Pydantic Validation
    │
    ▼
SQLAlchemy
    │
    ▼
PostgreSQL
    │
    ▼
FastAPI Response
    │
    ▼
React Frontend
    │
    ▼
Generated Personas
```

---

# 9. Survey Flow

```text
Researcher
    │
    ▼
Create Survey
    │
    ▼
Add Questions
    │
    ▼
Select Personas
    │
    ▼
Run Survey
    │
    ▼
FastAPI
    │
    ▼
Survey Response Agent
    │
    ├── Persona 1 → Response
    ├── Persona 2 → Response
    ├── Persona 3 → Response
    └── Persona N → Response
    │
    ▼
PostgreSQL
    │
    ▼
Survey Comparison
```

---

# 10. Interview Flow

```text
Researcher
    │
    ▼
Select Persona
    │
    ▼
Start Interview
    │
    ▼
Researcher asks question
    │
    ▼
FastAPI
    │
    ▼
Interview Agent
    │
    ├── Persona Profile
    ├── Memory Summary
    └── Recent Messages
    │
    ▼
AI Provider
    │
    ▼
Persona Response
    │
    ▼
Store Message
    │
    ▼
Display Response
```

---

# 11. Insight Generation Flow

```text
Survey Responses
       +
Interview Messages
       +
Persona Profiles
       │
       ▼
Insight Extraction Agent
       │
       ├── Theme Detection
       ├── Sentiment Analysis
       ├── Pain Point Detection
       ├── Feature Preference Analysis
       ├── Behavioral Analysis
       └── User Segmentation
       │
       ▼
Structured Insights
       │
       ▼
PostgreSQL
       │
       ▼
Research Dashboard
```

---

# 12. Report Generation Flow

```text
Research Data
     │
     ▼
Insight Extraction
     │
     ▼
Structured Findings
     │
     ▼
Report Generator
     │
     ▼
Report Template
     │
     ▼
ReportLab
     │
     ▼
PDF Report
```

---

# 13. Security Architecture

The system will implement basic application security.

### Authentication

JWT-based authentication will be used for protected API endpoints.

### Password Security

Passwords will never be stored as plain text.

Passwords will be securely hashed before being stored.

### API Security

Protected endpoints will verify the authenticated user's identity.

### Environment Variables

API keys and database credentials will be stored in environment variables.

Example:

```text
DATABASE_URL
AI_PROVIDER
OPENAI_API_KEY
GEMINI_API_KEY
JWT_SECRET_KEY
```

These values must not be committed to GitHub.

---

# 14. AI Output Validation

AI models can sometimes produce invalid or unexpected output.

Therefore, important AI responses will follow this process:

```text
AI Model
   ↓
Structured JSON
   ↓
Pydantic Validation
   ↓
Valid?
 ┌─┴─────────┐
 │           │
YES          NO
 │           │
 ▼           ▼
Database    Retry /
            Error Handling
```

This is especially important for persona generation and insight extraction.

---

# 15. Scalability

The initial application will use:

```text
React
   ↓
FastAPI
   ↓
PostgreSQL
```

AI operations will initially be handled through the FastAPI application.

If expensive operations become too slow, background processing can later be introduced:

```text
FastAPI
   ↓
Redis
   ↓
Celery Workers
   ↓
AI / PDF Processing
```

Redis and Celery are therefore considered **future scalability components**, not mandatory components of the initial MVP.

---

# 16. Deployment Architecture

The application will be containerized using Docker.

Initial deployment structure:

```text
┌────────────────────────────────────┐
│          Docker Compose            │
│                                    │
│  ┌────────────┐  ┌──────────────┐ │
│  │  Frontend  │  │   Backend    │ │
│  │   React    │  │   FastAPI    │ │
│  └────────────┘  └──────┬───────┘ │
│                          │         │
│                   ┌──────▼──────┐  │
│                   │ PostgreSQL  │  │
│                   └─────────────┘  │
└────────────────────────────────────┘
```

AI providers will be accessed through their APIs rather than hosted inside the application containers.

---

# 17. Design Principles

The architecture follows these principles:

1. **Modularity** – each major responsibility is separated.
2. **Provider Independence** – AI providers can be changed without rewriting the application.
3. **Data Consistency** – persona information remains consistent across research activities.
4. **Structured AI Output** – important AI responses are validated before storage.
5. **Security** – authentication and secret management are built into the architecture.
6. **Scalability** – expensive background processing can be introduced later.
7. **Maintainability** – frontend, backend, database, and AI services remain separated.
8. **Research Transparency** – synthetic findings are clearly identified as simulated results.

---

# 18. Final Architecture

The final architecture is:

```text
                         RESEARCHER
                             │
                             ▼
                  ┌────────────────────┐
                  │ React + Vite       │
                  │ Tailwind CSS       │
                  └─────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                  ┌────────────────────┐
                  │      FastAPI       │
                  │                    │
                  │ Auth               │
                  │ Projects           │
                  │ Personas           │
                  │ Surveys            │
                  │ Interviews         │
                  │ Insights           │
                  │ Reports            │
                  └──────┬───────┬─────┘
                         │       │
                         │       ▼
                         │  ┌───────────────┐
                         │  │ AI Services   │
                         │  ├───────────────┤
                         │  │ Persona Agent │
                         │  │ Survey Agent  │
                         │  │ Interview     │
                         │  │ Insight Agent │
                         │  │ Report Gen.   │
                         │  └───────┬───────┘
                         │          │
                         ▼          ▼
                  ┌────────────┐  ┌──────────────┐
                  │ PostgreSQL │  │ OpenAI /     │
                  │ + SQLAlchemy│  │ Gemini       │
                  └────────────┘  └──────────────┘
```

This architecture will be used as the foundation for the implementation phases of the project.

# API Design

## 1. Overview

The backend exposes a RESTful API using **FastAPI**.

The React frontend communicates with the backend using HTTP requests and JSON.

The API is responsible for:

* Authentication
* Project management
* Persona generation
* Survey management
* Survey execution
* Interview management
* Insight extraction
* Report generation

---

# 2. Base URL

During local development:

```text
http://localhost:8000/api/v1
```

All application endpoints will be organized under:

```text
/api/v1
```

This allows future API versions to be introduced without breaking existing clients.

---

# 3. API Response Format

Successful responses should follow a consistent structure where appropriate.

Example:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

Error responses should provide a useful message.

Example:

```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "The requested project does not exist."
  }
}
```

FastAPI's standard HTTP status codes will also be used.

---

# 4. Authentication APIs

Authentication is required before accessing protected research resources.

## 4.1 Register

```http
POST /api/v1/auth/register
```

### Request

```json
{
  "full_name": "Abhishek",
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Abhishek",
    "email": "user@example.com"
  },
  "message": "User registered successfully"
}
```

---

# 5. Login

```http
POST /api/v1/auth/login
```

### Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "access_token": "jwt-token",
    "token_type": "bearer"
  },
  "message": "Login successful"
}
```

The access token will be used for protected API requests.

Example:

```http
Authorization: Bearer <access_token>
```

---

# 6. Project APIs

## 6.1 Create Project

```http
POST /api/v1/projects
```

### Request

```json
{
  "name": "FinWise Product Research",
  "product_name": "FinWise",
  "product_description": "AI Financial Copilot for Irregular-Income Workers",
  "target_market": "Freelancers, creators, gig workers, and independent professionals aged 22–40 with irregular monthly income.",
  "features": [
    "Income Volatility Predictor",
    "Adaptive Budget Engine",
    "Goal Allocation Engine",
    "Client Payment Risk Analyzer",
    "Financial What-If Simulator"
  ]
}
```

### Response

Returns the created project.

---

# 7. Get Projects

```http
GET /api/v1/projects
```

Returns all projects owned by the authenticated researcher.

---

# 8. Get Project

```http
GET /api/v1/projects/{project_id}
```

Returns details of a specific project.

---

# 9. Update Project

```http
PUT /api/v1/projects/{project_id}
```

Updates project information.

---

# 10. Delete Project

```http
DELETE /api/v1/projects/{project_id}
```

Deletes the project and its associated research data according to the database cascade rules.

---

# 11. Persona APIs

## 11.1 Generate Personas

```http
POST /api/v1/projects/{project_id}/personas/generate
```

### Request

```json
{
  "count": 10
}
```

### Processing

```text
Project
   ↓
Product Information
   ↓
Target Market
   ↓
AI Persona Generator
   ↓
Validation
   ↓
PostgreSQL
```

### Response

Returns the generated personas.

---

# 12. Get Personas

```http
GET /api/v1/projects/{project_id}/personas
```

Returns all personas belonging to a project.

---

# 13. Get Persona

```http
GET /api/v1/personas/{persona_id}
```

Returns detailed information about one persona.

---

# 14. Delete Persona

```http
DELETE /api/v1/personas/{persona_id}
```

Deletes a synthetic persona.

---

# 15. Survey APIs

## 15.1 Create Survey

```http
POST /api/v1/projects/{project_id}/surveys
```

### Request

```json
{
  "title": "FinWise Feature Validation Survey",
  "description": "Evaluate user interest in FinWise features."
}
```

---

# 16. Get Surveys

```http
GET /api/v1/projects/{project_id}/surveys
```

Returns all surveys associated with a project.

---

# 17. Get Survey

```http
GET /api/v1/surveys/{survey_id}
```

Returns survey information and questions.

---

# 18. Add Survey Question

```http
POST /api/v1/surveys/{survey_id}/questions
```

### Request

```json
{
  "question_text": "How useful would an Income Volatility Predictor be to you?",
  "question_type": "rating",
  "options": [
    "1",
    "2",
    "3",
    "4",
    "5"
  ],
  "display_order": 1
}
```

---

# 19. Update Survey Question

```http
PUT /api/v1/survey-questions/{question_id}
```

Updates an existing survey question.

---

# 20. Delete Survey Question

```http
DELETE /api/v1/survey-questions/{question_id}
```

Deletes a survey question.

---

# 21. Run Survey

```http
POST /api/v1/surveys/{survey_id}/run
```

### Request

```json
{
  "persona_ids": [
    "persona-uuid-1",
    "persona-uuid-2",
    "persona-uuid-3"
  ]
}
```

### Processing

```text
Survey
   +
Selected Personas
   ↓
Survey Response Agent
   ↓
Persona 1 → Response
Persona 2 → Response
Persona 3 → Response
   ↓
Database
```

---

# 22. Get Survey Responses

```http
GET /api/v1/surveys/{survey_id}/responses
```

Returns responses generated by the selected personas.

---

# 23. Interview APIs

## 23.1 Create Interview Session

```http
POST /api/v1/projects/{project_id}/interviews
```

### Request

```json
{
  "persona_id": "persona-uuid",
  "title": "FinWise Feature Discovery Interview"
}
```

### Response

Returns a newly created interview session.

---

# 24. Get Interview Sessions

```http
GET /api/v1/projects/{project_id}/interviews
```

Returns interview sessions for the project.

---

# 25. Get Interview Session

```http
GET /api/v1/interviews/{session_id}
```

Returns the interview session and its messages.

---

# 26. Send Interview Message

```http
POST /api/v1/interviews/{session_id}/messages
```

### Request

```json
{
  "message": "Would you trust FinWise to analyze your financial data?"
}
```

### Processing

```text
Researcher Message
        ↓
FastAPI
        ↓
Persona Profile
        +
Memory Summary
        +
Recent Messages
        ↓
Interview Agent
        ↓
AI Provider
        ↓
Persona Response
        ↓
Store Both Messages
```

### Response

```json
{
  "researcher_message": {
    "id": "uuid",
    "message": "Would you trust FinWise to analyze your financial data?"
  },
  "persona_message": {
    "id": "uuid",
    "message": "I would be somewhat comfortable..."
  }
}
```

---

# 27. End Interview

```http
POST /api/v1/interviews/{session_id}/complete
```

Marks an interview session as completed.

---

# 28. Get Interview Messages

```http
GET /api/v1/interviews/{session_id}/messages
```

Returns the conversation history.

---

# 29. Insight APIs

## 29.1 Generate Insights

```http
POST /api/v1/projects/{project_id}/insights/generate
```

### Request

```json
{
  "include_surveys": true,
  "include_interviews": true
}
```

### Processing

```text
Survey Responses
       +
Interview Messages
       +
Persona Profiles
       ↓
Insight Extraction Agent
       ↓
Structured Insights
       ↓
PostgreSQL
```

---

# 30. Get Project Insights

```http
GET /api/v1/projects/{project_id}/insights
```

Returns all generated insights for the project.

---

# 31. Get Insight

```http
GET /api/v1/insights/{insight_id}
```

Returns detailed information about a specific insight.

---

# 32. Report APIs

## 32.1 Generate Report

```http
POST /api/v1/projects/{project_id}/reports
```

### Request

```json
{
  "title": "FinWise Synthetic User Research Report"
}
```

### Processing

```text
Project Data
     +
Survey Results
     +
Interview Results
     +
Insights
     ↓
Report Generator
     ↓
Structured Report
     ↓
ReportLab
     ↓
PDF
```

---

# 33. Get Reports

```http
GET /api/v1/projects/{project_id}/reports
```

Returns reports generated for the project.

---

# 34. Get Report

```http
GET /api/v1/reports/{report_id}
```

Returns report information and generation status.

---

# 35. Download Report

```http
GET /api/v1/reports/{report_id}/download
```

Returns the generated PDF file.

---

# 36. Health Check

The backend will expose a health-check endpoint.

```http
GET /api/v1/health
```

### Response

```json
{
  "status": "healthy"
}
```

This will be useful for Docker and deployment monitoring.

---

# 37. HTTP Status Codes

The API will use standard HTTP status codes.

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 200    | Successful request                       |
| 201    | Resource created                         |
| 204    | Successful request with no response body |
| 400    | Invalid request                          |
| 401    | Authentication required/failed           |
| 403    | Access denied                            |
| 404    | Resource not found                       |
| 409    | Resource conflict                        |
| 422    | Validation error                         |
| 500    | Internal server error                    |
| 502    | AI provider/API failure                  |

---

# 38. Authentication and Authorization

Protected endpoints will require a valid JWT.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend will identify the researcher from the token and ensure that the researcher has permission to access the requested project.

For example:

```text
User A
  ↓
Project A
  ↓
Personas / Surveys / Interviews / Insights / Reports
```

User A must not be able to access User B's project by changing an ID in the URL.

---

# 39. API Validation

FastAPI and Pydantic schemas will validate incoming requests.

Example:

```text
Frontend Request
      ↓
FastAPI
      ↓
Pydantic Validation
      │
      ├── Valid → Business Logic
      │
      └── Invalid → 422 Response
```

AI-generated data will also be validated using Pydantic models before being stored.

---

# 40. API Error Handling

The API should return meaningful errors.

Example:

```json
{
  "success": false,
  "error": {
    "code": "PERSONA_GENERATION_FAILED",
    "message": "Unable to generate personas at this time."
  }
}
```

Internal errors and sensitive information should not be exposed to the frontend.

---

# 41. API Versioning

The initial API version is:

```text
/api/v1
```

Future versions can use:

```text
/api/v2
```

This allows the API to evolve without immediately breaking existing clients.

---

# 42. Complete API Structure

```text
/api/v1
│
├── /health
│
├── /auth
│   ├── POST /register
│   └── POST /login
│
├── /projects
│   ├── POST /
│   ├── GET /
│   ├── GET /{project_id}
│   ├── PUT /{project_id}
│   ├── DELETE /{project_id}
│   │
│   ├── /{project_id}/personas
│   │   ├── POST /generate
│   │   └── GET /
│   │
│   ├── /{project_id}/surveys
│   │   ├── POST /
│   │   └── GET /
│   │
│   ├── /{project_id}/interviews
│   │   ├── POST /
│   │   └── GET /
│   │
│   ├── /{project_id}/insights
│   │   ├── POST /generate
│   │   └── GET /
│   │
│   └── /{project_id}/reports
│       ├── POST /
│       └── GET /
│
├── /personas
│   └── GET /{persona_id}
│
├── /surveys
│   └── GET /{survey_id}
│
├── /survey-questions
│   ├── PUT /{question_id}
│   └── DELETE /{question_id}
│
├── /interviews
│   ├── GET /{session_id}
│   ├── POST /{session_id}/messages
│   ├── GET /{session_id}/messages
│   └── POST /{session_id}/complete
│
├── /insights
│   └── GET /{insight_id}
│
└── /reports
    ├── GET /{report_id}
    └── GET /{report_id}/download
```

---

# 43. API Design Principles

The API follows these principles:

1. **RESTful structure** for application resources.
2. **API versioning** through `/api/v1`.
3. **JWT authentication** for protected resources.
4. **Pydantic validation** for request and response data.
5. **Consistent error handling**.
6. **Resource-based URLs**.
7. **Proper HTTP status codes**.
8. **Authorization checks** for project ownership.
9. **AI provider abstraction** behind backend services.
10. **No direct frontend access to PostgreSQL or AI providers**.

---

# 44. End-to-End Application Flow

The complete application flow is:

```text
                    RESEARCHER
                        │
                        ▼
                 React Frontend
                        │
                        ▼
                  FastAPI API
                        │
            ┌───────────┼───────────┐
            │           │           │
            ▼           ▼           ▼
        PostgreSQL   AI Services   Reports
                        │
              ┌─────────┼─────────┐
              │         │         │
              ▼         ▼         ▼
           Persona    Survey    Interview
           Agent      Agent      Agent
              │         │         │
              └─────────┼─────────┘
                        ▼
                  Research Data
                        │
                        ▼
                 Insight Agent
                        │
                        ▼
                    Insights
                        │
                        ▼
                 Report Generator
                        │
                        ▼
                       PDF
```

---

# 45. Future API Extensions

The following APIs may be added in later versions:

* Persona regeneration
* Persona comparison
* Survey result statistics
* Interview memory management
* Insight verification
* Research-run comparison
* AI usage tracking
* Team collaboration
* Project sharing
* Advanced analytics
* Export to CSV/Excel

These are outside the initial MVP API scope.

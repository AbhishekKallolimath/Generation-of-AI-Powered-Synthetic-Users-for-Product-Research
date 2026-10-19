# Database Design

## 1. Database Overview

The system uses **PostgreSQL** as the primary relational database.

**SQLAlchemy** will be used as the Object-Relational Mapper (ORM) between the FastAPI backend and PostgreSQL.

The database stores:

* Researcher accounts
* Research projects
* Synthetic personas
* Surveys and questions
* Synthetic survey responses
* Interview sessions
* Interview messages
* Extracted research insights
* Generated reports

---

# 2. Entity Relationship Overview

The main relationships are:

```text
User
 │
 └──< Project
         │
         ├──< Persona
         │
         ├──< Survey
         │      │
         │      └──< Survey Question
         │                 │
         │                 └──< Survey Response
         │
         ├──< Interview Session
         │      │
         │      └──< Interview Message
         │
         ├──< Insight
         │
         └──< Report
```

Where:

```text
1 ───< N
```

means one record can be associated with many records.

For example:

```text
One Project
     ↓
Many Personas
```

---

# 3. Users Table

The `users` table stores researcher accounts.

### Table: `users`

| Column        | Type         | Constraints      | Description            |
| ------------- | ------------ | ---------------- | ---------------------- |
| id            | UUID         | Primary Key      | Unique user identifier |
| email         | VARCHAR(255) | UNIQUE, NOT NULL | Researcher's email     |
| password_hash | VARCHAR(255) | NOT NULL         | Hashed password        |
| full_name     | VARCHAR(150) | NOT NULL         | Researcher's name      |
| created_at    | TIMESTAMP    | NOT NULL         | Account creation time  |
| updated_at    | TIMESTAMP    | NOT NULL         | Last update time       |

### Relationships

```text
User 1 ───< Projects
```

A researcher can own multiple research projects.

---

# 4. Projects Table

The `projects` table represents a product research project.

For our case study, one project could represent research for:

**FinWise – AI Financial Copilot for Irregular-Income Workers**

### Table: `projects`

| Column              | Type         | Constraints | Description               |
| ------------------- | ------------ | ----------- | ------------------------- |
| id                  | UUID         | Primary Key | Unique project identifier |
| user_id             | UUID         | Foreign Key | Project owner             |
| name                | VARCHAR(200) | NOT NULL    | Research project name     |
| product_name        | VARCHAR(200) | NOT NULL    | Product being researched  |
| product_description | TEXT         | NOT NULL    | Product description       |
| target_market       | TEXT         | NOT NULL    | Target audience           |
| features            | JSONB        | NOT NULL    | Product features          |
| created_at          | TIMESTAMP    | NOT NULL    | Creation time             |
| updated_at          | TIMESTAMP    | NOT NULL    | Last update time          |

### Relationship

```text
User
 │
 └──< Project
```

---

# 5. Personas Table

The `personas` table stores AI-generated synthetic users.

### Table: `personas`

| Column             | Type         | Constraints | Description                        |
| ------------------ | ------------ | ----------- | ---------------------------------- |
| id                 | UUID         | Primary Key | Unique persona identifier          |
| project_id         | UUID         | Foreign Key | Associated project                 |
| name               | VARCHAR(150) | NOT NULL    | Persona name                       |
| age                | INTEGER      | NOT NULL    | Persona age                        |
| profession         | VARCHAR(150) | NOT NULL    | Profession                         |
| location           | VARCHAR(150) | NOT NULL    | Location                           |
| financial_profile  | JSONB        | NOT NULL    | Financial characteristics          |
| goals              | JSONB        | NOT NULL    | Financial/life goals               |
| psychology         | JSONB        | NOT NULL    | Psychological characteristics      |
| technology_profile | JSONB        | NOT NULL    | Technology-related characteristics |
| behavioral_profile | JSONB        | NOT NULL    | Behavioral characteristics         |
| memory_summary     | TEXT         | NULL        | Long-term interview memory         |
| created_at         | TIMESTAMP    | NOT NULL    | Persona creation time              |
| updated_at         | TIMESTAMP    | NOT NULL    | Last update time                   |

### Relationship

```text
Project
   │
   └──< Personas
```

---

# 6. Persona Data Structure

Persona information is divided into structured JSONB sections.

### Financial Profile

```json
{
  "monthly_income": 85000,
  "income_volatility": "high",
  "savings": 250000,
  "debt": 50000,
  "emergency_fund_months": 3
}
```

### Goals

```json
{
  "short_term": [
    "Build emergency fund"
  ],
  "long_term": [
    "Invest for retirement",
    "Buy a house"
  ]
}
```

### Psychology

```json
{
  "personality": "cautious",
  "risk_tolerance": "moderate",
  "decision_style": "analytical",
  "financial_confidence": "medium"
}
```

### Technology Profile

```json
{
  "ai_trust": "medium",
  "technology_adoption": "high",
  "preferred_platform": "mobile"
}
```

### Behavioral Profile

```json
{
  "pain_points": [
    "Unpredictable monthly income",
    "Difficulty maintaining a budget"
  ],
  "preferences": [
    "Simple dashboards",
    "Automated recommendations"
  ],
  "financial_habits": [
    "Tracks expenses irregularly"
  ]
}
```

JSONB is used because persona characteristics can evolve as the project grows without requiring a new database column for every possible attribute.

---

# 7. Surveys Table

The `surveys` table stores survey definitions.

### Table: `surveys`

| Column      | Type         | Constraints | Description                       |
| ----------- | ------------ | ----------- | --------------------------------- |
| id          | UUID         | Primary Key | Unique survey identifier          |
| project_id  | UUID         | Foreign Key | Associated project                |
| title       | VARCHAR(200) | NOT NULL    | Survey title                      |
| description | TEXT         | NULL        | Survey description                |
| status      | VARCHAR(30)  | NOT NULL    | Draft, running, completed, failed |
| created_at  | TIMESTAMP    | NOT NULL    | Creation time                     |
| updated_at  | TIMESTAMP    | NOT NULL    | Last update time                  |

### Relationship

```text
Project
   │
   └──< Surveys
```

---

# 8. Survey Questions Table

Survey questions are stored separately so that each question can be individually managed.

### Table: `survey_questions`

| Column        | Type        | Constraints | Description                         |
| ------------- | ----------- | ----------- | ----------------------------------- |
| id            | UUID        | Primary Key | Question identifier                 |
| survey_id     | UUID        | Foreign Key | Associated survey                   |
| question_text | TEXT        | NOT NULL    | Question                            |
| question_type | VARCHAR(30) | NOT NULL    | Text, rating, multiple choice, etc. |
| options       | JSONB       | NULL        | Options for applicable questions    |
| display_order | INTEGER     | NOT NULL    | Question ordering                   |
| created_at    | TIMESTAMP   | NOT NULL    | Creation time                       |

### Relationship

```text
Survey
   │
   └──< Survey Questions
```

---

# 9. Survey Responses Table

The `survey_responses` table stores answers generated by synthetic personas.

### Table: `survey_responses`

| Column             | Type        | Constraints | Description                 |
| ------------------ | ----------- | ----------- | --------------------------- |
| id                 | UUID        | Primary Key | Response identifier         |
| survey_question_id | UUID        | Foreign Key | Question being answered     |
| persona_id         | UUID        | Foreign Key | Persona providing response  |
| response_text      | TEXT        | NOT NULL    | Persona's answer            |
| sentiment          | VARCHAR(30) | NULL        | Positive, negative, neutral |
| metadata           | JSONB       | NULL        | Additional AI metadata      |
| created_at         | TIMESTAMP   | NOT NULL    | Response time               |

### Relationship

```text
Survey Question
       │
       └──< Responses >── Persona
```

A unique constraint should prevent the same persona from answering the same question multiple times within the same survey.

---

# 10. Interview Sessions Table

The `interview_sessions` table represents a conversation between a researcher and one synthetic persona.

### Table: `interview_sessions`

| Column     | Type         | Constraints | Description          |
| ---------- | ------------ | ----------- | -------------------- |
| id         | UUID         | Primary Key | Interview identifier |
| project_id | UUID         | Foreign Key | Associated project   |
| persona_id | UUID         | Foreign Key | Interviewed persona  |
| title      | VARCHAR(200) | NULL        | Interview title      |
| status     | VARCHAR(30)  | NOT NULL    | Active, completed    |
| started_at | TIMESTAMP    | NOT NULL    | Interview start time |
| ended_at   | TIMESTAMP    | NULL        | Interview end time   |

### Relationship

```text
Project
   │
   └──< Interview Sessions
                │
                └── Persona
```

---

# 11. Interview Messages Table

The `interview_messages` table stores individual conversation messages.

### Table: `interview_messages`

| Column          | Type        | Constraints | Description           |
| --------------- | ----------- | ----------- | --------------------- |
| id              | UUID        | Primary Key | Message identifier    |
| session_id      | UUID        | Foreign Key | Interview session     |
| role            | VARCHAR(30) | NOT NULL    | Researcher or persona |
| message         | TEXT        | NOT NULL    | Message content       |
| sequence_number | INTEGER     | NOT NULL    | Message order         |
| created_at      | TIMESTAMP   | NOT NULL    | Message time          |

### Roles

The initial system uses:

```text
researcher
persona
```

The system does not need to store internal system prompts as interview messages.

### Relationship

```text
Interview Session
       │
       └──< Interview Messages
```

---

# 12. Interview Memory

Persona consistency is one of the important requirements of the project.

The system will use three levels of context:

```text
Persona Core Profile
        +
Long-Term Memory Summary
        +
Recent Conversation Messages
```

The `memory_summary` field in the `personas` table stores important long-term information from previous conversations.

For example:

```text
The persona prefers conservative financial decisions,
has previously expressed concern about subscription costs,
and wants to build a six-month emergency fund.
```

Recent messages will be retrieved from `interview_messages` when generating the next response.

This prevents the AI from relying only on a fixed number of previous messages.

---

# 13. Insights Table

The `insights` table stores structured research findings.

### Table: `insights`

| Column       | Type         | Constraints | Description                            |
| ------------ | ------------ | ----------- | -------------------------------------- |
| id           | UUID         | Primary Key | Insight identifier                     |
| project_id   | UUID         | Foreign Key | Associated project                     |
| insight_type | VARCHAR(50)  | NOT NULL    | Theme, sentiment, pain point, etc.     |
| title        | VARCHAR(250) | NOT NULL    | Insight title                          |
| description  | TEXT         | NOT NULL    | Insight explanation                    |
| confidence   | FLOAT        | NULL        | AI confidence score                    |
| evidence     | JSONB        | NULL        | Supporting response/message references |
| data         | JSONB        | NULL        | Structured insight data                |
| created_at   | TIMESTAMP    | NOT NULL    | Creation time                          |

### Possible insight types

```text
theme
sentiment
pain_point
feature_preference
behavior
segment
recommendation
```

---

# 14. Reports Table

The `reports` table stores generated research reports.

### Table: `reports`

| Column       | Type         | Constraints | Description                         |
| ------------ | ------------ | ----------- | ----------------------------------- |
| id           | UUID         | Primary Key | Report identifier                   |
| project_id   | UUID         | Foreign Key | Associated project                  |
| title        | VARCHAR(250) | NOT NULL    | Report title                        |
| status       | VARCHAR(30)  | NOT NULL    | Pending, running, completed, failed |
| report_data  | JSONB        | NULL        | Structured report content           |
| file_path    | TEXT         | NULL        | Generated PDF location              |
| created_at   | TIMESTAMP    | NOT NULL    | Report creation time                |
| generated_at | TIMESTAMP    | NULL        | Completion time                     |

---

# 15. Complete Relationship Structure

```text
┌──────────────┐
│    USERS     │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   PROJECTS   │
└──────┬───────┘
       │
       ├───────────────┐
       │               │
       │ 1:N           │ 1:N
       ▼               ▼
┌──────────────┐  ┌──────────────┐
│   PERSONAS   │  │   SURVEYS    │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 │ 1:N
       │                 ▼
       │          ┌──────────────────┐
       │          │ SURVEY QUESTIONS │
       │          └────────┬─────────┘
       │                   │
       │                   │ 1:N
       │                   ▼
       │          ┌──────────────────┐
       └─────────►│ SURVEY RESPONSES │
                  └──────────────────┘

       PROJECT
          │
          │ 1:N
          ▼
┌─────────────────────┐
│ INTERVIEW SESSIONS  │
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐
│ INTERVIEW MESSAGES  │
└─────────────────────┘

       PROJECT
          │
          ├───────────────┐
          │               │
          │ 1:N           │ 1:N
          ▼               ▼
┌──────────────┐    ┌──────────────┐
│   INSIGHTS   │    │   REPORTS    │
└──────────────┘    └──────────────┘
```

---

# 16. Foreign Key Relationships

The database relationships are:

```text
projects.user_id
        ↓
users.id

personas.project_id
        ↓
projects.id

surveys.project_id
        ↓
projects.id

survey_questions.survey_id
        ↓
surveys.id

survey_responses.survey_question_id
        ↓
survey_questions.id

survey_responses.persona_id
        ↓
personas.id

interview_sessions.project_id
        ↓
projects.id

interview_sessions.persona_id
        ↓
personas.id

interview_messages.session_id
        ↓
interview_sessions.id

insights.project_id
        ↓
projects.id

reports.project_id
        ↓
projects.id
```

---

# 17. Delete Behavior

Relationships should use appropriate cascading behavior.

For example:

```text
Delete Project
      ↓
Delete Personas
Delete Surveys
Delete Survey Questions
Delete Survey Responses
Delete Interview Sessions
Delete Interview Messages
Delete Insights
Delete Reports
```

This prevents orphaned research data.

Deleting a user should also delete the projects owned by that user according to the application's account-deletion policy.

---

# 18. Indexing

Indexes should be created for frequently queried fields.

Important indexes include:

```text
users.email

projects.user_id

personas.project_id

surveys.project_id

survey_questions.survey_id

survey_responses.persona_id

survey_responses.survey_question_id

interview_sessions.project_id

interview_sessions.persona_id

interview_messages.session_id

insights.project_id

reports.project_id
```

These indexes will improve query performance as the amount of synthetic research data increases.

---

# 19. UUID Primary Keys

The system will use UUIDs instead of sequential integer IDs for primary keys.

Example:

```text
550e8400-e29b-41d4-a716-446655440000
```

Benefits include:

* Better uniqueness across distributed systems.
* Less predictable resource identifiers.
* Easier future scaling.

---

# 20. Timestamps

Most entities will contain:

```text
created_at
updated_at
```

where appropriate.

This allows the system to track when research data was created and modified.

---

# 21. Database Design Principles

The database follows these principles:

1. **Relational structure** for core entities.
2. **UUIDs** for primary keys.
3. **Foreign keys** for referential integrity.
4. **JSONB** for flexible AI-generated attributes.
5. **Indexes** for frequently queried relationships.
6. **Timestamps** for auditing and tracking.
7. **Cascading cleanup** to avoid orphaned records.
8. **Separation of survey questions and responses** for flexibility.
9. **Evidence storage** for traceable AI-generated insights.
10. **Persona memory** to support consistent interview behavior.

---

# 22. Initial Database Scope

The initial implementation will use these ten core tables:

```text
1. users
2. projects
3. personas
4. surveys
5. survey_questions
6. survey_responses
7. interview_sessions
8. interview_messages
9. insights
10. reports
```

Additional tables such as AI usage logs, project members, persona versions, or survey execution runs can be introduced later if the application requires them.

# AI Architecture

## 1. Overview

The **Generation of AI Powered Synthetic Users for Product Research** platform uses Generative AI to simulate realistic users for product research.

The AI system is divided into specialized services/agents rather than using one AI model for every task.

The main AI components are:

1. Persona Generator
2. Survey Response Agent
3. Interview Agent
4. Insight Extraction Agent
5. Report Generator

The AI architecture is designed to provide:

* Realistic synthetic personas
* Consistent persona behavior
* Structured AI outputs
* Context-aware interviews
* Automated research analysis
* Structured research reports

---

# 2. AI Architecture Overview

```text
                         PRODUCT RESEARCHER
                                │
                                ▼
                       ┌──────────────────┐
                       │ Product + Target │
                       │     Market       │
                       └────────┬─────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │ Persona Generator   │
                     └──────────┬──────────┘
                                │
                                ▼
                       Synthetic Personas
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                 ▼                             ▼
        ┌─────────────────┐          ┌─────────────────┐
        │ Survey Response │          │ Interview Agent │
        │     Agent       │          │                 │
        └────────┬────────┘          └────────┬────────┘
                 │                            │
                 └────────────┬───────────────┘
                              │
                              ▼
                       Research Responses
                              │
                              ▼
                  ┌─────────────────────────┐
                  │ Insight Extraction      │
                  │ Agent                   │
                  └────────────┬────────────┘
                               │
                               ▼
                       Structured Insights
                               │
                               ▼
                     ┌─────────────────────┐
                     │   Report Generator  │
                     └──────────┬──────────┘
                                │
                                ▼
                            PDF Report
```

---

# 3. AI Provider Abstraction

The application should not directly depend on a single AI provider.

Instead, the backend will contain an AI provider abstraction.

```text
                     AI Service Layer
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        OpenAI Provider        Gemini Provider
```

The application can select the provider using environment configuration.

Example:

```text
AI_PROVIDER=openai
```

or:

```text
AI_PROVIDER=gemini
```

This allows the AI provider to be changed without rewriting the application logic.

---

# 4. Structured AI Output

AI-generated information should not be stored directly without validation.

The processing pipeline is:

```text
AI Model
   │
   ▼
Structured JSON
   │
   ▼
Pydantic Schema
   │
   ├── Valid ──────► Store in Database
   │
   └── Invalid ────► Retry / Error Handling
```

Structured output is especially important for:

* Persona generation
* Survey responses
* Insight extraction
* Report generation

---

# 5. Persona Generator

## Purpose

The Persona Generator creates diverse and realistic synthetic users based on the researcher's product and target market.

For the FinWise case study, personas should represent different types of irregular-income workers.

Examples:

* Conservative freelancer
* Aggressive investor
* Financially inexperienced creator
* Highly organized consultant
* Gig worker with unstable income

---

## Input

The Persona Generator receives:

```text
Product Name
Product Description
Target Market
Product Features
Number of Personas
```

Example:

```text
Product:
FinWise

Target Market:
Freelancers, creators, gig workers, and independent
professionals aged 22–40 with irregular income.

Features:
1. Income Volatility Predictor
2. Adaptive Budget Engine
3. Goal Allocation Engine
4. Client Payment Risk Analyzer
5. Financial What-If Simulator

Number of Personas:
10
```

---

## Persona Generation Process

```text
Research Project
      │
      ▼
Persona Generation Request
      │
      ▼
Persona Prompt Builder
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
Diversity Validation
      │
      ▼
PostgreSQL
```

---

# 6. Persona Schema

The AI should generate a structured persona.

Conceptually:

```text
Persona
│
├── Identity
│   ├── Name
│   ├── Age
│   ├── Profession
│   └── Location
│
├── Financial Profile
│   ├── Monthly Income
│   ├── Income Volatility
│   ├── Savings
│   ├── Debt
│   └── Emergency Fund
│
├── Goals
│   ├── Short-Term Goals
│   └── Long-Term Goals
│
├── Psychology
│   ├── Personality
│   ├── Risk Tolerance
│   ├── Decision Style
│   └── Financial Confidence
│
├── Technology Profile
│   ├── AI Trust
│   └── Technology Adoption
│
└── Behavioral Profile
    ├── Pain Points
    ├── Preferences
    ├── Expectations
    └── Financial Habits
```

---

# 7. Persona Diversity

Generating multiple personas with only different names and ages is not sufficient.

The system should produce meaningful behavioral diversity.

For example:

```text
Persona A
Conservative
Low AI trust
High savings discipline
Avoids financial risk

Persona B
Aggressive
High AI trust
High technology adoption
Comfortable with investment risk

Persona C
Financially inexperienced
Medium AI trust
Poor budgeting habits
Needs simple recommendations
```

This allows the research system to identify differences between user segments.

---

# 8. Persona Consistency

Persona consistency is a critical requirement.

Once a persona is generated, its core characteristics should remain stable.

For example, if a persona is defined as:

```text
Risk tolerance: Low
Financial confidence: Low
AI trust: Medium
```

the Interview Agent should not randomly claim that the same persona is highly comfortable with risky investments.

The persona's core profile should therefore be treated as relatively immutable during a research project.

---

# 9. Survey Response Agent

## Purpose

The Survey Response Agent simulates how each synthetic persona would answer a survey question.

### Input

```text
Persona Profile
+
Product Information
+
Survey Question
```

### Output

```text
Persona Response
```

---

## Survey Response Flow

```text
Survey Question
      │
      ▼
Selected Persona
      │
      ▼
Persona Context Builder
      │
      ▼
Survey Response Prompt
      │
      ▼
AI Provider
      │
      ▼
Persona Answer
      │
      ▼
Validation
      │
      ▼
Database
```

---

# 10. Survey Response Principles

The Survey Agent should:

* Answer from the persona's perspective.
* Consider the persona's goals.
* Consider financial characteristics.
* Consider personality.
* Consider technology adoption.
* Consider pain points.
* Avoid giving identical answers for every persona.
* Avoid contradicting the persona's core profile.

The system should generate natural responses rather than simply selecting random predefined answers.

---

# 11. Interview Agent

## Purpose

The Interview Agent simulates a direct conversation between the researcher and a synthetic persona.

Unlike the Survey Agent, the Interview Agent must maintain conversation context across multiple turns.

---

# 12. Interview Context

The Interview Agent uses three sources of context:

```text
┌──────────────────────────┐
│ 1. Persona Core Profile  │
└─────────────┬────────────┘
              │
              +
┌─────────────▼────────────┐
│ 2. Long-Term Memory      │
│    Summary               │
└─────────────┬────────────┘
              │
              +
┌─────────────▼────────────┐
│ 3. Recent Conversation   │
│    Messages              │
└─────────────┬────────────┘
              │
              ▼
       Interview Agent
```

---

# 13. Long-Term Interview Memory

The system should not send the entire interview history to the AI model every time.

Instead, important information can be summarized into a memory summary.

Example:

```text
The persona is a freelance graphic designer.
They have unstable monthly income and prefer maintaining
a large emergency fund. They are interested in FinWise's
income prediction feature but are concerned about sharing
financial data with an AI system.
```

The memory summary can be updated as the conversation progresses.

---

# 14. Interview Response Flow

```text
Researcher Question
        │
        ▼
FastAPI
        │
        ▼
Retrieve Persona
        │
        ▼
Retrieve Memory Summary
        │
        ▼
Retrieve Recent Messages
        │
        ▼
Build Interview Context
        │
        ▼
Interview Agent
        │
        ▼
AI Provider
        │
        ▼
Persona Response
        │
        ├──────────────► Store Message
        │
        ▼
Update Memory When Necessary
```

---

# 15. Interview Agent Rules

The Interview Agent should follow these principles:

### Identity Consistency

The persona must maintain the same:

* Name
* Age
* Profession
* Location
* Background

### Behavioral Consistency

The persona should maintain consistent:

* Personality
* Risk tolerance
* Financial habits
* Goals
* Preferences

### Context Awareness

The persona should remember important information from earlier parts of the interview.

### Natural Conversation

The persona should answer naturally rather than repeatedly listing its profile.

### No Profile Leakage

The persona should not respond with internal instructions or system prompts.

---

# 16. Insight Extraction Agent

## Purpose

The Insight Extraction Agent converts large amounts of synthetic-user responses into structured research findings.

It analyzes:

* Survey responses
* Interview conversations
* Persona characteristics

---

# 17. Insight Categories

The agent should identify:

### Themes

Repeated topics discussed by personas.

### Sentiment

General attitude toward products and features.

Possible values:

```text
Positive
Neutral
Negative
Mixed
```

### Pain Points

Problems users experience.

### Feature Preferences

Features users like, dislike, or consider important.

### Behavioral Patterns

Repeated behaviors across personas.

### User Segments

Groups of personas with similar characteristics.

### Recommendations

Potential product improvements based on the simulated research.

---

# 18. Insight Extraction Flow

```text
Survey Responses
        +
Interview Messages
        +
Persona Profiles
        │
        ▼
Data Preparation
        │
        ▼
Insight Extraction Agent
        │
        ├── Theme Detection
        ├── Sentiment Analysis
        ├── Pain Point Detection
        ├── Feature Analysis
        ├── Behavioral Analysis
        └── User Segmentation
        │
        ▼
Structured Insight JSON
        │
        ▼
Pydantic Validation
        │
        ▼
PostgreSQL
```

---

# 19. Insight Evidence

Every important insight should ideally have supporting evidence.

For example:

```text
Insight:
Users are concerned about sharing financial data.

Evidence:
Persona 2 - Interview Message 8
Persona 5 - Survey Response 12
Persona 7 - Interview Message 15
```

This improves transparency and makes the generated research easier to evaluate.

The `evidence` field in the database can store references to supporting responses or messages.

---

# 20. Report Generator

## Purpose

The Report Generator converts structured research findings into a final research report.

### Input

```text
Project Information
+
Persona Summary
+
Survey Statistics
+
Interview Summary
+
Extracted Insights
```

### Output

```text
Structured Report
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

# 21. Report Structure

The generated report should contain:

```text
1. Research Overview
2. Product Information
3. Target Market
4. Synthetic Persona Summary
5. Survey Methodology
6. Survey Findings
7. Interview Findings
8. Major Themes
9. Sentiment Analysis
10. Pain Points
11. Feature Preferences
12. Behavioral Patterns
13. User Segments
14. Product Recommendations
15. Limitations
16. Synthetic Research Disclaimer
```

---

# 22. AI Prompt Architecture

Prompts should be generated dynamically rather than hard-coded with individual persona details.

The general structure is:

```text
System Instructions
        +
Research Context
        +
Persona Context
        +
Task
        +
Output Format
```

Example conceptual prompt:

```text
SYSTEM:
You are simulating a synthetic research participant.

RESEARCH CONTEXT:
Product: FinWise
Target Market: Irregular-income workers

PERSONA:
Age: 29
Profession: Freelance Designer
Risk Tolerance: Low
AI Trust: Medium
Pain Points:
- Unpredictable income
- Difficulty budgeting

TASK:
Answer the researcher's question from the perspective
of this persona.

QUESTION:
Would you use an Income Volatility Predictor?

OUTPUT:
Provide a natural response from the persona.
```

The actual prompts will be implemented later in the backend.

---

# 23. Temperature and Creativity

Different AI tasks may require different levels of creativity.

Conceptually:

```text
Persona Generation
       ↓
Higher diversity

Survey Responses
       ↓
Moderate creativity

Interview Agent
       ↓
Moderate creativity

Insight Extraction
       ↓
Lower creativity / consistency

Report Generation
       ↓
Low creativity / structured output
```

Exact model parameters will be configured during implementation and evaluated experimentally.

---

# 24. Error Handling

AI operations can fail because of:

* API errors
* Rate limits
* Invalid responses
* Missing fields
* Malformed JSON
* Provider outages

The system should handle these situations safely.

```text
AI Request
    │
    ▼
AI Provider
    │
    ├── Success ─────► Validate ─────► Store
    │
    └── Failure
           │
           ▼
       Retry Logic
           │
           ├── Success ──► Validate ──► Store
           │
           └── Failure ──► Error Status
```

---

# 25. AI Service Abstraction

The backend should expose a common interface to the rest of the application.

Conceptually:

```text
AIProvider
│
├── generate_persona()
├── generate_survey_response()
├── generate_interview_response()
├── extract_insights()
└── generate_report_content()
```

Provider-specific implementations can then implement the same interface.

```text
AIProvider
   │
   ├── OpenAIProvider
   │
   └── GeminiProvider
```

This prevents the application from becoming tightly coupled to one AI provider.

---

# 26. AI Data Flow

The complete AI pipeline is:

```text
PRODUCT
   │
   ▼
TARGET MARKET
   │
   ▼
PERSONA GENERATOR
   │
   ▼
SYNTHETIC PERSONAS
   │
   ├───────────────┐
   │               │
   ▼               ▼
SURVEY          INTERVIEW
AGENT            AGENT
   │               │
   └───────┬───────┘
           ▼
       RESPONSES
           │
           ▼
    INSIGHT AGENT
           │
           ▼
      INSIGHTS
           │
           ▼
    REPORT GENERATOR
           │
           ▼
          PDF
```

---

# 27. AI Architecture Principles

The AI system follows these principles:

1. **Persona consistency** – synthetic users should maintain stable characteristics.
2. **Diversity** – personas should differ meaningfully in behavior and preferences.
3. **Structured outputs** – important AI results must be schema-validated.
4. **Context awareness** – interview responses should consider previous conversation.
5. **Evidence-based insights** – findings should reference supporting responses where possible.
6. **Provider independence** – the system should support multiple AI providers.
7. **Error tolerance** – AI failures should not crash the entire application.
8. **Transparency** – generated research must be clearly identified as synthetic.
9. **Modularity** – each AI responsibility should be independently testable.
10. **Reproducibility** – research runs should preserve enough context to understand how findings were generated.

---

# 28. Future AI Improvements

The following improvements can be considered after the MVP:

* Persona clustering.
* Automatic persona regeneration when diversity is too low.
* Advanced long-term memory.
* Vector database for large-scale interview memory.
* Multi-agent debate between synthetic personas.
* Automatic follow-up interview questions.
* Confidence scoring for insights.
* AI-generated research hypotheses.
* Experiment comparison across multiple research runs.
* Additional AI providers.
* Human-in-the-loop insight verification.

These features are outside the initial MVP scope.

from fastapi import FastAPI

from app.api.routes.projects import router as projects_router
from app.api.routes.personas import router as personas_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.surveys import router as surveys_router
from app.api.routes.validation import router as validation_router
from app.api.routes.interviews import router as interviews_router
from app.api.routes.insights import router as insights_router

app = FastAPI(
    title="Generation of AI Powered Synthetic Users for Product Research",
    version="0.1.0",
)
app.include_router(
    interviews_router,
    prefix="/api/v1",
)

app.include_router(
    insights_router,
    prefix="/api/v1",
)

app.include_router(
    surveys_router,
    prefix="/api/v1",
)
app.include_router(
    validation_router,
    prefix="/api/v1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "synthetic-user-research-platform",
    }


app.include_router(
    projects_router,
    prefix="/api/v1",
)
app.include_router(
    personas_router,
    prefix="/api/v1",
)
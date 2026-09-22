from fastapi import FastAPI

from app.api.routes.projects import router as projects_router


app = FastAPI(
    title="Generation of AI Powered Synthetic Users for Product Research",
    version="0.1.0",
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
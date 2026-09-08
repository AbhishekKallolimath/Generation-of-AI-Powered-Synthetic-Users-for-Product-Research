from fastapi import FastAPI

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
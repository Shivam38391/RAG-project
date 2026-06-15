from fastapi import FastAPI

app = FastAPI(
    title="Financial AI Assistant",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {
        "status": "running",
        "message": "Financial AI Assistant"
    }
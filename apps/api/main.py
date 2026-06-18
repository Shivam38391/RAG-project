from fastapi import FastAPI
from apps.api.routers.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware
from apps.api.routers.chat import router as chat_router

app = FastAPI(
    title="Financial AI Assistant"
)

app.include_router(chat_router)
app.include_router(upload_router)



@app.get("/")
def root():
    return {
        "status": "running",
        "message": "Financial AI Assistant"
    }



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
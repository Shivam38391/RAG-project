from fastapi import FastAPI
from apps.api.routers.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware
from apps.api.routers.chat import router as chat_router
from apps.api.db.database import Base, engine
from apps.api.db.models import Base
from apps.api.routers.conversations import (
    router as conversation_router,
)
from apps.api.routers.messages import router as message_router
from contextlib import asynccontextmanager
from packages.llm.ollama_client import llm

from apps.api.routers.workspaces import (
    router as workspace_router
)

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Financial AI Assistant"
)


@asynccontextmanager
async def lifespan(app):
    print("Loading model...")
    llm.invoke("hi")
    print("Model ready.")
    yield
app = FastAPI(lifespan=lifespan)


app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(conversation_router)
app.include_router(message_router)

app.include_router(
    workspace_router
)

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




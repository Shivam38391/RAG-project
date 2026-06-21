from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from apps.api.db.database import get_db
from apps.api.services.chat_service import ChatService


router = APIRouter()


class ChatRequest(BaseModel):
    conversation_id: int
    question: str


@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    return ChatService.chat(
        db=db,
        conversation_id=request.conversation_id,
        question=request.question,
    )
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from apps.api.db.database import get_db
from apps.api.services.chat_serviceV2 import ChatService

router = APIRouter(
    prefix="/conversations",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    question: str


@router.post("/{conversation_id}/chat")
def chat(
    conversation_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
):

    return ChatService.chat(
        db=db,
        conversation_id=conversation_id,
        question=request.question,
    )
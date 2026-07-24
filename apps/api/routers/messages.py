from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from apps.api.db.database import get_db
from apps.api.schemas.message import MessageResponse
from apps.api.services.message_service import MessageService

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.get(
    "/{conversation_id}",
    response_model=list[MessageResponse],
)
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
):

    return MessageService.get_full_messages_history(
        db,
        conversation_id,
    )
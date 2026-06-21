from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from apps.api.db.database import get_db

from apps.api.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
)

from apps.api.services.conversation_service import (
    ConversationService,
)

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post(
    "",
    response_model=ConversationResponse,
)
def create_conversation(
    request: ConversationCreate,
    db: Session = Depends(get_db),
):

    return ConversationService.create(
        db,
        request.title,
    )


@router.get(
    "",
    response_model=list[ConversationResponse],
)
def get_conversations(
    db: Session = Depends(get_db),
):

    return ConversationService.get_all(db)


@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
):

    conversation = ConversationService.get(
        db,
        conversation_id,
    )

    if conversation is None:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return conversation


@router.delete(
    "/{conversation_id}",
)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
):

    ConversationService.delete(
        db,
        conversation_id,
    )

    return {
        "message": "Deleted",
        "id": conversation_id
    }
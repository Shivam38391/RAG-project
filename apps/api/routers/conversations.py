from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from apps.api.db.database import get_db

from apps.api.schemas.conversation import (
    ConversationCreate,
    ConversationCreateV2,
    ConversationResponse,
    ConversationResponseV2,
)

from apps.api.services.conversation_service import (
    ConversationService,
    ConversationServiceV2,
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










# =======version2======


@router.post("/conversations/V2")
def create_conversation(
    request: ConversationCreateV2,
    db: Session = Depends(get_db),
):
    return ConversationServiceV2.create_conversation(
        db=db,
        workspace_id=request.workspace_id,
        title=request.title,
    )


@router.get(
    "/workspaces/V2/{workspace_id}/conversations"
)
def get_conversations(
    workspace_id: int,
    db: Session = Depends(get_db),
):
    return ConversationServiceV2.get_conversations(
        db=db,
        workspace_id=workspace_id,
    )
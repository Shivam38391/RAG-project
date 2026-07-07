from sqlalchemy.orm import Session
from apps.api.repositories.conversation_repository import (
    ConversationRepository,
    ConversationRepositoryV2,
)




class ConversationServiceV2:

    @staticmethod
    def create_conversation(
        db: Session,
        workspace_id: int,
        title: str,
    ):
        return ConversationRepositoryV2.create(
            db=db,
            workspace_id=workspace_id,
            title=title,
        )

    @staticmethod
    def get_conversations(
        db: Session,
        workspace_id: int,
    ):
        return ConversationRepositoryV2.get_by_workspace(
            db=db,
            workspace_id=workspace_id,
        )

    @staticmethod
    def get_conversation(
        db: Session,
        conversation_id: int,
    ):
        return ConversationRepositoryV2.get_by_id(
            db=db,
            conversation_id=conversation_id,
        )

    @staticmethod
    def delete_conversation(
        db: Session,
        conversation_id: int,
    ):
        conversation = ConversationRepositoryV2.get_by_id(
            db=db,
            conversation_id=conversation_id,
        )

        if conversation is None:
            return False

        ConversationRepositoryV2.delete(
            db=db,
            conversation=conversation,
        )

        return True
    








class ConversationService:

    @staticmethod
    def create(
        db: Session,
        title: str,
    ):
        return ConversationRepository.create(
            db,
            title,
        )

    @staticmethod
    def get_all(
        db: Session,
    ):
        return ConversationRepository.get_all(db)

    @staticmethod
    def get(
        db: Session,
        conversation_id: int,
    ):
        return ConversationRepository.get_by_id(
            db,
            conversation_id,
        )

    @staticmethod
    def delete(
        db: Session,
        conversation_id: int,
    ):

        conversation = (
            ConversationRepository.get_by_id(
                db,
                conversation_id,
            )
        )

        if conversation is None:
            return False

        ConversationRepository.delete(
            db,
            conversation,
        )

        return True
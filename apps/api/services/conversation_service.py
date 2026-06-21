from sqlalchemy.orm import Session
from apps.api.repositories.conversation_repository import (
    ConversationRepository,
)


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
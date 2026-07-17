from sqlalchemy.orm import Session

from apps.api.repositories.message_repository import MessageRepository


class MessageService:

    @staticmethod
    def create(
        db: Session,
        conversation_id: int,
        role: str,
        content: str,
    ):

        return MessageRepository.create(
            db=db,
            conversation_id=conversation_id,
            role=role,
            content=content,
        )

    @staticmethod
    def get_messages(
        db: Session,
        conversation_id: int,
    ):

        return MessageRepository.get_messages(
            db,
            conversation_id,
        )
    

    @staticmethod
    def get_full_messages_history(
        db: Session,
        conversation_id: int,
    ):

        return MessageRepository.get_full_messages_history(
            db,
            conversation_id,
        )
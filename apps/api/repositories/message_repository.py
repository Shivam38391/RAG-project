from sqlalchemy.orm import Session
from apps.api.db.models import Message


class MessageRepository:

    @staticmethod
    def create(
        db: Session,
        conversation_id: int,
        role: str,
        content: str,
    ) -> Message:

        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        return message

    @staticmethod
    def get_messages(
        db: Session,
        conversation_id: int,
    ) -> list[Message]:

        return (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc()).limit(8)
            .all()
        )



    @staticmethod
    def get_full_messages_history(
        db: Session,
        conversation_id: int,
    ) -> list[Message]:

        return (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .all()
        )

    @staticmethod
    def delete(
        db: Session,
        message: Message,
    ):

        db.delete(message)
        db.commit()

    @staticmethod
    def delete_all(
        db: Session,
        conversation_id: int,
    ):

        (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .delete()
        )

        db.commit()
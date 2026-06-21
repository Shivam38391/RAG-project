from sqlalchemy.orm import Session
from apps.api.db.models import Conversation


class ConversationRepository:

    @staticmethod
    def create(
        db: Session,
        title: str,
    ) -> Conversation:

        conversation = Conversation(
            title=title
        )

        db.add(conversation)

        db.commit()

        db.refresh(conversation)

        return conversation

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Conversation]:

        return (
            db.query(Conversation)
            .order_by(
                Conversation.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        conversation_id: int,
    ) -> Conversation | None:

        return (
            db.query(Conversation)
            .filter(
                Conversation.id == conversation_id
            )
            .first()
        )

    @staticmethod
    def delete(
        db: Session,
        conversation: Conversation,
    ):

        db.delete(conversation)

        db.commit()
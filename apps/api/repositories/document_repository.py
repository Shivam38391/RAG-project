from sqlalchemy.orm import Session

from apps.api.db.models import Document


class DocumentRepository:

    @staticmethod
    def create(
        db: Session,
        filename: str,
        file_path: str,
        chroma_collection: str = "documents",
    ):

        document = Document(
            filename=filename,
            file_path=file_path,
            chroma_collection=chroma_collection,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document

    @staticmethod
    def get_by_id(
        db: Session,
        document_id: int,
    ):

        return (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )
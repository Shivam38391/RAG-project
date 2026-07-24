from sqlalchemy.orm import Session

from apps.api.db.models import WorkspaceDocument


class WorkspaceDocumentRepository:


    @staticmethod
    def get_by_workspace(
        db: Session,
        workspace_id: int,
    ):

        return (
            db.query(WorkspaceDocument)
            .filter(
                WorkspaceDocument.workspace_id == workspace_id
            )
            .all()
        )

    

    @staticmethod
    def create(
        db: Session,
        workspace_id: int,
        document_id: int,
    ):

        relation = WorkspaceDocument(
            workspace_id=workspace_id,
            document_id=document_id,
        )

        db.add(relation)
        db.commit()
        db.refresh(relation)

        return relation

    @staticmethod
    def get_by_workspace(
        db: Session,
        workspace_id: int,
    ):

        return (
            db.query(WorkspaceDocument)
            .filter(
                WorkspaceDocument.workspace_id == workspace_id
            )
            .all()
        )
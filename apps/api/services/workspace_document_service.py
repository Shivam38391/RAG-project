from sqlalchemy.orm import Session

from apps.api.repositories.document_repository import (
    DocumentRepository,
)

from apps.api.repositories.workspace_document_repository import (
    WorkspaceDocumentRepository,
)


class WorkspaceDocumentService:




    @staticmethod
    def get_workspace_document_ids(
        db: Session,
        workspace_id: int,
    ):

        relations = (
            WorkspaceDocumentRepository.get_by_workspace(
                db=db,
                workspace_id=workspace_id,
            )
        )

        return [
            relation.document_id
            for relation in relations
        ]


    





    @staticmethod
    def link_document(
        db: Session,
        workspace_id: int,
        document_id: int,
    ):

        return WorkspaceDocumentRepository.create(
            db=db,
            workspace_id=workspace_id,
            document_id=document_id,
        )

    @staticmethod
    def get_workspace_documents(
        db: Session,
        workspace_id: int,
    ):

        relations = (
            WorkspaceDocumentRepository
            .get_by_workspace(
                db,
                workspace_id,
            )
        )

        documents = []

        for relation in relations:

            document = (
                DocumentRepository.get_by_id(
                    db,
                    relation.document_id,
                )
            )

            if document:
                documents.append(document)

        return documents
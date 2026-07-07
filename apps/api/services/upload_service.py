import os
import shutil

from sqlalchemy.orm import Session

from apps.api.repositories.document_repository import (
    DocumentRepository,
)

from apps.api.repositories.workspace_document_repository import (
    WorkspaceDocumentRepository,
)
from apps.api.services.ingestion_service import ingest_pdf

# from apps.services.ingestion_service import (
#     ingest_pdf,
# )


UPLOAD_DIR = "data/uploads"


class UploadService:

    @staticmethod
    def upload_to_workspace(
        db: Session,
        workspace_id: int,
        file,
    ):

        os.makedirs(
            UPLOAD_DIR,
            exist_ok=True,
        )

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename,
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

        # Chroma ingestion
        ingest_pdf(
            path=file_path,
        )

        document = (
            DocumentRepository.create(
                db=db,
                filename=file.filename,
                file_path=file_path,
            )
        )

        WorkspaceDocumentRepository.create(
            db=db,
            workspace_id=workspace_id,
            document_id=document.id,
        )

        return document
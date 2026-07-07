# from pathlib import Path
# from apps.api.services.ingestion_service import ingest_pdf
# from fastapi import APIRouter, UploadFile, File

# router = APIRouter()

# UPLOAD_DIR = Path("data/uploads")
# UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# @router.post("/upload")
# async def upload_pdf(
#     file: UploadFile = File(...)
# ):
#     filepath = UPLOAD_DIR / file.filename

#     with open(filepath, "wb") as f:
#         f.write(await file.read())

#     ingest_pdf(str(filepath))

#     return {
#         "filename": file.filename,
#         "status": "uploaded"
#     }








from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from sqlalchemy.orm import Session
from apps.api.db.database import get_db
from apps.api.schemas.workspace import DocumentResponse
from apps.api.services.upload_service import (
    UploadService,
)

router = APIRouter(
    prefix="/workspaces",
    tags=["Upload"],
)


@router.post(
    "/{workspace_id}/upload",
    response_model=DocumentResponse,
)
async def upload_document(
    workspace_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    document = (
        UploadService.upload_to_workspace(
            db=db,
            workspace_id=workspace_id,
            file=file,
        )
    )

    return document
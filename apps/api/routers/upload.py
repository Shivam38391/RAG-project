from pathlib import Path
from apps.api.services.ingestion_service import ingest_pdf
from fastapi import APIRouter, UploadFile, File

router = APIRouter()

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):
    filepath = UPLOAD_DIR / file.filename

    with open(filepath, "wb") as f:
        f.write(await file.read())

    ingest_pdf(str(filepath))

    return {
        "filename": file.filename,
        "status": "uploaded"
    }
from packages.ingestion.pdf_loader import load_pdf
from packages.ingestion.chunker import split_documents
from packages.rag.vector_store import db


def ingest_pdf(path: str):

    docs = load_pdf(path)

    chunks = split_documents(docs)

    print(f"Adding {len(chunks)} chunks to DB...")

    db.add_documents(chunks)

    return len(chunks)
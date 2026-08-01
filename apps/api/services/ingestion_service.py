from packages.ingestion.pdf_loader import load_pdf
from packages.ingestion.chunker import split_documents
from packages.rag.vector_store import db


def ingest_pdf(
    path: str,
    document_id: int,
    workspace_id: int,
    filename: str,
):
    docs = load_pdf(path)

    print(f"{path} loaded with {len(docs)} pages")

    chunks = split_documents(docs)

    # Add metadata to every chunk
    for index, chunk in enumerate(chunks):
        chunk.metadata["document_id"] = document_id
        chunk.metadata["workspace_id"] = workspace_id
        chunk.metadata["filename"] = filename
        chunk.metadata["chunk_index"] = index
        chunk.metadata["source"] = path

    print(f"Adding {len(chunks)} chunks to Chroma in batches...")

    batch_size = 10
    for batch_start in range(0, len(chunks), batch_size):
        batch = chunks[batch_start : batch_start + batch_size]
        batch_number = batch_start // batch_size + 1
        print(f"Embedding batch {batch_number}: {len(batch)} chunks")
        try:
            db.add_documents(batch)
        except Exception as exc:
            print(f"Failed to embed batch {batch_number}: {exc}")
            raise

    return len(chunks)

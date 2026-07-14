from importlib.resources import path

from packages.ingestion.pdf_loader import load_pdf
from packages.ingestion.chunker import split_documents
from packages.rag.vector_store import db


# def ingest_pdf(path: str):

#     docs = load_pdf(path)

#     print(path, "loaded with", len(docs), "pages")

#     chunks = split_documents(docs)

#     print(f"Adding {len(chunks)} chunks to DB...")

#     db.add_documents(chunks)

#     return len(chunks)








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
    for index,chunk in enumerate(chunks):

        chunk.metadata["document_id"] = document_id
        chunk.metadata["workspace_id"] = workspace_id
        chunk.metadata["filename"] = filename


        chunk.metadata["chunk_index"] = index
        chunk.metadata["source"] = path

    print(f"Adding {len(chunks)} chunks to Chroma...")

    db.add_documents(chunks)

    return len(chunks)
# from packages.ingestion.pdf_loader import load_pdf
# from packages.ingestion.chunker import split_documents
# from packages.rag.vector_store import db

# docs = load_pdf("Shivam_Sharma_Resumev2.pdf")

# chunks = split_documents(docs)

# db.add_documents(chunks)

# print("Done")




from packages.ingestion.pdf_loader import load_pdf
from packages.ingestion.chunker import split_documents
from packages.rag.vector_store import db

docs = load_pdf(
    "data/uploads/Shivam_Sharma_Resumev2.pdf"
)

chunks = split_documents(docs)

print("Documents loaded and chunked", chunks[0].page_content[:200])

db.add_documents(chunks)

print(
    f"Ingested {len(chunks)} chunks"
)
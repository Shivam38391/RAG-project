from packages.ingestion.pdf_loader import load_pdf
from packages.ingestion.chunker import split_documents

docs = load_pdf("data/uploads/sample.pdf")

chunks = split_documents(docs)

print(f"Chunks: {len(chunks)}")

print(chunks[0].page_content[:200])
from packages.ingestion.pdf_loader import load_pdf

docs = load_pdf("data/uploads/sample.pdf")

print(f"Pages: {len(docs)}")

print(docs[0].page_content[:500])
from packages.rag.vector_store import db

count = db._collection.count()

print(f"Documents in DB: {count}")
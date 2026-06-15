from packages.rag.vector_store import db


def search(query: str):
    return db.similarity_search(query, k=4)



results = search(
    "What is the account balance?"
)

print(results)
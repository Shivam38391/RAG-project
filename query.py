from packages.rag.vector_store import db

question = input("Question: ")

results = db.similarity_search(
    question,
    # Retrieve the top 4 most similar documents
    k=4
)

for i, result in enumerate(results):

    # Print the first 300 characters of each result 
    print()
    # Print the result number and content
    print(f"Result {i+1}")
    print(result.page_content[:300])
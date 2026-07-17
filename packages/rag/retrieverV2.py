from langchain_chroma import Chroma

# from langchain_community.embeddings import OllamaEmbeddings
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)

# db = Chroma(
#     persist_directory="./data/chroma",
#     embedding_function=embeddings
# )
collection = Chroma(
    persist_directory="data/chroma",
    embedding_function=embeddings,
)


def retrieve(
    question: str,
    document_ids: list[int] | None = None,
):

    # search_kwargs = {
    #     "k": 5,
    #     # "fetch_k": 20,
    #     # "lambda_mult": 0.7,
    # }
    # if document_ids:

    #     search_kwargs["filter"] = {
    #         "document_id": {
    #             "$in": document_ids
    #         }
    #     }
    # retriever = collection.as_retriever(
    #     # search_type="mmr",
    #     search_type="similarity",
    #     search_kwargs=search_kwargs
    # )


    if not document_ids:
        return []

    retriever = collection.as_retriever(
        search_kwargs={
            "k": 5,
            "filter": {
                "document_id": {
                    "$in": document_ids
                }
            },
        }
    )


    print(f"Retriever: {retriever}")

    docs = retriever.invoke(question)

    print(
        f"Retrieved {len(docs)} docs"
    )

    return docs
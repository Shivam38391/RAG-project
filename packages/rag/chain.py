# from packages.rag.retriever import retrieve
# from packages.llm.ollama_client import llm


# def ask(question: str):

#     docs = retrieve(question)

#     context = "\n\n".join(
#         [doc.page_content for doc in docs]
#     )

#     prompt = f"""
# You are a financial document assistant.

# Answer ONLY using the provided context.

# If the answer is not in the context, say:
# "I could not find that information."

# Context:
# {context}

# Question:
# {question}
# """

#     response = llm.invoke(prompt)

#     print("LLM Response:", response)

#     return response.content





from packages.rag.retriever import retrieve
from packages.llm.ollama_client import llm


def ask(question: str):


    prompt = f"""
    You are a helpful financial document assistant.

    Rules:
    1. Answer ONLY from the provided context.
    2. If the answer is not present in the context, reply exactly:
    "I could not find that information in the uploaded documents."
    3. Do not use your general knowledge.
    4. Keep answers concise.

    Context:
    {context}

    Question:
    {question}
    """



    docs = retrieve(question)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    response = llm.invoke(prompt)

    return {
        "answer": response.content,
        "sources": [
            doc.metadata for doc in docs
        ]
    }
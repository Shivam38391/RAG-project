


import time
from packages.rag.retriever import retrieve
from packages.llm.ollama_client import llm


def ask(question: str):

    start = time.time()

    docs = retrieve(question)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )


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

    
    llm_start = time.time()


    response = llm.invoke(prompt)

    print(f"LLM: {time.time() - llm_start:.2f}s")
    print(f"Total: {time.time() - start:.2f}s")

    return {
        "answer": response.content,
        "sources": [
            doc.metadata for doc in docs
        ]
    }
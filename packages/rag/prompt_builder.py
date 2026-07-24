def build_prompt(
    context: str,
    history: str,
    question: str,
) -> str:
    


    prompt = '''
You are an AI assistant answering questions from uploaded documents.

Use ONLY the provided Context.

If the answer can be reasonably inferred by combining multiple retrieved chunks,
do so.

Do not invent facts.

If after reading ALL retrieved chunks the answer still cannot be determined,
reply:

"I could not find that information in the uploaded documents."
'''


    return f"""
{prompt}

Conversation History:
{history}

Context:
{context}

User Question:
{question}

Answer:
"""





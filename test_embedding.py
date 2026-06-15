from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)

db = Chroma(
    persist_directory="./data/chroma",
    embedding_function=embeddings,
)

db.add_texts([
    "Shivam Sharma works as a software developer",
    "Salary is 80000 rupees per month",
    "Lives in Jammu",
])

print("Success")
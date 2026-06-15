from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)

db = Chroma(
    persist_directory="./data/chroma",
    embedding_function=embeddings,
)

results = db.similarity_search(
    "Where does Shivam live?",
    k=2,
)

for item in results:
    print(item.page_content)
    
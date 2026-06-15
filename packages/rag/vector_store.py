from langchain_chroma import Chroma
# from langchain_community.embeddings import OllamaEmbeddings

from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)

db = Chroma(
    persist_directory="./data/chroma",
    embedding_function=embeddings
)
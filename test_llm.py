from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="qwen3.5:latest"
)

print("Sending...")

response = llm.invoke("Say hello")

print(response.content)
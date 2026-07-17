from langchain_ollama import ChatOllama


llm = ChatOllama(
    model="qwen3.5:latest",


    # model="qwen3:4b",

    temperature=0,
    keep_alive="30m",
    #4096
    num_ctx=8192,     #8192


)
import time

from packages.llm.ollama_client import llm


class LLMService:

    @staticmethod
    def generate(prompt: str) -> str:
        start = time.time()

        response = llm.invoke(prompt)

        print(f"Promps; {prompt}",)

        print(f"LLM: {time.time() - start:.2f}s")

        return response.content
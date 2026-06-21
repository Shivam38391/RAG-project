from sqlalchemy.orm import Session
import time

from apps.api.services.message_service import MessageService

from packages.rag.retriever import retrieve
from packages.rag.prompt_builder import build_prompt
from packages.llm.llm_service import LLMService


class ChatService:

    @staticmethod
    def chat(
        db: Session,
        conversation_id: int,
        question: str,
    ):

        # Save user message
        MessageService.create(
            db=db,
            conversation_id=conversation_id,
            role="user",
            content=question,
        )

        # Load conversation history
        messages = MessageService.get_messages(
            db,
            conversation_id,
        )

        history = "\n".join(
            f"{m.role}: {m.content}"
            for m in messages
        )

        # Retrieve documents
        start = time.time()
        retrieve_start = time.time()

        docs = retrieve(question)
        print(f"Retrieve: {time.time() - retrieve_start:.2f}s")

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        # Build prompt
        prompt_start = time.time()

        prompt = build_prompt(
            context=context,
            history=history,
            question=question,
        )
        print(f"Prompt: {time.time() - prompt_start:.2f}s")

        # Generate answer
        answer = LLMService.generate(prompt)

        # Save assistant response
        MessageService.create(
            db=db,
            conversation_id=conversation_id,
            role="assistant",
            content=answer,
        )

        return {
            "answer": answer,
            "sources": [doc.metadata for doc in docs],
        }
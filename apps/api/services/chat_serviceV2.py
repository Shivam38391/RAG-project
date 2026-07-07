import time
from sqlalchemy.orm import Session

from apps.api.services.message_service import MessageService
from apps.api.services.workspace_document_service import WorkspaceDocumentService

from apps.api.repositories.conversation_repository import ConversationRepository

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

        # -------------------------
        # Get Conversation
        # -------------------------

        conversation = ConversationRepository.get_by_id(
            db=db,
            conversation_id=conversation_id,
        )

        if conversation is None:
            raise Exception("Conversation not found")

        workspace_id = conversation.workspace_id

        # -------------------------
        # Save User Message
        # -------------------------

        MessageService.create(
            db=db,
            conversation_id=conversation_id,
            role="user",
            content=question,
        )

        # -------------------------
        # Load Conversation History
        # -------------------------

        messages = MessageService.get_messages(
            db=db,
            conversation_id=conversation_id,
        )

        history = "\n".join(
            f"{message.role}: {message.content}"
            for message in messages
        )

        # -------------------------
        # Workspace Documents
        # -------------------------

        document_ids = (
            WorkspaceDocumentService.get_workspace_document_ids(
                db=db,
                workspace_id=workspace_id,
            )
        )

        # -------------------------
        # Retrieve Chunks
        # -------------------------

        retrieve_start = time.time()

        docs = retrieve(
            question=question,
            document_ids=document_ids,
        )

        print(
            f"Retrieve: {time.time() - retrieve_start:.2f}s"
        )

        # -------------------------
        # No Documents Found
        # -------------------------

        if len(docs) == 0:

            answer = (
                "I could not find that information in the uploaded documents."
            )

            MessageService.create(
                db=db,
                conversation_id=conversation_id,
                role="assistant",
                content=answer,
            )

            return {
                "answer": answer,
                "sources": [],
            }

        # -------------------------
        # Context
        # -------------------------

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        # -------------------------
        # Prompt
        # -------------------------

        prompt = build_prompt(
            context=context,
            history=history,
            question=question,
        )

        # -------------------------
        # LLM
        # -------------------------

        llm_start = time.time()

        answer = LLMService.generate(prompt)

        print(
            f"LLM: {time.time() - llm_start:.2f}s"
        )

        # -------------------------
        # Save Assistant Message
        # -------------------------

        MessageService.create(
            db=db,
            conversation_id=conversation_id,
            role="assistant",
            content=answer,
        )

        return {
            "answer": answer,
            "sources": [
                doc.metadata
                for doc in docs
            ],
        }
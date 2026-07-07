from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
# apps/api/db/models.py

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    conversations = relationship(
        "Conversation",
        back_populates="workspace",
        cascade="all, delete"
    )

    documents = relationship(
    "WorkspaceDocument",
    back_populates="workspace",
    cascade="all, delete"

    )


class WorkspaceDocument(Base):
    __tablename__ = "workspace_documents"

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        primary_key=True
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
        primary_key=True
    )

    workspace = relationship(
        "Workspace",
        back_populates="documents"
    )

    document = relationship(
        "Document",
        back_populates="workspaces"
    )



class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)

    filename = Column(String)

    file_path = Column(String)

    chroma_collection = Column(String)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    workspaces = relationship(
        "WorkspaceDocument",
        back_populates="document",
        cascade="all, delete"
    )

## old models for conversations and messages, kept for reference

# class Conversation(Base):
#     __tablename__ = "conversations"
#     id = Column(Integer, primary_key=True)
#     title = Column(String)
#     created_at = Column(
#         DateTime,
#         default=datetime.utcnow,
#     )
#     messages = relationship(
#         "Message",
#         back_populates="conversation",
#         cascade="all, delete",
#     )

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        nullable=False
    )

    title = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    workspace = relationship(
        "Workspace",
        back_populates="conversations"
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete",
    )


    

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
    )
    role = Column(String)
    content = Column(Text)
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages",
    )
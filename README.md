# 📚 RAG Workspace

An open-source, NotebookLM-style Retrieval-Augmented Generation (RAG) application built with FastAPI, Next.js, Ollama, and ChromaDB. This workspace provides a comprehensive platform for building advanced AI applications with local LLMs.

## ✨ Features
*   **Workspace Isolation:** Organize documents and conversations into isolated workspaces
*   **Document Handling:** Support multiple PDF uploads and robust document ingestion pipelines.
*   **RAG Core:** Utilizes ChromaDB for vector storage and retrieval.
*   **Local LLM Integration:** Runs large language models locally via Ollama.
*   **Conversation Management:** Maintains detailed conversation history with source citations.
*   **Streaming Support:** Designed to handle streaming responses for a better user experience.

## 🏗️ Architecture Overview

The system follows a layered microservice-like architecture:

```mermaid
graph TD
    A[Next.js UI] -->|REST API Calls| B(FastAPI Backend);
    B --> C{Service Layer};
    C --> D[PostgreSQL Database];
    C --> E[ChromaDB Retriever];
    C --> F[PDF Ingestion Service];
    E --> G(Ollama LLM);
    F --> G;

    subgraph Frontend
        A
    end

    subgraph Backend API
        B
    end
```

**Data Flow:** The Next.js frontend communicates with the FastAPI backend, which orchestrates services like Conversation, Workspace Management, and Document Upload. Retrieval relies on ChromaDB, powered by an LLM running via Ollama.

## 💻 Tech Stack

### 🚀 Backend
*   **Framework:** FastAPI
*   **Database:** PostgreSQL (via SQLAlchemy)
*   **Vector Store:** ChromaDB
*   **Orchestration:** LangChain
*   **LLM Client:** Ollama

### 🎨 Frontend
*   **Framework:** Next.js
*   **Language:** TypeScript / React
*   **Styling:** TailwindCSS & Shadcn UI

## ⚙️ Setup and Installation

Follow these steps to get the entire workspace running locally.

### Prerequisites
Ensure you have the following installed:
*   Python 3.12+
*   Node.js 22+
*   Docker (Recommended for containerized services)
*   Ollama

### Step 1: Install Ollama and Pull Models
First, install Ollama on your system:
```bash
brew install ollama
```
Then, pull the necessary models:
```bash
# Core LLM Model
ollama pull qwen3:4b

# Embedding Model
ollama pull nomic-embed-text
```

### Step 2: Clone and Setup Project
Clone the repository and navigate into the root directory:
```bash
git clone https://github.com/username/rag-workspace.git
cd rag-workspace
```




### Start vector database Chroma and verify

```console
cd ../..
Start ChromaDB
docker compose up -d


```

```console
Verify:

docker ps
```


### Step 3: Backend Setup (FastAPI)
Navigate to the API directory and install dependencies, then run migrations:
```bash
# Install Python dependencies
uv sync

# Run the main application server
uv run uvicorn apps.api.main:app --reload
```

### Step 4: Frontend Setup (Next.js)
Navigate to the web client and start the development server:
```bash
cd apps/web

# Install Node dependencies
npm install

# Start the frontend development server
npm run dev
```





###  OR Start both Development simuntaneusly

## Install the root dependency once:
```javascript
npm install
```

## Start the frontend and backend together:
```javascript
npm run dev
```





## 🔑 Environment Variables
Create a `.env` file in the root directory (`./`) and populate it with your credentials:

**.env**
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# Add other necessary environment variables here
```

OLLAMA_URL=http://localhost:11434

CHROMA_PATH=data/chroma
API
Workspace
POST /workspaces

GET /workspaces

DELETE /workspaces/{id}
Upload
POST /workspaces/{id}/upload
Conversation
POST /workspaces/{id}/conversations

GET /workspaces/{id}/conversations
Chat
POST /conversations/{id}/chat
Database
Workspace

WorkspaceDocument

Document

Conversation

Message
Roadmap
Streaming responses
Authentication
Multiple file types
Markdown rendering
Images
Excel
DOCX
PPT
Drag & Drop upload
Workspace sharing
Source highlighting
Hybrid Search
Reranking
Citations
Multi-model support
License

MIT
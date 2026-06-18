import type {
  Document,
  ChatRequest,
  ChatResponse,
  UploadResponse,
} from "@/types";

const getBaseUrl = () => {
  // In production, this should come from environment variables
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export const apiService = {
  // Documents API
  documents: {
    list: async (): Promise<Document[]> => {
      const response = await fetch(`${getBaseUrl()}/documents`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch documents");
      return response.json();
    },

    delete: async (documentId: string): Promise<void> => {
      const response = await fetch(
        `${getBaseUrl()}/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete document");
    },
  },

  // Upload API
  upload: {
    file: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${getBaseUrl()}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload file");
      return response.json();
    },
  },

  // Chat API
  chat: {
    send: async (request: ChatRequest): Promise<ChatResponse> => {
      const response = await fetch(`${getBaseUrl()}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },

    // For streaming responses
    sendStream: async (request: ChatRequest): Promise<ReadableStream<Uint8Array> | null> => {
      const response = await fetch(`${getBaseUrl()}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.body;
    },
  },
};

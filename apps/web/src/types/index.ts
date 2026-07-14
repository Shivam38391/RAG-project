// Document types
export interface Document {
  id: string;
  filename: string;
  uploadedAt: string;
  status: "indexed" | "processing" | "failed";
  size: number;
}

// Chat types
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: Source[];
}

export interface Source {
  creator: string;
  documentId: string;
  filename: string;
  pageNumber?: number;
  excerpt: string;
}

export interface ChatRequest {
  question: string;
  conversation_id: string; // Include your conversation_id if your backend handles chaining existing sessions,

  //   documentIds?: string[];
}

export interface xChatResponse {
  answer: string;
  sources: Source[];
}

// Upload types
export interface UploadResponse {
  documentId: string;
  filename: string;
  status: "indexed" | "processing";
}


export interface workSpace {
  id: string;
  name: string;
}


// Settings types
export interface AppSettings {
  backendUrl: string;
  ollamaModel: string;
  theme: "light" | "dark" | "system";
}

export interface conversations {
  id: string;
  title: string;
  created_at?: string;
}

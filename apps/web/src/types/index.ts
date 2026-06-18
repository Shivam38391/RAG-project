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
  documentId: string;
  filename: string;
  pageNumber?: number;
  excerpt: string;
}

export interface ChatRequest {
  question: string;
//   documentIds?: string[];
}

export interface ChatResponse {
  message: string;
  sources: Source[];
}

// Upload types
export interface UploadResponse {
  documentId: string;
  filename: string;
  status: "indexed" | "processing";
}

// Settings types
export interface AppSettings {
  backendUrl: string;
  ollamaModel: string;
  theme: "light" | "dark" | "system";
}

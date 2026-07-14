// "use client";

// import { useState, useCallback, useRef } from "react";
// import { api } from "@/lib/api";
// import type { Message, ChatRequest, Source } from "@/types";

// interface UseChatOptions {
//   documentIds?: string[];
// }

// export function useChat(options?: UseChatOptions) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const sendMessage = useCallback(
//     async (query: string) => {
//       if (!query.trim()) return;

//       setError(null);

//       // Add user message immediately
//       const userMessage: Message = {
//         id: `user-${Date.now()}`,
//         role: "user",
//         content: query,
//         timestamp: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, userMessage]);

//       try {
//         setIsLoading(true);

//         const request: ChatRequest = {
//          question: query,
//         //   documentIds: options?.documentIds,
//         };

//         const response = await api.askQuestion(request);

//         // Add assistant message
//         const assistantMessage: Message = {
//           id: `assistant-${Date.now()}`,
//           role: "assistant",
//           content: response.answer,
//           timestamp: new Date().toISOString(),
//           sources: response.sources,
//         };

//         setMessages((prev) => [...prev, assistantMessage]);
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to send message";
//         setError(errorMessage);
//         console.error("Chat error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [options?.documentIds]
//   );

//   const clearMessages = useCallback(() => {
//     setMessages([]);
//     setError(null);
//   }, []);

//   return {
//     messages,
//     isLoading,
//     error,
//     sendMessage,
//     clearMessages,
//     messagesEndRef,
//     scrollToBottom,
//   };
// }





"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import type { Message, ChatRequest } from "@/types";

interface UseChatOptions {
  documentIds?: string[];
  conversationId?: string | number | null; // Added to trace the current thread context
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = options?.conversationId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversation history whenever the active conversationId changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]); // Clear thread if it's a completely new chat
      return;
    }

    async function loadHistory() {
      try {
        setIsHistoryLoading(true);
        setError(null);
        const historyData = await api.getChatHistory(conversationId);

        // Map backend key names safely to your internal Message interface structure
        const mappedMessages: Message = historyData.map((msg: any) => ({
          id: String(msg.id),
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at, // Aligns 'created_at' to your UI's 'timestamp'
          sources: msg.sources || [],
        }));

        setMessages(mappedMessages);
        
        // Minor timeout ensures DOM rendering completes before scrolling down
        setTimeout(scrollToBottom, 50);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setError("Could not retrieve previous messages.");
      } finally {
        setIsHistoryLoading(false);
      }
    }

    loadHistory();
  }, [conversationId]);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setError(null);

      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setTimeout(scrollToBottom, 30);

      try {
        setIsLoading(true);

        const request: ChatRequest = {
          question: query,
          // Include your conversation_id if your backend handles chaining existing sessions
          conversation_id: conversationId, 
          // documentIds: options?.documentIds,
        };


//old api call
        // const response = await api.askQuestion(request);


        const response = await api.conversationChat({
          conversationId,
          question: query
        });

        // Add assistant response
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          timestamp: new Date().toISOString(),
          sources: response.sources,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setTimeout(scrollToBottom, 30);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        console.error("Chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [options?.documentIds, conversationId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    isHistoryLoading, // Exported to show a loading spine spinner for main container
    error,
    sendMessage,
    clearMessages,
    messagesEndRef,
    scrollToBottom,
  };
}
"use client";

import { useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import type { Message, ChatRequest, Source } from "@/types";

interface UseChatOptions {
  documentIds?: string[];
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

      try {
        setIsLoading(true);

        const request: ChatRequest = {
         question: query,
        //   documentIds: options?.documentIds,
        };

        const response = await api.askQuestion(request);

        // Add assistant message
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          timestamp: new Date().toISOString(),
          sources: response.sources,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        console.error("Chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [options?.documentIds]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    messagesEndRef,
    scrollToBottom,
  };
}

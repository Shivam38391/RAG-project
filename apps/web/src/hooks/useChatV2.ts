"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { Message } from "@/types";

interface UseChatOptions {
  conversationId?: string | number | null;
  workspaceId?: string | number | null;
}

export function useChatV2(options?: UseChatOptions) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = options?.conversationId;
  const workspaceId = options?.workspaceId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Sync state when entering an existing conversation or starting a fresh one
  useEffect(() => {
    if (!conversationId || conversationId === "new") {
      setMessages([]);
      return;
    }

    async function loadHistory() {
      try {
        setIsHistoryLoading(true);
        setError(null);
        const historyData = await api.getChatHistory(conversationId);
        const mappedMessages: Message[] = historyData.map((msg: any) => ({
          id: String(msg.id),
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at,
          sources: msg.sources || [],
        }));
        setMessages(mappedMessages);
        setTimeout(scrollToBottom, 50);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setError("Could not retrieve previous messages.");
      } finally
      
      {
        setIsHistoryLoading(false);
      }
    }
    loadHistory();
  }, [conversationId]);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setError(null);

      // Explicitly track the target conversation ID state distinct from workspace context
      let currentConversationId = conversationId;

      // Optimistically add user message to UI immediately
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

        // 1. IF IT'S A NEW CHAT: Trigger backend database record instantiator first
        if (!currentConversationId || currentConversationId === "new") {
          const derivedTitle = query.length > 30 ? `${query.substring(0, 30)}...` : query;
          
          // Generate new dynamic chat mapping using your workspace scope payload block
          const newChat = await api.createConversation({ 
            workspace_id: workspaceId, 
            title: derivedTitle 
          });
          
          currentConversationId = newChat.id;
        }

        // 2. Dispatch the core prompt execution query bound to the newly resolved conversation key
        const response = await api.conversationChat({
          activeId: currentConversationId, // Bound to target conversation, NOT workspace
          question: query
        });

        // Add assistant reply to UI layout list array block
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          timestamp: new Date().toISOString(),
          sources: response.sources || [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setTimeout(scrollToBottom, 30);

        // 3. Smoothly push router to track the new explicit conversation context URL
        if (!conversationId || conversationId === "new") {
          router.push(`/dashboard/chat/${currentConversationId}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, workspaceId, router]
  );

  return {
    messages,
    isLoading,
    isHistoryLoading,
    error,
    sendMessage,
    messagesEndRef,
    scrollToBottom,
  };
}
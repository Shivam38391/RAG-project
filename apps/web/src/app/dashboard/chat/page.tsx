"use client";


import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/hooks/useChat";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function ChatContent() {
  const { messages, isLoading, sendMessage, clearMessages, messagesEndRef, scrollToBottom } =
    useChat();

  // Auto-scroll on new messagez̤
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] gap-0">
      {/* Header with Clear Button */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat</h2>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}

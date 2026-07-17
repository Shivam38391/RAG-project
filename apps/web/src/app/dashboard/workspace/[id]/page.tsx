"use client";

import React, { useEffect, use } from 'react' // Imported 'use' from react
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { Trash2, Loader2 } from "lucide-react";

import { useChatV2 } from '@/hooks/useChatV2';

interface PageProps {
  // params must be a Promise in newer Next.js versions
  params: Promise<{
    id: string;
  }>;
}

const Page = ({ params }: PageProps) => {
  // Unwrap the params Promise safely using React's use() hook
  const unpackedParams = use(params);
  const workspaceId = unpackedParams.id;


  const { 
    messages, 
    isLoading, 
    isHistoryLoading, 
    sendMessage, 
    // clearMessages, 
    messagesEndRef, 
    scrollToBottom 
  } = useChatV2({
    workspaceId: workspaceId
  });

  // Auto-scroll on new messages
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
              // onClick={clearMessages}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isHistoryLoading ? (
            <div className="flex h-full w-full items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Loading conversation...</span>
            </div>
          ) : (
            <>
              <MessageList messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSend={sendMessage}
          disabled={isLoading || isHistoryLoading}
        />
      </div>
  );
}

export default Page;
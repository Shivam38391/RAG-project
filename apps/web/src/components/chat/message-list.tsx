"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { MessageSources } from "./sources";
import { useState } from "react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const [expandedSources, setExpandedSources] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Upload documents and ask questions to get started
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id}>
            {/* Message Bubble */}
            <div
              className={cn(
                "flex gap-3 mb-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="shrink-0 mt-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "max-w-md lg:max-w-xl rounded-lg px-4 py-2 wrap-break-words",
                  message.role === "user"
                    ? "bg-blue-600 dark:bg-blue-700 text-white rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                )}
              >
                <p className="text-sm md:text-base leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="ml-11 mb-4">
                <button
                  onClick={() =>
                    setExpandedSources(
                      expandedSources === message.id ? null : message.id
                    )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {expandedSources === message.id
                    ? "Hide sources"
                    : `Show sources (${message.sources.length})`}
                </button>

                {expandedSources === message.id && (
                  <MessageSources sources={message.sources} />
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex gap-3 mb-2">
          <div className="shrink-0 mt-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
          </div>
          <div className="bg-muted rounded-lg px-4 py-3 rounded-bl-none">
            <div className="flex gap-1">
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

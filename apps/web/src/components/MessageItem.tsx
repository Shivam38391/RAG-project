"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileText, Bot, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-2xl max-w-3xl transition-colors select-text",
        isAssistant ? "bg-blue-600 dark:bg-blue-700 text-white rounded-br-none" : "bg-primary/5 text-foreground ml-auto"
      )}
    >
      {/* Role Avatar Icon */}
      <div
        className={cn(
          "h-8 w-8 rounded-xl shrink-0 flex items-center justify-center border shadow-sm",
          isAssistant
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-background text-muted-foreground border-border"
        )}
      >
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Main Text & Structure Content Wrapper */}
      <div className="flex-1 overflow-hidden space-y-3">
        {/* Markdown Renderer Container */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed wrap-break-word">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom style code blocks (Inline & Fenced Code)
              code({  inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="rounded-xl overflow-hidden my-3 border border-border shadow-sm">
                    <div className="bg-muted px-4 py-1.5 text-[10px] font-mono border-b border-border text-muted-foreground flex justify-between items-center">
                      <span>{match[1].toUpperCase()}</span>
                    </div>
                    <SyntaxHighlighter
                      {...props}
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.8rem",
                        background: "var(--muted)",
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    {...props}
                    className={cn(
                      "bg-muted px-1.5 py-0.5 rounded-md font-mono text-[12px] border border-border text-primary",
                      className
                    )}
                  >
                    {children}
                  </code>
                );
              },
              // Layout overrides for base elements
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-foreground/90">{children}</li>,
              h1: ({ children }) => <h1 className="text-base font-bold mt-4 mb-2 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mt-3 mb-1.5 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xs font-bold mt-2 mb-1 text-foreground">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-primary/40 pl-3 italic my-2 text-muted-foreground bg-primary/5 py-1 px-2 rounded-r-md">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-3 border border-border rounded-xl">
                  <table className="w-full text-xs text-left border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted text-muted-foreground font-medium uppercase border-b border-border">{children}</thead>,
              tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
              tr: ({ children }) => <tr className="hover:bg-muted/30 transition-colors">{children}</tr>,
              th: ({ children }) => <th className="px-3 py-2 border-r border-border last:border-0">{children}</th>,
              td: ({ children }) => <td className="px-3 py-2 border-r border-border last:border-0 text-foreground/80">{children}</td>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* 3. Render Retrieval Sources Stack beneath LLM response exactly like the Mockup */}
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="pt-3 border-t border-border/60 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span>{message.sources.length} Relevant Sources referenced</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {message.sources.map((src: any, index: number) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border bg-background text-[11px] text-foreground hover:bg-muted transition-colors max-w-50 truncate"
                  title={src.filename}
                >
                  <FileText className="h-3 w-3 text-red-500 shrink-0" />
                  <span className="truncate">{src.filename}</span>
                  {src.page && (
                    <span className="text-[9px] text-muted-foreground bg-muted px-1 rounded">
                      p.{src.page}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
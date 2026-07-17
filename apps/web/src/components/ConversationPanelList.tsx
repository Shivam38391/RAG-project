"use client"

import { useQuery } from "@tanstack/react-query"
import { MessageSquare, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

// Import your actual backend type directly
import type { conversations as ConversationType } from "@/types"

// Extend your backend type if you need UI-only fields like 'snippet' or 'timestamp_label'
interface UIConversation extends ConversationType {
  snippet?: string
  timestamp_label?: string
}

export default function ConversationPanelList({ currentId }: { currentId?: string | number }) {


    const router = useRouter()

  // Pass your official type down to useQuery to match the backend function return signature
  const { isPending, isError, data: conversations } = useQuery<ConversationType[]>({
    queryKey: ["getConversations"],
    queryFn: api.getallconversationsV2.bind(api , { workspaceId: currentId as string }), // Pass workspaceId to the API function
  })

  const getDisplayTime = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return "Recent"
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col w-full max-w-xs border-r border-border bg-background h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Conversations</h3>
        <Button 
        onClick={() => router.push("/dashboard/chat/new")}
        
        size="icon" variant="ghost" className="h-7 w-7 rounded-md text-primary bg-primary/10 hover:bg-primary/20">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Conversations Container */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        
        {/* Loading State */}
        {isPending && (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading history...</span>
          </div>
        )}

        {/* Error State */}
        {!isPending && isError && (
          <div className="px-3 py-4 text-xs text-center text-destructive">
            Failed to load conversation history.
          </div>
        )}

        {/* Empty List Fallback */}
        {!isPending && (!conversations || conversations.length === 0) && (
          <div className="px-3 py-4 text-xs text-center text-muted-foreground italic">
            No active conversations.
          </div>
        )}

        {/* Mapped Item Cards */}
        {!isPending &&
          (conversations as UIConversation[])?.map((chat) => {
            // Safe string comparison for the ID mismatch
            const isItemActive = String(chat.id) === String(currentId)

            return (
              <a
                key={chat.id}
                href={`/dashboard/workspace/${currentId}/chat/${chat.id}`}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-colors select-none group relative",
                  isItemActive 
                    ? "bg-primary/10 text-primary-foreground" 
                    : "hover:bg-muted/60 text-muted-foreground"
                )}
              >
                {/* Message Icon */}
                <div className={cn(
                  "p-2 rounded-lg shrink-0 mt-0.5",
                  isItemActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <MessageSquare className="h-4 w-4" />
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0 pr-12">
                  <h4 className={cn(
                    "text-xs font-semibold truncate leading-snug",
                    isItemActive ? "text-foreground font-bold" : "text-foreground"
                  )}>
                    {chat.title || "Untitled Thread"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5 leading-normal">
                    {chat.snippet || "View conversation breakdown..."}
                  </p>
                </div>

                {/* Meta Indicator Container */}
                {/* <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5 text-[10px] text-muted-foreground/80">
                  <span>{chat.timestamp_label || getDisplayTime(chat?.created_at)}</span>
                  {isItemActive && (
                    <span className="h-2 w-2 rounded-full bg-primary inline-block shrink-0" />
                  )}
                </div> */}
              </a>
            )
          })}
      </div>

      {/* Bottom Actions footer */}
      {!isPending && conversations && conversations.length > 0 && (
        <div className="p-3 border-t border-border">
          <Button variant="outline" className="w-full text-xs font-medium h-9 border-muted hover:bg-muted text-foreground">
            View all conversations
          </Button>
        </div>
      )}
    </div>
  )
}
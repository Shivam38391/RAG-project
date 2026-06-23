"use client"

import { useEffect, useState } from "react"
import { conversations as ConversationType } from "@/types"
import { api } from "@/lib/api"
import { NavConversations } from "./NavConversations"

export function SidebarHistoryWrapper() {
  const [conversations, setConversations] = useState<ConversationType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHistory() {
      try {
        setIsLoading(true)
        const data = await api.getallconversations()
        setConversations(data)
      } catch (err) {
        console.error("Failed to load chat history:", err)
        setError("Could not load history")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (isLoading) {
    return (
      <div className="px-4 py-2 text-xs text-sidebar-foreground/50 animate-pulse">
        Loading conversations...
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-2 text-xs text-destructive/80">
        {error}
      </div>
    )
  }

  return <NavConversations conversations={conversations} />
}
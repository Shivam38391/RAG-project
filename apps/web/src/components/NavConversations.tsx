"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  MoreHorizontalIcon, 
  MessageSquare, 
  Trash2Icon, 
  PencilIcon 
} from "lucide-react"
import type { conversations as ConversationType } from "@/types"

interface NavConversationsProps {
  conversations: ConversationType[]
}

export function NavConversations({ conversations }: NavConversationsProps) {
  const { isMobile } = useSidebar()

  if (conversations.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>History</SidebarGroupLabel>
        <div className="px-4 py-2 text-xs text-sidebar-foreground/50 italic">
          No recent chats
        </div>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel> Conversations History</SidebarGroupLabel>
      <SidebarMenu>
        {conversations.map((chat) => (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton asChild>
              <a href={`/dashboard/chat/${chat.id}`}>
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </a>
            </SidebarMenuButton>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="aria-expanded:bg-muted"
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">Options</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
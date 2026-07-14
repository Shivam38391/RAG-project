"use client"

import { useQuery } from "@tanstack/react-query"
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
  BriefcaseIcon, 
  Trash2Icon, 
  PencilIcon,
  Loader2 
} from "lucide-react"

// Import your API client and types
import { api } from "@/lib/api"
import type { workSpace } from "@/types"

export function NavWorkspaces() {
  const { isMobile } = useSidebar()

  // Fetch workspaces using TanStack Query
  const { isPending, isError, data: workspaces, error } = useQuery<workSpace[]>({
    queryKey: ["getWorkspace"],
    queryFn: api.getWorkspace.bind(api)
  })

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarMenu>
        
        {/* 1. Loading State */}
        {isPending && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/50">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            <span>Loading workspaces...</span>
          </div>
        )}

        {/* 2. Error State */}
        {!isPending && isError && (
          <div className="px-3 py-2 text-xs text-destructive/90">
            Failed to load workspaces
          </div>
        )}

        {/* 3. Empty State */}
        {!isPending && !isError && (!workspaces || workspaces.length === 0) && (
          <div className="px-3 py-2 text-xs text-sidebar-foreground/40 italic">
            No workspaces found
          </div>
        )}

        {/* 4. Render Workspaces List */}
        {!isPending &&
          workspaces?.map((workspace) => (
            <SidebarMenuItem key={workspace.id}>
              <SidebarMenuButton asChild>
                {/* Dynamically links to the specific workspace routing parameter */}
                <a href={`/dashboard/workspace/${workspace.id}`}>
                  <BriefcaseIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{workspace.name || "Untitled Workspace"}</span>
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
                    <span>Rename Workspace</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    <span>Delete Workspace</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
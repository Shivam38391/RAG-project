"use client"

import { useQuery } from "@tanstack/react-query"
import { Plus, Loader2, MoreVertical, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/lib/api"

// Interface matching your backend response payload
interface WorkspaceDocument {
  id: number
  filename: string
  uploaded_at?: string // Optional metadata tracking fields
  pages_count?: number
}

interface DocumentPanelListProps {
  workspaceId: number
}

export function DocumentPanelList({ workspaceId }: DocumentPanelListProps) {
  // Dynamic fetching based on the active workspace ID context
  const { isPending, isError, data: documents } = useQuery<WorkspaceDocument[]>({
    queryKey: ["workspaceDocuments", workspaceId],
    queryFn:  api.getdocumentsV2.bind(api, { workspaceId }) // Adjust to your preferred endpoint setup mapping
  })

  return (
    <div className="flex flex-col w-full max-w-xs border-r border-border bg-background h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Documents</h3>
        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-md text-muted-foreground hover:bg-muted">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Documents Item Cards List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        
        {/* Loading Spinner */}
        {isPending && (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading documents...</span>
          </div>
        )}

        {/* Error Flag Layout */}
        {!isPending && isError && (
          <div className="px-3 py-4 text-xs text-center text-destructive">
            Failed to parse document attachments.
          </div>
        )}

        {/* Empty Layout Fallback */}
        {!isPending && (!documents || documents.length === 0) && (
          <div className="px-3 py-4 text-xs text-center text-muted-foreground italic">
            No documents uploaded yet.
          </div>
        )}

        {/* Documents Render Mapper */}
        {!isPending &&
          documents?.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-2.5 rounded-xl transition-colors select-none hover:bg-muted/60 text-muted-foreground group relative border border-transparent"
            >
              {/* File Format Icon Wrapper */}
              <div className="p-2 rounded-lg shrink-0 bg-red-500/10 text-red-500 dark:bg-red-500/20">
                <FileText className="h-4 w-4" />
              </div>

              {/* Main Meta Details */}
              <div className="flex-1 min-w-0 pr-14">
                <h4 className="text-xs font-medium text-foreground truncate leading-snug">
                  {doc.filename}
                </h4>
                <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
                  {doc.pages_count ? `${doc.pages_count} pages` : "1 page"} • Uploaded recent
                </p>
              </div>

              {/* Interactive Status Badges & Controls */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Active Sync Success Checkmark */}
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                
                {/* Context Submenu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity rounded-md text-muted-foreground"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
      </div>

      {/* Bottom Footer Action Trigger */}
      {!isPending && documents && documents.length > 0 && (
        <div className="p-3 border-t border-border">
          <Button variant="outline" className="w-full text-xs font-medium h-9 border-muted hover:bg-muted text-foreground">
            View all documents
          </Button>
        </div>
      )}
    </div>
  )
}
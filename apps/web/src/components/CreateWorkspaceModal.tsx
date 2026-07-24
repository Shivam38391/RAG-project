"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Loader2, BriefcaseIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export function CreateWorkspaceModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const queryClient = useQueryClient()

  // Set up the mutation to handle creating a new workspace row
  const { mutate, isPending, error } = useMutation({
    mutationFn: (workspaceName: string) => api.createWorkspace({ name: workspaceName }),
    onSuccess: () => {
      // Invalidate the cache to automatically trigger a re-fetch of the sidebar list
      queryClient.invalidateQueries({ queryKey: ["getWorkspace"] })
      setOpen(false) // Close the modal
      setName("") // Clear out the input value fields
    },
    onError: (err) => {
      console.error("Workspace creation failed:", err)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    mutate(name)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button customized to match your sidebar "+ Create Workspace" button styling */}
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200">
          <Plus className="h-4 w-4" />
          <span>Create Workspace</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-2xl border border-border bg-background shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <BriefcaseIcon className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold">New Workspace</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a distinct playground hub to index relevant document types and maintain independent chat threads.
            </DialogDescription>
          </DialogHeader>

          {/* Core Input Field Container */}
          <div className="grid gap-4 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                Workspace Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Legal Documents, Q3 Project Alpha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="h-10 border-muted focus-visible:ring-primary rounded-xl text-sm"
                autoFocus
              />
            </div>
            
            {/* Error Message Feedback Banner */}
            {error && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {error instanceof Error ? error.message : "Failed to generate workspace. Try again."}
              </p>
            )}
          </div>

          {/* Form Actions Footer Control Panels */}
          <DialogFooter className="flex items-center gap-2 border-t border-border pt-4 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="text-xs rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="px-4 text-xs font-medium rounded-xl flex items-center gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Hub</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
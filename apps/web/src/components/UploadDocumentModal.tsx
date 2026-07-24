"use client"

import { useState, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDropzone } from "react-dropzone"
import { Plus, Loader2, UploadCloud, FileText, X } from "lucide-react"
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
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface UploadDocumentModalProps {
  workspaceId: string | number
}

export function UploadDocumentModal({ workspaceId }: UploadDocumentModalProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  // Mutation to handle the multipart form upload
  const { mutate, isPending, error } = useMutation({
    mutationFn: (targetFile: File) => api.uploadWorkspacePDF(workspaceId, targetFile),
    onSuccess: () => {
      // Invalidate the active document list for this workspace to refresh view
      queryClient.invalidateQueries({ queryKey: ["workspaceDocuments", workspaceId] })
      setOpen(false)
      setFile(null)
    },
  })

  // Handle Drag & Drop events via react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isPending,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    mutate(file)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && setOpen(val)}>
      {/* Trigger Button tailored to look exactly like the Document header plus sign */}
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-md text-muted-foreground hover:bg-muted">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-2xl border border-border bg-background shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Add Document</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Upload a PDF source document to this workspace workspace context.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {!file ? (
              /* Dropzone Input Zone */
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                  isDragActive ? "border-primary bg-primary/5" : "border-muted hover:bg-muted/30"
                )}
              >
                <input { ...getInputProps() } />
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-foreground mt-1">
                  {isDragActive ? "Drop the file here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-[10px] text-muted-foreground">PDF files only (Max 50MB)</p>
              </div>
            ) : (
              /* Selected File Preview Mode */
              <div className="flex items-center gap-3 p-3 border border-muted rounded-xl bg-muted/20 relative">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {!isPending && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    className="h-6 w-6 rounded-md absolute right-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {error && (
              <p className="text-[11px] font-medium text-destructive mt-2">
                {error instanceof Error ? error.message : "Upload failed. Please try again."}
              </p>
            )}
          </div>

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
              disabled={isPending || !file}
              className="px-4 text-xs font-medium rounded-xl flex items-center gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Document</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
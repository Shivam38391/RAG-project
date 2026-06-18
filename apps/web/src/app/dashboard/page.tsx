"use client";

import { useState, useEffect } from "react";
import { Upload, File, Clock, Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Document } from "@/types";

export default function DashboardContent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await api.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.currentTarget.files;
    if (!files) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        await api.uploadPDF(file);
      }
      await loadDocuments();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await api.deleteDocument(documentId);
      setDocuments(documents.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Hero Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Upload financial documents and ask questions powered by AI
        </p>
      </div>

      {/* Upload Card */}
      <Card className="border-2 border-dashed p-8 text-center hover:border-primary transition-colors">
        <label className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold">
                {isUploading ? "Uploading..." : "Click to upload"}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF files up to 50MB
              </p>
            </div>
            {isUploading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </Card>

      {/* Recent Documents Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">
          {documents.length === 0
            ? "No documents yet"
            : `Recent documents (${documents.length})`}
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="p-4 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.filename}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      {doc.status === "processing" && (
                        <span className="text-amber-600">Processing...</span>
                      )}
                      {doc.status === "indexed" && (
                        <span className="text-green-600">Ready</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <p>Upload a document to get started</p>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Quick actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" size="lg" className="w-full">
            Start a conversation
          </Button>
          <Button variant="outline" size="lg" className="w-full">
            View all documents
          </Button>
        </div>
      </div>
    </div>
  );
}



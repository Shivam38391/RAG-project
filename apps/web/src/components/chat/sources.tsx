"use client";

import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Source } from "@/types";

interface MessageSourcesProps {
  sources: Source[];
}

export function MessageSources({ sources }: MessageSourcesProps) {
  return (
    <div className="space-y-2 mt-2">
      {sources.map((source, index) => (
        <Card
          key={`${source.documentId}-${index}`}
          className="p-3 bg-muted/50 border-0"
        >
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">
                {source.filename}
              </p>
              {source.pageNumber && (
                <p className="text-xs text-muted-foreground">
                  Page {source.pageNumber}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                {source.excerpt}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

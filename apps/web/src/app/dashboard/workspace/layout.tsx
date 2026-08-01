"use client";
import ConversationPanelList from "@/components/ConversationPanelList";
import { DocumentPanelList } from "@/components/DocumentPanelList";

import { useParams } from "next/navigation";

const normalizeParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const workspaceId = normalizeParam(params?.id); // Automatically grabs the slug if a child route has it

  console.log("WorkspaceLayout params:", params);

  return (
    <>
      <main className="flex flex-1 h-[calc(100vh-4rem)] gap-0">
        <div className="flex flex-col w-64 border-r border-border bg-background h-full">
          <ConversationPanelList currentId={workspaceId as string} />

          <DocumentPanelList workspaceId={parseInt(workspaceId as string)} />
        </div>

        {children}
      </main>
    </>
  );
}

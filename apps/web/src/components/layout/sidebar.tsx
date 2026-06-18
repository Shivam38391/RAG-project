"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, FileText, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "New Chat", href: "/chat", icon: Plus },
  { name: "Chat History", href: "/chat", icon: MessageSquare },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-border h-screen sticky top-0">
      {/* Logo/Header */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h1 className="font-semibold text-lg">FinDoc AI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">
          FinDoc AI v0.1.0
        </p>
      </div>
    </aside>
  );
}

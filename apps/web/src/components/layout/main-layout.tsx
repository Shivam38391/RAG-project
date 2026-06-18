"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

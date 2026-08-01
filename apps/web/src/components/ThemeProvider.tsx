"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  return (
    <NextThemeProvider attribute="class" enableSystem defaultTheme="system">
      {children}
    </NextThemeProvider>
  );
}

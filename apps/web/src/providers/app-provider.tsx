"use client";

import type {
  ReactNode,
} from "react";

import {
  ThemeProvider,
} from "@/providers/theme-provider";

import {
  QueryProvider,
} from "@/providers/query-provider";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({
  children,
}: AppProviderProps): React.JSX.Element {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}
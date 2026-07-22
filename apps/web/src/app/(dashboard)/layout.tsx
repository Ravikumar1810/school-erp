import type {
  ReactNode,
} from "react";

import {
  AuthGuard,
} from "@/components/auth/AuthGuard";

import {
  DashboardShell,
} from "@/components/dashboard/DashboardShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <DashboardShell>
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}
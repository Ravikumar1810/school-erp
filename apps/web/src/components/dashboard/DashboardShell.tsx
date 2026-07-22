"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { Loader2 } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

import { authService } from "@/services/auth.service";

import {
  UserRole,
  type AuthUser,
} from "@/types/auth";

interface DashboardShellProps {
  children: ReactNode;
}


function getRoleHome(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "/super-admin";

    case UserRole.ADMIN:
      return "/admin";

    case UserRole.STUDENT:
      return "/student";

    default:
      return "/login";
  }
}


function canAccessPath(
  role: UserRole,
  pathname: string,
): boolean {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return pathname.startsWith(
        "/super-admin",
      );

    case UserRole.ADMIN:
      return pathname.startsWith(
        "/admin",
      );

    case UserRole.STUDENT:
      return pathname.startsWith(
        "/student",
      );

    default:
      return false;
  }
}

export function DashboardShell({
  children,
}: DashboardShellProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  
  useEffect(() => {
    let isMounted = true;

    async function loadUser(): Promise<void> {
      try {
        if (!authService.isAuthenticated()) {
          if (isMounted) {
            setIsLoading(false);
          }

          router.replace("/login");

          return;
        }

        const currentUser =
          await authService.getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Failed to load authenticated user:",
          error,
        );

        authService.clearTokens();

        if (isMounted) {
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);


  useEffect(() => {
    if (!user) {
      return;
    }

    if (!canAccessPath(user.role, pathname)) {
      router.replace(
        getRoleHome(user.role),
      );
    }
  }, [
    pathname,
    router,
    user,
  ]);

  /**
   * Close mobile sidebar after navigation.
   */
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleOpenSidebar =
    useCallback(() => {
      setIsSidebarOpen(true);
    }, []);

  const handleCloseSidebar =
    useCallback(() => {
      setIsSidebarOpen(false);
    }, []);

  /**
   * Loading screen while validating authentication.
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
          </div>

          <p className="text-sm text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  /**
   * Prevent dashboard content from briefly
   * rendering before redirecting unauthenticated users.
   */
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950" />
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Dashboard Sidebar */}
      <DashboardSidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Dashboard Content */}
      <div className="min-h-screen lg:pl-72">
        <DashboardHeader
          user={user}
          onMenuClick={handleOpenSidebar}
        />

        <main className="min-h-[calc(100vh-5rem)] overflow-x-hidden bg-slate-950">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
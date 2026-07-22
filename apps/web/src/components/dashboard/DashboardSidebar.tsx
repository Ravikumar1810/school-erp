"use client";

import {
  useEffect,
  useMemo,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { X } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

import {
  getDashboardNavigation,
} from "@/config/dashboard-navigation";

import { cn } from "@/lib/utils";

import type { AuthUser } from "@/types/auth";

interface DashboardSidebarProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Checks whether a navigation item
 * matches the current pathname.
 */
function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  const dashboardHomeRoutes = [
    "/super-admin",
    "/admin",
    "/student",
  ];

  if (dashboardHomeRoutes.includes(href)) {
    return pathname === href;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function DashboardSidebar({
  user,
  isOpen,
  onClose,
}: DashboardSidebarProps): React.JSX.Element {
  const pathname = usePathname();

  const navigation = useMemo(
    () =>
      getDashboardNavigation(
        user.role,
      ).filter(
        (item) =>
          item.title.toLowerCase() !==
          "settings",
      ),
    [user.role],
  );

  const roleLabel =
    user.role === "SUPER_ADMIN"
      ? "Principal"
      : user.role === "ADMIN"
        ? "Teacher"
        : "Student";

  /**
   * Close mobile sidebar with Escape key.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  /**
   * Prevent background page scrolling
   * while the mobile sidebar is open.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* Sidebar */}
      <aside
        aria-label="Dashboard navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-white/10 bg-slate-950 shadow-2xl shadow-black/20 transition-transform duration-300 ease-out lg:w-72 lg:translate-x-0 lg:shadow-none",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-6">
          <div className="min-w-0">
            <Logo />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User information */}
        <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5">
          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>

            <p className="mt-1 text-xs font-medium text-emerald-400">
              {roleLabel}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 sm:py-5">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                isNavigationItemActive(
                  pathname,
                  item.href,
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-500 group-hover:text-slate-300",
                    )}
                  />

                  <span className="truncate">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <p className="text-xs leading-5 text-slate-600">
            School ERP
            <br />
            Smart School Management
          </p>
        </div>
      </aside>
    </>
  );
}
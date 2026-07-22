"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Loader2,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/use-auth";

import type { AuthUser } from "@/types/auth";

interface DashboardHeaderProps {
  user: AuthUser;
  onMenuClick: () => void;
}

export function DashboardHeader({
  user,
  onMenuClick,
}: DashboardHeaderProps): React.JSX.Element {
  const router = useRouter();
  const { logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel =
    user.role === "SUPER_ADMIN"
      ? "Principal"
      : user.role === "ADMIN"
        ? "Teacher"
        : "Student";

  const getProfilePath = (): string => {
    switch (user.role) {
      case "SUPER_ADMIN":
        return "/super-admin/profile";

      case "ADMIN":
        return "/admin/profile";

      case "STUDENT":
        return "/student/profile";

      default:
        return "/login";
    }
  };

  const handleProfileClick = (): void => {
    router.push(getProfilePath());
  };

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="shrink-0 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <p className="hidden text-sm text-slate-500 sm:block">
            Welcome back,
          </p>

          <h1 className="truncate text-sm font-semibold text-white sm:text-lg">
            {user.name}
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                className="h-auto gap-3 px-2 py-1.5"
                aria-label="Open user menu"
              />
            }
          >
            <Avatar className="h-9 w-9 border border-emerald-500/20">
              {user.avatar && (
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                />
              )}

              <AvatarFallback className="bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="hidden min-w-0 text-left md:block">
              <p className="max-w-36 truncate text-sm font-medium text-white">
                {user.name}
              </p>

              <p className="text-xs text-slate-500">
                {roleLabel}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60"
          >
            {/* User Information */}
            <div className="px-2 py-2">
              <p className="truncate text-sm font-medium">
                {user.name}
              </p>

              <p className="mt-1 truncate text-xs text-muted-foreground">
                {user.email}
              </p>

              <p className="mt-1 text-xs font-medium text-emerald-500">
                {roleLabel}
              </p>
            </div>

            <DropdownMenuSeparator />

            {/* Profile */}
            <DropdownMenuItem
              onClick={handleProfileClick}
              className="cursor-pointer"
            >
              <UserRound className="mr-2 h-4 w-4" />

              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              disabled={isLoggingOut}
              onClick={() => {
                void handleLogout();
              }}
              className="cursor-pointer text-red-400 focus:text-red-400"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}

              {isLoggingOut
                ? "Signing out..."
                : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
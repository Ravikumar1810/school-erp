import type { AuthUser } from "@/types/auth";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "STUDENT";

export const ROLE_DASHBOARD_PATHS: Record<
  UserRole,
  string
> = {
  SUPER_ADMIN: "/super-admin",
  ADMIN: "/admin",
  STUDENT: "/student",
};

export function getDashboardPathByRole(
  role: UserRole,
): string {
  return ROLE_DASHBOARD_PATHS[role];
}

export function isUserRole(
  role: unknown,
): role is UserRole {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN" ||
    role === "STUDENT"
  );
}

export function getRequiredRoleFromPath(
  pathname: string,
): UserRole | null {
  if (
    pathname === "/super-admin" ||
    pathname.startsWith("/super-admin/")
  ) {
    return "SUPER_ADMIN";
  }

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    return "ADMIN";
  }

  if (
    pathname === "/student" ||
    pathname.startsWith("/student/")
  ) {
    return "STUDENT";
  }

  return null;
}

export function canAccessPath(
  user: AuthUser,
  pathname: string,
): boolean {
  const requiredRole =
    getRequiredRoleFromPath(pathname);

  if (!requiredRole) {
    return true;
  }

  return user.role === requiredRole;
}
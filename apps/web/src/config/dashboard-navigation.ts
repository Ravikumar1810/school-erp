import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Settings,
  UserRound,
  UsersRound,
} from "lucide-react";

import { UserRole } from "@/types/auth";

export interface DashboardNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const superAdminNavigation: DashboardNavigationItem[] = [
  {
    title: "Overview",
    href: "/super-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Teachers",
    href: "/super-admin/teachers",
    icon: UsersRound,
  },
  {
    title: "Students",
    href: "/super-admin/students",
    icon: GraduationCap,
  },
  {
    title: "Attendance",
    href: "/super-admin/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Marks",
    href: "/super-admin/marks",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    href: "/super-admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/super-admin/profile",
    icon: UserRound,
  },
];

const adminNavigation: DashboardNavigationItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    title: "Attendance",
    href: "/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Marks",
    href: "/admin/marks",
    icon: BookOpen,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: UserRound,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const studentNavigation: DashboardNavigationItem[] = [
  {
    title: "Overview",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    title: "My Attendance",
    href: "/student/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "My Marks",
    href: "/student/marks",
    icon: BookOpen,
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: UserRound,
  },
  {
    title: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
];

export function getDashboardNavigation(
  role: UserRole,
): DashboardNavigationItem[] {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return superAdminNavigation;

    case UserRole.ADMIN:
      return adminNavigation;

    case UserRole.STUDENT:
      return studentNavigation;

    default:
      return [];
  }
}
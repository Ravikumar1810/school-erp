"use client";

import {
  CalendarDays,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import type {
  Profile,
} from "@/services/profile.service";

interface ProfileCardProps {
  profile: Profile;
}

function getRoleLabel(
  role: Profile["role"],
) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Principal";

    case "ADMIN":
      return "Teacher";

    case "STUDENT":
      return "Student";

    default:
      return role;
  }
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value:
    | string
    | null
    | undefined;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

export function ProfileCard({
  profile,
}: ProfileCardProps) {
  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="border-b border-border/60 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="size-20 rounded-2xl border border-border object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-2xl font-bold text-emerald-400">
              {initials}
            </div>
          )}

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {profile.name}
              </h2>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                {getRoleLabel(
                  profile.role,
                )}
              </span>

              {profile.isActive && (
                <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                  Active
                </span>
              )}
            </div>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="mb-5 text-lg font-semibold">
          Account Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            icon={User}
            label="Full Name"
            value={profile.name}
          />

          <DetailItem
            icon={Mail}
            label="Email Address"
            value={profile.email}
          />

          <DetailItem
            icon={ShieldCheck}
            label="Account Role"
            value={getRoleLabel(
              profile.role,
            )}
          />

          <DetailItem
            icon={CalendarDays}
            label="Member Since"
            value={new Date(
              profile.createdAt,
            ).toLocaleDateString()}
          />
        </div>

        {profile.student && (
          <>
            <div className="my-8 border-t border-border/60" />

            <h3 className="mb-5 text-lg font-semibold">
              Student Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                icon={Hash}
                label="Admission Number"
                value={
                  profile.student
                    .admissionNumber
                }
              />

              <DetailItem
                icon={GraduationCap}
                label="Class"
                value={
                  profile.student
                    .className
                }
              />

              <DetailItem
                icon={GraduationCap}
                label="Section"
                value={
                  profile.student
                    .section
                }
              />

              <DetailItem
                icon={Hash}
                label="Roll Number"
                value={
                  profile.student
                    .rollNumber
                }
              />

              <DetailItem
                icon={Users}
                label="Parent Name"
                value={
                  profile.student
                    .parentName
                }
              />

              <DetailItem
                icon={Phone}
                label="Parent Phone"
                value={
                  profile.student
                    .parentPhone
                }
              />

              <DetailItem
                icon={CalendarDays}
                label="Date of Birth"
                value={
                  profile.student
                    .dateOfBirth
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
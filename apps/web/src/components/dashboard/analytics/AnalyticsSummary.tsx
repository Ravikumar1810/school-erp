import {
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

import type {
  AnalyticsSummary as AnalyticsSummaryType,
} from "@/services/analytics.service";

interface AnalyticsSummaryProps {
  data: AnalyticsSummaryType;
}

export function AnalyticsSummary({
  data,
}: AnalyticsSummaryProps) {
  const items = [
    {
      label:
        "Total Students",

      value:
        data.totalStudents,

      icon:
        GraduationCap,
    },

    {
      label:
        "Total Teachers",

      value:
        data.totalTeachers,

      icon:
        Users,
    },

    {
      label:
        "Attendance Rate",

      value: `${data.attendanceRate}%`,

      icon:
        CalendarCheck,
    },

    {
      label:
        "Avg. Performance",

      value: `${data.averagePerformance}%`,

      icon:
        TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(
        ({
          label,
          value,
          icon: Icon,
        }) => (
          <div
            key={label}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Icon className="size-5 text-emerald-400" />
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight">
              {value}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
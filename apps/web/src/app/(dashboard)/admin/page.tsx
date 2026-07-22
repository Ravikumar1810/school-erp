"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  BookOpenCheck,
  Loader2,
} from "lucide-react";

import {
  dashboardService,
  type AdminDashboardData,
} from "@/services/dashboard.service";

export default function AdminDashboardPage() {
  const [
    data,
    setData,
  ] =
    useState<AdminDashboardData | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          const result =
            await dashboardService
              .getAdminDashboard();

          setData(result);
        } catch (error) {
          console.error(
            "Failed to load teacher dashboard:",
            error,
          );
        } finally {
          setIsLoading(false);
        }
      };

    void loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400">
        Unable to load dashboard.
      </div>
    );
  }

  const stats = [
    {
      title:
        "Total Students",
      value:
        data.stats
          .totalStudents,
      icon:
        GraduationCap,
    },
    {
      title:
        "Attendance Rate",
      value: `${data.stats.attendanceRate}%`,
      icon:
        CalendarCheck,
    },
    {
      title:
        "Avg. Performance",
      value: `${data.stats.averagePerformance}%`,
      icon:
        TrendingUp,
    },
    {
      title:
        "Mark Records",
      value:
        data.stats
          .totalMarkRecords,
      icon:
        BookOpenCheck,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Teacher Dashboard
        </div>

        <h1 className="mt-4 text-3xl font-bold">
          Academic Overview
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor student
          attendance and academic
          performance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            title,
            value,
            icon: Icon,
          }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <Icon className="size-5 text-emerald-400" />
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                {title}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {value}
              </p>
            </div>
          ),
        )}
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Attendance Summary
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Present"
            value={
              data
                .attendanceOverview
                .present
            }
          />

          <SummaryCard
            label="Absent"
            value={
              data
                .attendanceOverview
                .absent
            }
          />

          <SummaryCard
            label="Leave"
            value={
              data
                .attendanceOverview
                .leave
            }
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-background/50 p-5">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
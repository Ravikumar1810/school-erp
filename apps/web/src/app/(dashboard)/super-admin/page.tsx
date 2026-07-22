"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  GraduationCap,
  Users,
  CalendarCheck,
  TrendingUp,
  Loader2,
} from "lucide-react";

import {
  dashboardService,
  type SuperAdminDashboardData,
} from "@/services/dashboard.service";

export default function SuperAdminDashboardPage() {
  const [
    data,
    setData,
  ] =
    useState<SuperAdminDashboardData | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const result =
            await dashboardService
              .getSuperAdminDashboard();

          setData(result);
        } catch (error) {
          console.error(
            "Failed to load dashboard:",
            error,
          );

          setError(
            "Unable to load dashboard statistics.",
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

  if (
    error ||
    !data
  ) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
        {error ??
          "Dashboard data is unavailable."}
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
      description:
        "Registered students",
      icon:
        GraduationCap,
    },
    {
      title:
        "Total Teachers",
      value:
        data.stats
          .totalTeachers,
      description:
        "Active teaching staff",
      icon:
        Users,
    },
    {
      title:
        "Attendance Rate",
      value: `${data.stats.attendanceRate}%`,
      description:
        "Overall attendance",
      icon:
        CalendarCheck,
    },
    {
      title:
        "Avg. Performance",
      value: `${data.stats.averagePerformance}%`,
      description:
        "Academic performance",
      icon:
        TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Principal Dashboard
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          School Overview
        </h1>

        <p className="mt-2 text-muted-foreground">
          Real-time overview of
          students, teachers,
          attendance and academic
          performance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            title,
            value,
            description,
            icon: Icon,
          }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Icon className="size-5 text-emerald-400" />
                </div>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                {title}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {value}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
          ),
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            Attendance Overview
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Overall attendance
            records
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <OverviewItem
              label="Present"
              value={
                data
                  .attendanceOverview
                  .present
              }
            />

            <OverviewItem
              label="Absent"
              value={
                data
                  .attendanceOverview
                  .absent
              }
            />

            <OverviewItem
              label="Leave"
              value={
                data
                  .attendanceOverview
                  .leave
              }
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Attendance Rate
              </span>

              <span className="font-semibold">
                {
                  data.stats
                    .attendanceRate
                }
                %
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(
                    data.stats
                      .attendanceRate,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            Academic Performance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            School-wide marks
            overview
          </p>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Average
                Performance
              </p>

              <p className="mt-2 text-4xl font-bold">
                {
                  data.stats
                    .averagePerformance
                }
                %
              </p>
            </div>

            <TrendingUp className="size-10 text-emerald-400" />
          </div>

          <div className="mt-8 border-t pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Mark
                Records
              </span>

              <span className="font-semibold">
                {
                  data
                    .marksOverview
                    .totalRecords
                }
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-background/50 p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}
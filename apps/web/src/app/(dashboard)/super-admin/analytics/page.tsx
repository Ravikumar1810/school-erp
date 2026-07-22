"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BarChart3,
  Loader2,
} from "lucide-react";

import {
  analyticsService,
  type SuperAdminAnalyticsData,
} from "@/services/analytics.service";

import {
  AnalyticsSummary,
} from "@/components/dashboard/analytics/AnalyticsSummary";

import {
  AttendanceChart,
} from "@/components/dashboard/analytics/AttendanceChart";

import {
  PerformanceChart,
} from "@/components/dashboard/analytics/PerformanceChart";

import {
  ClassPerformanceChart,
} from "@/components/dashboard/analytics/ClassPerformanceChart";

export default function SuperAdminAnalyticsPage() {
  const [
    data,
    setData,
  ] =
    useState<SuperAdminAnalyticsData | null>(
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
    const loadAnalytics =
      async () => {
        try {
          setIsLoading(
            true,
          );

          setError(null);

          const result =
            await analyticsService
              .getSuperAdminAnalytics();

          setData(result);
        } catch (error) {
          console.error(
            "Failed to load analytics:",
            error,
          );

          setError(
            "Unable to load school analytics.",
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      };

    void loadAnalytics();
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
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm text-red-400">
          {error ??
            "Analytics data is unavailable."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <BarChart3 className="size-3.5" />

          School Analytics
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Analytics Overview
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Analyze school-wide
          attendance, academic
          performance and class
          progress using real
          PostgreSQL data.
        </p>
      </section>

      {/* Summary */}

      <AnalyticsSummary
        data={
          data.summary
        }
      />

      {/* Attendance */}

      <section className="rounded-2xl border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Attendance Trend
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Present, absent and
            leave attendance over
            recent dates.
          </p>
        </div>

        <div className="mt-8">
          <AttendanceChart
            data={
              data.attendanceTrend
            }
          />
        </div>
      </section>

      {/* Performance */}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            Subject Performance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Average student
            performance by
            subject.
          </p>

          <div className="mt-8">
            <PerformanceChart
              data={
                data.subjectPerformance
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            Class Performance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Average academic
            performance by class.
          </p>

          <div className="mt-8">
            <ClassPerformanceChart
              data={
                data.classPerformance
              }
            />
          </div>
        </div>
      </section>

      {/* Distribution */}

      <section className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Attendance
          Distribution
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Overall attendance
          record distribution.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DistributionCard
            label="Total Records"
            value={
              data
                .attendanceDistribution
                .total
            }
          />

          <DistributionCard
            label="Present"
            value={
              data
                .attendanceDistribution
                .present
            }
          />

          <DistributionCard
            label="Absent"
            value={
              data
                .attendanceDistribution
                .absent
            }
          />

          <DistributionCard
            label="Leave"
            value={
              data
                .attendanceDistribution
                .leave
            }
          />
        </div>
      </section>
    </div>
  );
}

function DistributionCard({
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
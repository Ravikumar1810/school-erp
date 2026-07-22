"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarCheck,
  TrendingUp,
  BookOpen,
  ClipboardCheck,
  Loader2,
} from "lucide-react";

import {
  dashboardService,
  type StudentDashboardData,
} from "@/services/dashboard.service";

export default function StudentDashboardPage() {
  const [
    data,
    setData,
  ] =
    useState<StudentDashboardData | null>(
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
              .getStudentDashboard();

          setData(result);
        } catch (error) {
          console.error(
            "Failed to load student dashboard:",
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
        Unable to load your
        dashboard.
      </div>
    );
  }

  const stats = [
    {
      title:
        "Attendance",
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
        "Subjects",
      value:
        data.stats
          .totalSubjects,
      icon:
        BookOpen,
    },
    {
      title:
        "Attendance Records",
      value:
        data.stats
          .totalAttendanceRecords,
      icon:
        ClipboardCheck,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Student Dashboard
        </div>

        <h1 className="mt-4 text-3xl font-bold">
          Welcome,{" "}
          {data.student.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Class{" "}
          {
            data.student
              .className
          }
          {" • "}
          Section{" "}
          {
            data.student
              .section
          }
          {" • "}
          Roll No.{" "}
          {
            data.student
              .rollNumber
          }
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

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            My Attendance
          </h2>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <AttendanceItem
              label="Present"
              value={
                data
                  .attendanceOverview
                  .present ?? 0
              }
            />

            <AttendanceItem
              label="Absent"
              value={
                data
                  .attendanceOverview
                  .absent ?? 0
              }
            />

            <AttendanceItem
                label="Leave"
                value={
                    data
                        .attendanceOverview
                        .leave ?? 0
                }
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            Subject Performance
          </h2>

          <div className="mt-6 space-y-5">
            {data
              .subjectPerformance
              .length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No marks have
                been added yet.
              </p>
            ) : (
              data
                .subjectPerformance
                .map(
                  (
                    subject,
                  ) => (
                    <div
                      key={
                        subject.subject
                      }
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {
                            subject.subject
                          }
                        </span>

                        <span className="font-semibold">
                          {
                            subject.percentage
                          }
                          %
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.min(
                              subject.percentage,
                              100,
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {
                          subject.marksObtained
                        }
                        /
                        {
                          subject.totalMarks
                        }
                      </p>
                    </div>
                  ),
                )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AttendanceItem({
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
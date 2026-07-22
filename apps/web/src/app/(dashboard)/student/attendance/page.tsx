"use client";

import {
  CalendarCheck,
  CalendarDays,
  Loader2,
  UserCheck,
  UserMinus,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { AttendanceTable } from "@/components/dashboard/attendance/AttendanceTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { attendanceService } from "@/services/attendance.service";

export default function StudentAttendancePage(): React.JSX.Element {
  const {
    data: records = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "attendance",
      "me",
    ],
    queryFn: () =>
      attendanceService.getMyAttendance(),
  });

  const total =
    records.length;

  const present =
    records.filter(
      (record) =>
        record.status ===
        "PRESENT",
    ).length;

  const absent =
    records.filter(
      (record) =>
        record.status ===
        "ABSENT",
    ).length;

  const leave =
    records.filter(
      (record) =>
        record.status ===
        "LEAVE",
    ).length;

  const attendancePercentage =
    total > 0
      ? Math.round(
          (present / total) *
            100,
        )
      : 0;

  const stats = [
    {
      label:
        "Attendance",
      value: `${attendancePercentage}%`,
      icon:
        CalendarCheck,
    },
    {
      label: "Present",
      value: present,
      icon: UserCheck,
    },
    {
      label: "Absent",
      value: absent,
      icon: UserMinus,
    },
    {
      label: "Leave",
      value: leave,
      icon:
        CalendarDays,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <Badge
          variant="outline"
          className="mb-3 border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
        >
          My Attendance
        </Badge>

        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Attendance
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          View your attendance summary
          and daily attendance history.
        </p>
      </section>

      {!isLoading &&
        !isError && (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(
              ({
                label,
                value,
                icon: Icon,
              }) => (
                <Card
                  key={label}
                  className="border-white/10 bg-white/[0.03]"
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        {label}
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        {value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </section>
        )}

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-lg text-white">
            Attendance History
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
          ) : isError ? (
            <div className="flex min-h-80 flex-col items-center justify-center">
              <p className="text-white">
                Unable to load your
                attendance.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  void refetch();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <AttendanceTable
              records={records}
              showStudent={
                false
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
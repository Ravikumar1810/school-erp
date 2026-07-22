"use client";

import {
  GraduationCap,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { AddStudentDialog } from "@/components/dashboard/students/AddStudentDialog";
import { StudentTable } from "@/components/dashboard/students/StudentTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { studentService } from "@/services/student.service";

export default function SuperAdminStudentsPage(): React.JSX.Element {
  const {
    data: students = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      studentService.getAll(),
  });

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <Badge
            variant="outline"
            className="mb-3 border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
          >
            Student Management
          </Badge>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Students
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Manage student accounts and
            academic profiles.
          </p>
        </div>

        <AddStudentDialog />
      </section>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Total Students
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {students.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">
              Student Directory
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              All registered students
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
          >
            <RefreshCw
              className={
                isFetching
                  ? "h-4 w-4 animate-spin"
                  : "h-4 w-4"
              }
            />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
          ) : isError ? (
            <div className="flex min-h-80 flex-col items-center justify-center">
              <p className="text-white">
                Unable to load students.
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
            <StudentTable
              students={students}
              canDelete
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
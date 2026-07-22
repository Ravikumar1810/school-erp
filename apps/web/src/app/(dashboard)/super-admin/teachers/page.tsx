"use client";

import {
  Loader2,
  Plus,
  RefreshCw,
  UsersRound,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { AddTeacherDialog } from "@/components/dashboard/teachers/AddTeacherDialog";
import { TeacherTable } from "@/components/dashboard/teachers/TeacherTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { teacherService } from "@/services/teacher.service";

export default function TeachersPage(): React.JSX.Element {
  const {
    data: teachers = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: () =>
      teacherService.getAll(),
  });

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <Badge
            variant="outline"
            className="mb-3 border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
          >
            Teacher Management
          </Badge>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Teachers
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Create and manage teacher accounts.
            Teachers can sign in to manage
            student attendance and academic
            marks.
          </p>
        </div>

        <AddTeacherDialog />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <UsersRound className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Total Teachers
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {teachers.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <UsersRound className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Active Teachers
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {
                  teachers.filter(
                    (teacher) =>
                      teacher.isActive,
                  ).length
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg text-white">
              Teacher Directory
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              All registered teacher accounts
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
            aria-label="Refresh teachers"
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
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />

                <p className="text-sm text-slate-500">
                  Loading teachers...
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <p className="font-medium text-white">
                Unable to load teachers
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Something went wrong while
                fetching teacher accounts.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  void refetch();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <TeacherTable
              teachers={teachers}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
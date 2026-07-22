"use client";

import { useState } from "react";

import {
  BookOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { AddMarkDialog } from "@/components/dashboard/marks/AddMarkDialog";
import { MarksTable } from "@/components/dashboard/marks/MarksTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  markService,
  type MarkRecord,
} from "@/services/mark.service";

import { studentService } from "@/services/student.service";

export default function AdminMarksPage(): React.JSX.Element {
  const [
    selectedRecord,
    setSelectedRecord,
  ] =
    useState<MarkRecord | null>(
      null,
    );

  const [
    editDialogOpen,
    setEditDialogOpen,
  ] = useState(false);

  const {
    data: records = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["marks"],
    queryFn: () =>
      markService.getAll(),
  });

  const {
    data: students = [],
    isLoading:
      studentsLoading,
  } = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      studentService.getAll(),
  });

  const handleEdit = (
    record: MarkRecord,
  ): void => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <Badge
            variant="outline"
            className="mb-3 border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
          >
            Marks Management
          </Badge>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Student Marks
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Add and manage student
            examination results.
          </p>
        </div>

        {!studentsLoading && (
          <AddMarkDialog
            students={students}
          />
        )}
      </section>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
            <BookOpen className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Marks Records
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {records.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-white">
            Student Results
          </CardTitle>

          <Button
            type="button"
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
            <div className="flex min-h-80 items-center justify-center">
              <p className="text-white">
                Unable to load marks.
              </p>
            </div>
          ) : (
            <MarksTable
              records={records}
              canEdit
              onEdit={
                handleEdit
              }
            />
          )}
        </CardContent>
      </Card>

      <AddMarkDialog
        students={students}
        record={selectedRecord}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(
            open,
          );

          if (!open) {
            setSelectedRecord(
              null,
            );
          }
        }}
      />
    </div>
  );
}
"use client";

import {
  BookOpen,
  Pencil,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  ExamType,
  MarkRecord,
} from "@/services/mark.service";

interface MarksTableProps {
  records: MarkRecord[];
  canEdit?: boolean;
  showStudent?: boolean;
  onEdit?: (
    record: MarkRecord,
  ) => void;
}

function formatExamType(
  examType: ExamType,
): string {
  switch (examType) {
    case "UNIT_TEST":
      return "Unit Test";

    case "MID_TERM":
      return "Mid Term";

    case "FINAL":
      return "Final";

    case "ASSIGNMENT":
      return "Assignment";

    default:
      return examType;
  }
}

function getPercentageClasses(
  percentage: number,
): string {
  if (percentage >= 75) {
    return "text-emerald-400";
  }

  if (percentage >= 40) {
    return "text-amber-400";
  }

  return "text-red-400";
}

export function MarksTable({
  records,
  canEdit = false,
  showStudent = true,
  onEdit,
}: MarksTableProps): React.JSX.Element {
  if (records.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <BookOpen className="h-6 w-6 text-emerald-400" />
        </div>

        <h3 className="mt-5 font-semibold text-white">
          No marks records
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Student marks will appear
          here once they are added.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            {showStudent && (
              <TableHead>
                Student
              </TableHead>
            )}

            <TableHead>
              Subject
            </TableHead>

            <TableHead>
              Exam
            </TableHead>

            <TableHead>
              Marks
            </TableHead>

            <TableHead>
              Percentage
            </TableHead>

            <TableHead>
              Result
            </TableHead>

            <TableHead>
              Remarks
            </TableHead>

            {showStudent && (
              <TableHead>
                Added By
              </TableHead>
            )}

            {canEdit && (
              <TableHead className="text-right">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.id}
              className="border-white/10"
            >
              {showStudent && (
                <TableCell>
                  <div>
                    <p className="font-medium text-white">
                      {
                        record.student
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {
                        record.student
                          .admissionNumber
                      }
                      {" · "}
                      {
                        record.student
                          .className
                      }
                      -
                      {
                        record.student
                          .section
                      }
                    </p>
                  </div>
                </TableCell>
              )}

              <TableCell>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-400" />

                  <span className="font-medium text-slate-200">
                    {
                      record.subject
                    }
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className="border-white/10 text-slate-300"
                >
                  {formatExamType(
                    record.examType,
                  )}
                </Badge>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="font-semibold text-white">
                  {
                    record.marksObtained
                  }
                </span>

                <span className="text-slate-500">
                  {" / "}
                  {
                    record.maximumMarks
                  }
                </span>
              </TableCell>

              <TableCell>
                <span
                  className={`font-semibold ${getPercentageClasses(
                    record.percentage,
                  )}`}
                >
                  {
                    record.percentage
                  }
                  %
                </span>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    record.result ===
                    "PASS"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/20 bg-red-500/10 text-red-400"
                  }
                >
                  {record.result ===
                  "PASS"
                    ? "Pass"
                    : "Needs Improvement"}
                </Badge>
              </TableCell>

              <TableCell className="max-w-[200px] text-sm text-slate-400">
                {record.remarks ||
                  "—"}
              </TableCell>

              {showStudent && (
                <TableCell>
                  <div>
                    <p className="text-sm text-slate-300">
                      {
                        record.addedBy
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {
                        record.addedBy
                          .email
                      }
                    </p>
                  </div>
                </TableCell>
              )}

              {canEdit && (
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onEdit?.(record)
                    }
                    className="text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
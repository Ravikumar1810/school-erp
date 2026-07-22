"use client";

import {
  CalendarDays,
  Pencil,
  UsersRound,
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
  AttendanceRecord,
  AttendanceStatus,
} from "@/services/attendance.service";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  canEdit?: boolean;
  onEdit?: (
    record: AttendanceRecord,
  ) => void;
  showStudent?: boolean;
}

function getStatusClasses(
  status: AttendanceStatus,
): string {
  switch (status) {
    case "PRESENT":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "ABSENT":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    case "LEAVE":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    default:
      return "";
  }
}

function formatDate(
  date: string,
): string {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(`${date}T00:00:00`),
  );
}

export function AttendanceTable({
  records,
  canEdit = false,
  onEdit,
  showStudent = true,
}: AttendanceTableProps): React.JSX.Element {
  if (records.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <CalendarDays className="h-6 w-6 text-emerald-400" />
        </div>

        <h3 className="mt-5 font-semibold text-white">
          No attendance records
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Attendance records will appear
          here once they are marked.
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
              Date
            </TableHead>

            <TableHead>
              Class
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Remarks
            </TableHead>

            <TableHead>
              Marked By
            </TableHead>

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
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                      <UsersRound className="h-4 w-4 text-emerald-400" />
                    </div>

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
                      </p>
                    </div>
                  </div>
                </TableCell>
              )}

              <TableCell className="whitespace-nowrap text-slate-300">
                {formatDate(
                  record.date,
                )}
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className="border-white/10 text-slate-300"
                >
                  {
                    record.student
                      .className
                  }
                  -
                  {
                    record.student
                      .section
                  }
                </Badge>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusClasses(
                    record.status,
                  )}
                >
                  {record.status}
                </Badge>
              </TableCell>

              <TableCell className="max-w-[220px] text-sm text-slate-400">
                {record.remarks ||
                  "—"}
              </TableCell>

              <TableCell>
                <div>
                  <p className="text-sm text-slate-300">
                    {
                      record.markedBy
                        .name
                    }
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {
                      record.markedBy
                        .email
                    }
                  </p>
                </div>
              </TableCell>

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
"use client";

import {
  Loader2,
  Mail,
  Trash2,
  UsersRound,
} from "lucide-react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

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

import {
  studentService,
  type Student,
} from "@/services/student.service";

interface StudentTableProps {
  students: Student[];
  canDelete?: boolean;
}

function getInitials(
  name: string,
): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function StudentTable({
  students,
  canDelete = false,
}: StudentTableProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (studentId: string) =>
      studentService.delete(studentId),

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      toast.success(response.message);
    },

    onError: () => {
      toast.error(
        "Unable to delete student.",
      );
    },
  });

  const handleDelete = (
    student: Student,
  ): void => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}? This will also remove the student's login account.`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(student.id);
  };

  if (students.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <UsersRound className="h-6 w-6 text-emerald-400" />
        </div>

        <h3 className="mt-5 font-semibold text-white">
          No students found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Add your first student to start
          managing academic information.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead>
              Student
            </TableHead>

            <TableHead>
              Admission No.
            </TableHead>

            <TableHead>
              Class
            </TableHead>

            <TableHead>
              Roll No.
            </TableHead>

            <TableHead>
              Parent
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            {canDelete && (
              <TableHead className="text-right">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => {
            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables ===
                student.id;

            return (
              <TableRow
                key={student.id}
                className="border-white/10"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-emerald-500/20">
                      {student.avatar && (
                        <AvatarImage
                          src={student.avatar}
                          alt={student.name}
                        />
                      )}

                      <AvatarFallback className="bg-emerald-500/10 text-emerald-400">
                        {getInitials(
                          student.name,
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium text-white">
                        {student.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-slate-300">
                  {
                    student.admissionNumber
                  }
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-white/10 text-slate-300"
                  >
                    Class{" "}
                    {student.className}-
                    {student.section}
                  </Badge>
                </TableCell>

                <TableCell className="text-slate-300">
                  {student.rollNumber}
                </TableCell>

                <TableCell>
                  <p className="text-sm text-slate-300">
                    {student.parentName ??
                      "—"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {student.parentPhone ??
                      "No phone"}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      student.isActive
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                        : "border-red-500/20 bg-red-500/5 text-red-400"
                    }
                  >
                    {student.isActive
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </TableCell>

                {canDelete && (
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={
                        deleteMutation.isPending
                      }
                      onClick={() =>
                        handleDelete(
                          student,
                        )
                      }
                      className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
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
  teacherService,
  type Teacher,
} from "@/services/teacher.service";

interface TeacherTableProps {
  teachers: Teacher[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

export function TeacherTable({
  teachers,
}: TeacherTableProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (teacherId: string) =>
      teacherService.delete(teacherId),

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      toast.success(response.message);
    },

    onError: () => {
      toast.error(
        "Unable to delete teacher. Please try again.",
      );
    },
  });

  const handleDelete = (
    teacher: Teacher,
  ): void => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${teacher.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(
      teacher.id,
    );
  };

  if (teachers.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <UsersRound className="h-6 w-6 text-emerald-400" />
        </div>

        <h3 className="mt-5 text-base font-semibold text-white">
          No teachers found
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          There are no teacher accounts yet.
          Add your first teacher to get started.
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
              Teacher
            </TableHead>

            <TableHead>
              Email
            </TableHead>

            <TableHead>
              Role
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Added
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teachers.map((teacher) => {
            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables ===
                teacher.id;

            return (
              <TableRow
                key={teacher.id}
                className="border-white/10"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-emerald-500/20">
                      {teacher.avatar && (
                        <AvatarImage
                          src={teacher.avatar}
                          alt={teacher.name}
                        />
                      )}

                      <AvatarFallback className="bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                        {getInitials(
                          teacher.name,
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium text-white">
                        {teacher.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        ID:{" "}
                        {teacher.id.slice(
                          0,
                          8,
                        )}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="h-4 w-4" />

                    <span>
                      {teacher.email}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-white/10 text-slate-300"
                  >
                    Teacher
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      teacher.isActive
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                        : "border-red-500/20 bg-red-500/5 text-red-400"
                    }
                  >
                    {teacher.isActive
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="text-slate-400">
                  {formatDate(
                    teacher.createdAt,
                  )}
                </TableCell>

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
                        teacher,
                      )
                    }
                    className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Delete ${teacher.name}`}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
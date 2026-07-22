"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarCheck,
  Loader2,
  Plus,
} from "lucide-react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  attendanceService,
  type AttendanceRecord,
  type AttendanceStatus,
} from "@/services/attendance.service";

import type { Student } from "@/services/student.service";

interface MarkAttendanceDialogProps {
  students: Student[];
  record?: AttendanceRecord | null;
  open?: boolean;
  onOpenChange?: (
    open: boolean,
  ) => void;
}

interface AttendanceFormState {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks: string;
}

function getToday(): string {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    now.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?:
              | string
              | string[];
          };
        };
      }
    ).response;

    const message =
      response?.data?.message;

    if (Array.isArray(message)) {
      return (
        message[0] ??
        "Unable to save attendance."
      );
    }

    if (
      typeof message === "string"
    ) {
      return message;
    }
  }

  return "Unable to save attendance. Please try again.";
}

export function MarkAttendanceDialog({
  students,
  record = null,
  open: controlledOpen,
  onOpenChange,
}: MarkAttendanceDialogProps): React.JSX.Element {
  const queryClient =
    useQueryClient();

  const [internalOpen, setInternalOpen] =
    useState(false);

  const open =
    controlledOpen ??
    internalOpen;

  const setOpen = (
    value: boolean,
  ): void => {
    if (onOpenChange) {
      onOpenChange(value);
      return;
    }

    setInternalOpen(value);
  };

  const [formData, setFormData] =
    useState<AttendanceFormState>({
      studentId: "",
      date: getToday(),
      status: "PRESENT",
      remarks: "",
    });

  useEffect(() => {
    if (record) {
      setFormData({
        studentId:
          record.studentId,
        date: record.date,
        status:
          record.status,
        remarks:
          record.remarks ?? "",
      });

      return;
    }

    setFormData({
      studentId: "",
      date: getToday(),
      status: "PRESENT",
      remarks: "",
    });
  }, [record, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (record) {
        return attendanceService.update(
          record.id,
          {
            status:
              formData.status,

            remarks:
              formData.remarks.trim(),
          },
        );
      }

      return attendanceService.create(
        {
          studentId:
            formData.studentId,

          date:
            formData.date,

          status:
            formData.status,

          ...(formData.remarks.trim()
            ? {
                remarks:
                  formData.remarks.trim(),
              }
            : {}),
        },
      );
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "attendance",
        ],
      });

      toast.success(
        record
          ? "Attendance updated successfully."
          : "Attendance marked successfully.",
      );

      setOpen(false);
    },

    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error),
      );
    },
  });

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (
      !record &&
      !formData.studentId
    ) {
      toast.error(
        "Please select a student.",
      );
      return;
    }

    if (!formData.date) {
      toast.error(
        "Please select a date.",
      );
      return;
    }

    mutation.mutate();
  };

  return (
    <>
      {!onOpenChange && (
        <Button
          type="button"
          onClick={() =>
            setOpen(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      )}

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (
            !mutation.isPending
          ) {
            setOpen(value);
          }
        }}
      >
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-[520px]">
          <DialogHeader>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <CalendarCheck className="h-5 w-5 text-emerald-400" />
            </div>

            <DialogTitle>
              {record
                ? "Update Attendance"
                : "Mark Attendance"}
            </DialogTitle>

            <DialogDescription className="text-slate-400">
              {record
                ? "Correct the attendance status or remarks for this record."
                : "Select a student and record their attendance."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="attendance-student">
                Student
              </Label>

              {record ? (
                <Input
                  id="attendance-student"
                  value={`${record.student.name} (${record.student.admissionNumber})`}
                  disabled
                />
              ) : (
                <select
                  id="attendance-student"
                  value={
                    formData.studentId
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(
                    event,
                  ) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        studentId:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                >
                  <option value="">
                    Select student
                  </option>

                  {students.map(
                    (student) => (
                      <option
                        key={
                          student.id
                        }
                        value={
                          student.id
                        }
                      >
                        {
                          student.name
                        }{" "}
                        -{" "}
                        {
                          student.admissionNumber
                        }
                      </option>
                    ),
                  )}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance-date">
                Date
              </Label>

              <Input
                id="attendance-date"
                type="date"
                value={
                  formData.date
                }
                disabled={
                  Boolean(record) ||
                  mutation.isPending
                }
                onChange={(
                  event,
                ) =>
                  setFormData(
                    (current) => ({
                      ...current,
                      date:
                        event.target
                          .value,
                    }),
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Attendance Status
              </Label>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    "PRESENT",
                    "ABSENT",
                    "LEAVE",
                  ] as AttendanceStatus[]
                ).map(
                  (status) => (
                    <Button
                      key={
                        status
                      }
                      type="button"
                      variant={
                        formData.status ===
                        status
                          ? "default"
                          : "outline"
                      }
                      disabled={
                        mutation.isPending
                      }
                      onClick={() =>
                        setFormData(
                          (
                            current,
                          ) => ({
                            ...current,
                            status,
                          }),
                        )
                      }
                    >
                      {status}
                    </Button>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance-remarks">
                Remarks
              </Label>

              <textarea
                id="attendance-remarks"
                rows={3}
                value={
                  formData.remarks
                }
                disabled={
                  mutation.isPending
                }
                placeholder="Optional remarks..."
                onChange={(
                  event,
                ) =>
                  setFormData(
                    (current) => ({
                      ...current,
                      remarks:
                        event.target
                          .value,
                    }),
                  )
                }
                className="w-full resize-none rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500/50"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={
                  mutation.isPending
                }
                onClick={() =>
                  setOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  mutation.isPending
                }
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="mr-2 h-4 w-4" />

                    {record
                      ? "Update Attendance"
                      : "Save Attendance"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
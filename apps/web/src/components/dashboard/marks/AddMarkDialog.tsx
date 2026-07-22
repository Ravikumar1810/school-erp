"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BookPlus,
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
  markService,
  type ExamType,
  type MarkRecord,
} from "@/services/mark.service";

import type { Student } from "@/services/student.service";

interface AddMarkDialogProps {
  students: Student[];
  record?: MarkRecord | null;
  open?: boolean;
  onOpenChange?: (
    open: boolean,
  ) => void;
}

interface MarkFormState {
  studentId: string;
  subject: string;
  examType: ExamType;
  marksObtained: string;
  maximumMarks: string;
  remarks: string;
}

const initialFormState: MarkFormState = {
  studentId: "",
  subject: "",
  examType: "UNIT_TEST",
  marksObtained: "",
  maximumMarks: "100",
  remarks: "",
};

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
        "Unable to save marks."
      );
    }

    if (
      typeof message === "string"
    ) {
      return message;
    }
  }

  return "Unable to save marks. Please try again.";
}

export function AddMarkDialog({
  students,
  record = null,
  open: controlledOpen,
  onOpenChange,
}: AddMarkDialogProps): React.JSX.Element {
  const queryClient =
    useQueryClient();

  const [
    internalOpen,
    setInternalOpen,
  ] = useState(false);

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

  const [
    formData,
    setFormData,
  ] =
    useState<MarkFormState>(
      initialFormState,
    );

  useEffect(() => {
    if (record) {
      setFormData({
        studentId:
          record.studentId,

        subject:
          record.subject,

        examType:
          record.examType,

        marksObtained:
          String(
            record.marksObtained,
          ),

        maximumMarks:
          String(
            record.maximumMarks,
          ),

        remarks:
          record.remarks ?? "",
      });

      return;
    }

    setFormData(
      initialFormState,
    );
  }, [record, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      const marksObtained =
        Number(
          formData.marksObtained,
        );

      const maximumMarks =
        Number(
          formData.maximumMarks,
        );

      if (record) {
        return markService.update(
          record.id,
          {
            marksObtained,
            maximumMarks,
            remarks:
              formData.remarks.trim(),
          },
        );
      }

      return markService.create({
        studentId:
          formData.studentId,

        subject:
          formData.subject.trim(),

        examType:
          formData.examType,

        marksObtained,

        maximumMarks,

        ...(formData.remarks.trim()
          ? {
              remarks:
                formData.remarks.trim(),
            }
          : {}),
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["marks"],
      });

      toast.success(
        record
          ? "Marks updated successfully."
          : "Marks added successfully.",
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

    if (
      !record &&
      !formData.subject.trim()
    ) {
      toast.error(
        "Please enter a subject.",
      );
      return;
    }

    const obtained =
      Number(
        formData.marksObtained,
      );

    const maximum =
      Number(
        formData.maximumMarks,
      );

    if (
      formData.marksObtained === "" ||
      Number.isNaN(obtained) ||
      obtained < 0
    ) {
      toast.error(
        "Please enter valid marks obtained.",
      );
      return;
    }

    if (
      formData.maximumMarks === "" ||
      Number.isNaN(maximum) ||
      maximum <= 0
    ) {
      toast.error(
        "Maximum marks must be greater than zero.",
      );
      return;
    }

    if (obtained > maximum) {
      toast.error(
        "Marks obtained cannot be greater than maximum marks.",
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
          Add Marks
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
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950 text-white sm:max-w-[560px]">
          <DialogHeader>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <BookPlus className="h-5 w-5 text-emerald-400" />
            </div>

            <DialogTitle>
              {record
                ? "Update Marks"
                : "Add Student Marks"}
            </DialogTitle>

            <DialogDescription className="text-slate-400">
              {record
                ? "Update the student's marks and remarks."
                : "Enter the student's subject and examination marks."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="mark-student">
                Student
              </Label>

              {record ? (
                <Input
                  id="mark-student"
                  value={`${record.student.name} (${record.student.admissionNumber})`}
                  disabled
                />
              ) : (
                <select
                  id="mark-student"
                  value={
                    formData.studentId
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        studentId:
                          event.target
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mark-subject">
                  Subject
                </Label>

                <Input
                  id="mark-subject"
                  placeholder="Mathematics"
                  value={
                    formData.subject
                  }
                  disabled={
                    Boolean(record) ||
                    mutation.isPending
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        subject:
                          event.target
                            .value,
                      }),
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mark-exam">
                  Exam Type
                </Label>

                <select
                  id="mark-exam"
                  value={
                    formData.examType
                  }
                  disabled={
                    Boolean(record) ||
                    mutation.isPending
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        examType:
                          event.target
                            .value as ExamType,
                      }),
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                >
                  <option value="UNIT_TEST">
                    Unit Test
                  </option>

                  <option value="MID_TERM">
                    Mid Term
                  </option>

                  <option value="FINAL">
                    Final
                  </option>

                  <option value="ASSIGNMENT">
                    Assignment
                  </option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marks-obtained">
                  Marks Obtained
                </Label>

                <Input
                  id="marks-obtained"
                  type="number"
                  min="0"
                  placeholder="80"
                  value={
                    formData.marksObtained
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        marksObtained:
                          event.target
                            .value,
                      }),
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maximum-marks">
                  Maximum Marks
                </Label>

                <Input
                  id="maximum-marks"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={
                    formData.maximumMarks
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        maximumMarks:
                          event.target
                            .value,
                      }),
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mark-remarks">
                Remarks
              </Label>

              <textarea
                id="mark-remarks"
                rows={3}
                value={
                  formData.remarks
                }
                disabled={
                  mutation.isPending
                }
                placeholder="Optional remarks..."
                onChange={(event) =>
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
                    <BookPlus className="mr-2 h-4 w-4" />

                    {record
                      ? "Update Marks"
                      : "Save Marks"}
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
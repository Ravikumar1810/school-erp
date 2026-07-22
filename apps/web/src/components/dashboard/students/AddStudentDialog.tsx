"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  Plus,
  UserPlus,
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
  studentService,
  type CreateStudentPayload,
} from "@/services/student.service";

interface AddStudentDialogProps {
  trigger?: React.ReactNode;
}

const initialFormData: CreateStudentPayload = {
  name: "",
  email: "",
  password: "",
  admissionNumber: "",
  className: "",
  section: "",
  rollNumber: "",
  dateOfBirth: "",
  parentName: "",
  parentPhone: "",
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
            message?: string | string[];
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return (
        message[0] ??
        "Unable to create student."
      );
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Unable to create student. Please try again.";
}

export function AddStudentDialog({
  trigger,
}: AddStudentDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const [open, setOpen] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState<CreateStudentPayload>(
      initialFormData,
    );

  const mutation = useMutation({
    mutationFn: (
      payload: CreateStudentPayload,
    ) => studentService.create(payload),

    onSuccess: async (student) => {
      await queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      toast.success(
        `${student.name} was added successfully.`,
      );

      setFormData(initialFormData);
      setShowPassword(false);
      setOpen(false);
    },

    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error),
      );
    },
  });

  const updateField = (
    field: keyof CreateStudentPayload,
    value: string,
  ): void => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error(
        "Student name is required.",
      );
      return;
    }

    if (!formData.email.trim()) {
      toast.error(
        "Student email is required.",
      );
      return;
    }

    if (formData.password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (
      !formData.admissionNumber.trim()
    ) {
      toast.error(
        "Admission number is required.",
      );
      return;
    }

    if (!formData.className.trim()) {
      toast.error(
        "Class is required.",
      );
      return;
    }

    if (!formData.section.trim()) {
      toast.error(
        "Section is required.",
      );
      return;
    }

    if (!formData.rollNumber.trim()) {
      toast.error(
        "Roll number is required.",
      );
      return;
    }

    mutation.mutate({
      name: formData.name.trim(),

      email: formData.email
        .trim()
        .toLowerCase(),

      password: formData.password,

      admissionNumber:
        formData.admissionNumber.trim(),

      className:
        formData.className.trim(),

      section:
        formData.section.trim(),

      rollNumber:
        formData.rollNumber.trim(),

      ...(formData.dateOfBirth
        ? {
            dateOfBirth:
              formData.dateOfBirth,
          }
        : {}),

      ...(formData.parentName?.trim()
        ? {
            parentName:
              formData.parentName.trim(),
          }
        : {}),

      ...(formData.parentPhone?.trim()
        ? {
            parentPhone:
              formData.parentPhone.trim(),
          }
        : {}),
    });
  };

  return (
  <>
    {trigger ? (
      <div
        className="inline-flex"
        onClick={() => setOpen(true)}
      >
        {trigger}
      </div>
    ) : (
      <Button
        type="button"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Student
      </Button>
    )}

    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!mutation.isPending) {
          setOpen(value);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950 text-white sm:max-w-[650px]">
        <DialogHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
            <UserPlus className="h-5 w-5 text-emerald-400" />
          </div>

          <DialogTitle className="text-xl">
            Add New Student
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Create a student account and
            academic profile. The student can
            use the email and password to sign
            in.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="student-name">
                Full Name
              </Label>

              <Input
                id="student-name"
                placeholder="Student full name"
                value={formData.name}
                disabled={mutation.isPending}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-email">
                Email Address
              </Label>

              <Input
                id="student-email"
                type="email"
                placeholder="student@schoolerp.com"
                value={formData.email}
                disabled={mutation.isPending}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value,
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-password">
              Temporary Password
            </Label>

            <div className="relative">
              <Input
                id="student-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Minimum 8 characters"
                value={formData.password}
                disabled={mutation.isPending}
                className="pr-11"
                onChange={(event) =>
                  updateField(
                    "password",
                    event.target.value,
                  )
                }
              />

              <button
                type="button"
                disabled={mutation.isPending}
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="mb-4 text-sm font-medium text-white">
              Academic Information
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admission-number">
                  Admission Number
                </Label>

                <Input
                  id="admission-number"
                  placeholder="STU-2026-002"
                  value={
                    formData.admissionNumber
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    updateField(
                      "admissionNumber",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roll-number">
                  Roll Number
                </Label>

                <Input
                  id="roll-number"
                  placeholder="02"
                  value={
                    formData.rollNumber
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    updateField(
                      "rollNumber",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class-name">
                  Class
                </Label>

                <Input
                  id="class-name"
                  placeholder="10"
                  value={
                    formData.className
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    updateField(
                      "className",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">
                  Section
                </Label>

                <Input
                  id="section"
                  placeholder="A"
                  value={formData.section}
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    updateField(
                      "section",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="date-of-birth">
                  Date of Birth
                </Label>

                <Input
                  id="date-of-birth"
                  type="date"
                  value={
                    formData.dateOfBirth
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    updateField(
                      "dateOfBirth",
                      event.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="mb-4 text-sm font-medium text-white">
              Parent Information
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="parent-name">
                  Parent Name
                </Label>

                <Input
                  id="parent-name"
                  placeholder="Parent full name"
                  value={
                    formData.parentName
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    updateField(
                      "parentName",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent-phone">
                  Parent Phone
                </Label>

                <Input
                  id="parent-phone"
                  type="tel"
                  placeholder="9876543210"
                  value={
                    formData.parentPhone
                  }
                  disabled={
                    mutation.isPending
                  }
                  onChange={(event) =>
                    updateField(
                      "parentPhone",
                      event.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Student
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
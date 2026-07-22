"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  Plus,
  UserPlus,
} from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  teacherService,
  type CreateTeacherPayload,
} from "@/services/teacher.service";


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
        "Unable to create teacher."
      );
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Unable to create teacher. Please try again.";
}

export function AddTeacherDialog(): React.JSX.Element {
  const queryClient = useQueryClient();

  const [open, setOpen] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState<CreateTeacherPayload>({
      name: "",
      email: "",
      password: "",
    });

  const mutation = useMutation({
    mutationFn: (
      payload: CreateTeacherPayload,
    ) => teacherService.create(payload),

    onSuccess: async (teacher) => {
      await queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      toast.success(
        `${teacher.name} was added successfully.`,
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setShowPassword(false);
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

    const name = formData.name.trim();
    const email =
      formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name) {
      toast.error(
        "Teacher name is required.",
      );
      return;
    }

    if (!email) {
      toast.error(
        "Teacher email is required.",
      );
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    mutation.mutate({
      name,
      email,
      password,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!mutation.isPending) {
          setOpen(value);
        }
      }}
    >
      <DialogTrigger
        render={
            <Button type="button" />
        }
        >
        <Plus className="mr-2 h-4 w-4" />
        Add Teacher
        </DialogTrigger>

      <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-[520px]">
        <DialogHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
            <UserPlus className="h-5 w-5 text-emerald-400" />
          </div>

          <DialogTitle className="text-xl">
            Add New Teacher
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Create a teacher account. The teacher
            will be able to sign in using these
            credentials.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="teacher-name">
              Full Name
            </Label>

            <Input
              id="teacher-name"
              value={formData.name}
              disabled={mutation.isPending}
              placeholder="Enter teacher name"
              autoComplete="name"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-email">
              Email Address
            </Label>

            <Input
              id="teacher-email"
              type="email"
              value={formData.email}
              disabled={mutation.isPending}
              placeholder="teacher@schoolerp.com"
              autoComplete="email"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-password">
              Temporary Password
            </Label>

            <div className="relative">
              <Input
                id="teacher-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={formData.password}
                disabled={mutation.isPending}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className="pr-11"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    password:
                      event.target.value,
                  }))
                }
              />

              <button
                type="button"
                disabled={mutation.isPending}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              The teacher can use this password
              to sign in to their account.
            </p>
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
                  Create Teacher
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
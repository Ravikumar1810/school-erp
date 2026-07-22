"use client";

import {
  useState,
} from "react";

import {
  KeyRound,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  profileService,
} from "@/services/profile.service";

export function ChangePasswordDialog() {
  const [open, setOpen] =
    useState(false);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      newPassword.length < 8
    ) {
      toast.error(
        "New password must contain at least 8 characters.",
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      toast.error(
        "New password and confirmation password do not match.",
      );

      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      toast.error(
        "New password must be different from your current password.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await profileService.changePassword(
          {
            currentPassword,
            newPassword,
          },
        );

      toast.success(
        response.message ||
          "Password changed successfully.",
      );

      resetForm();
      setOpen(false);
    } catch (error) {
      console.error(
        "Failed to change password:",
        error,
      );

      toast.error(
        "Unable to change password. Please check your current password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        className="group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-all outline-none hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
        <KeyRound className="size-4" />
        Change Password
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Change Password
          </DialogTitle>

          <DialogDescription>
            Enter your current
            password and choose a
            secure new password.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 pt-2"
        >
          <div className="space-y-2">
            <Label htmlFor="current-password">
              Current Password
            </Label>

            <Input
              id="current-password"
              type="password"
              value={
                currentPassword
              }
              onChange={(event) =>
                setCurrentPassword(
                  event.target
                    .value,
                )
              }
              autoComplete="current-password"
              disabled={
                isSubmitting
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">
              New Password
            </Label>

            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target
                    .value,
                )
              }
              autoComplete="new-password"
              disabled={
                isSubmitting
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              Confirm New Password
            </Label>

            <Input
              id="confirm-password"
              type="password"
              value={
                confirmPassword
              }
              onChange={(event) =>
                setConfirmPassword(
                  event.target
                    .value,
                )
              }
              autoComplete="new-password"
              disabled={
                isSubmitting
              }
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
              disabled={
                isSubmitting
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "Updating..."
                : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
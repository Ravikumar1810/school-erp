"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Pencil,
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
  type Profile,
} from "@/services/profile.service";

interface EditProfileDialogProps {
  profile: Profile;
  onProfileUpdated: (
    profile: Profile,
  ) => void;
}

export function EditProfileDialog({
  profile,
  onProfileUpdated,
}: EditProfileDialogProps) {
  const [open, setOpen] =
    useState(false);

  const [name, setName] =
    useState(profile.name);

  const [avatar, setAvatar] =
    useState(
      profile.avatar ?? "",
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (open) {
      setName(profile.name);
      setAvatar(
        profile.avatar ?? "",
      );
    }
  }, [
    open,
    profile.name,
    profile.avatar,
  ]);

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error(
        "Name must contain at least 2 characters.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const updatedProfile =
        await profileService.updateMyProfile(
          {
            name: name.trim(),
            ...(avatar.trim()
              ? {
                  avatar:
                    avatar.trim(),
                }
              : {}),
          },
        );

      onProfileUpdated(
        updatedProfile,
      );

      toast.success(
        "Profile updated successfully.",
      );

      setOpen(false);
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error,
      );

      toast.error(
        "Unable to update profile. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        className="group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
        <Pencil className="size-4" />
        Edit Profile
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Profile
          </DialogTitle>

          <DialogDescription>
            Update your personal
            profile information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 pt-2"
        >
          <div className="space-y-2">
            <Label htmlFor="profile-name">
              Full Name
            </Label>

            <Input
              id="profile-name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="Enter your full name"
              disabled={
                isSubmitting
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-avatar">
              Avatar URL
            </Label>

            <Input
              id="profile-avatar"
              type="url"
              value={avatar}
              onChange={(event) =>
                setAvatar(
                  event.target.value,
                )
              }
              placeholder="https://example.com/avatar.jpg"
              disabled={
                isSubmitting
              }
            />

            <p className="text-xs text-muted-foreground">
              Optional. Enter a
              valid image URL.
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Email Address
            </Label>

            <Input
              value={profile.email}
              disabled
            />

            <p className="text-xs text-muted-foreground">
              Email cannot be
              changed from your
              profile.
            </p>
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
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
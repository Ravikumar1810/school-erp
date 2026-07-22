"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ShieldCheck,
} from "lucide-react";

import {
  ProfileCard,
} from "@/components/dashboard/profile/ProfileCard";

import {
  EditProfileDialog,
} from "@/components/dashboard/profile/EditProfileDialog";

import {
  ChangePasswordDialog,
} from "@/components/dashboard/profile/ChangePasswordDialog";

import {
  profileService,
  type Profile,
} from "@/services/profile.service";

export default function SuperAdminProfilePage() {
  const [
    profile,
    setProfile,
  ] = useState<Profile | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const data =
            await profileService.getMyProfile();

          setProfile(data);
        } catch (error) {
          console.error(
            "Failed to load profile:",
            error,
          );
        } finally {
          setIsLoading(false);
        }
      };

    void loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Unable to load your
          profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <ShieldCheck className="size-3.5" />
            Principal Account
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            My Profile
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your principal
            account and security
            settings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <EditProfileDialog
            profile={profile}
            onProfileUpdated={
              setProfile
            }
          />

          <ChangePasswordDialog />
        </div>
      </section>

      <ProfileCard
        profile={profile}
      />
    </div>
  );
}
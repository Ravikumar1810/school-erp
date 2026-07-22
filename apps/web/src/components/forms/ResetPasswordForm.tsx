"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  TriangleAlert,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  toast,
} from "sonner";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/schemas/reset-password.schema";

import {
  authService,
} from "@/services/auth.service";

export function ResetPasswordForm():
  React.JSX.Element {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get(
      "token",
    );

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<ResetPasswordSchema>({
      resolver:
        zodResolver(
          resetPasswordSchema,
        ),

      defaultValues: {
        password: "",
        confirmPassword:
          "",
      },
    });

  const onSubmit = async (
    values:
      ResetPasswordSchema,
  ): Promise<void> => {
    if (!token) {
      toast.error(
        "Invalid password reset link.",
      );

      return;
    }

    try {
      setIsLoading(true);

      const response =
        await authService
          .resetPassword({
            token,

            newPassword:
              values.password,
          });

      
      authService.clearTokens();

      toast.success(
        response.message,
      );

      router.replace(
        "/login",
      );
    } catch (error: unknown) {
      let message =
        "Unable to reset password. The link may be invalid or expired.";

      if (
        typeof error ===
          "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError =
          error as {
            response?: {
              data?: {
                message?:
                  | string
                  | string[];
              };
            };
          };

        const apiMessage =
          axiosError.response
            ?.data?.message;

        if (
          Array.isArray(
            apiMessage,
          )
        ) {
          message =
            apiMessage.join(
              " ",
            );
        } else if (
          typeof apiMessage ===
          "string"
        ) {
          message =
            apiMessage;
        }
      }

      toast.error(
        message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-6 text-center sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
            <TriangleAlert className="h-7 w-7 text-amber-400" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Invalid Reset Link
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            This password reset link
            is missing the required
            security token.
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 inline-flex items-center justify-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />

            Request a New Link
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-7">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <LockKeyhole className="h-7 w-7 text-emerald-400" />
          </div>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Reset Password
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Create a secure new
            password for your School
            ERP account.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit(
              onSubmit,
            )
          }
          className="space-y-5"
          noValidate
        >
          {/* New Password */}

          <div className="space-y-2">
            <Label htmlFor="password">
              New Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Enter new password"
                disabled={
                  isLoading
                }
                aria-invalid={
                  Boolean(
                    errors.password,
                  )
                }
                className="pr-11"
                {...register(
                  "password",
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current,
                  )
                }
                disabled={
                  isLoading
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>

            {errors.password && (
              <p
                role="alert"
                className="text-sm text-red-400"
              >
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Confirm new password"
                disabled={
                  isLoading
                }
                aria-invalid={
                  Boolean(
                    errors.confirmPassword,
                  )
                }
                className="pr-11"
                {...register(
                  "confirmPassword",
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current,
                  )
                }
                disabled={
                  isLoading
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p
                role="alert"
                className="text-sm text-red-400"
              >
                {
                  errors.confirmPassword
                    .message
                }
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                Updating Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Login
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
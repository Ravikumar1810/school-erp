"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";

import {
  loginSchema,
  type LoginSchema,
} from "@/schemas/login.schema";

import { authService } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


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

    const message =
      response?.data?.message;

    if (Array.isArray(message)) {
      return message[0] ??
        "Unable to sign in.";
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Unable to sign in. Please check your credentials.";
}

export function LoginForm(): React.JSX.Element {
  const [showPassword, setShowPassword] =
    useState(false);

  const { redirectByRole } = useAuth();

    const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema as any),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: LoginSchema,
  ): Promise<void> => {
    try {
      const response =
        await authService.login(values);

      toast.success(
        `Welcome back, ${response.user.name}.`,
      );

      redirectByRole(
        response.user.role,
      );
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error),
      );
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Sign in to your account
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enter your registered credentials
            to access your School ERP
            dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address
            </Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="principal@schoolerp.com"
              disabled={isSubmitting}
              aria-invalid={
                Boolean(errors.email)
              }
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="password">
                Password
              </Label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                disabled={isSubmitting}
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
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current,
                  )
                }
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-400">
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
          <p className="text-center text-xs leading-5 text-slate-400">
            Secure access for Principals,
            Teachers, Students and Parents.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
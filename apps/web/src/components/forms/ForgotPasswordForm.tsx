"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
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
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/schemas/forgot-password.schema";

import {
  authService,
} from "@/services/auth.service";

export function ForgotPasswordForm():
  React.JSX.Element {
  const [isLoading, setIsLoading] =
    useState(false);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } =
    useForm<ForgotPasswordSchema>({
      resolver:
        zodResolver(
          forgotPasswordSchema,
        ),

      defaultValues: {
        email: "",
      },
    });

  const onSubmit = async (
    values: ForgotPasswordSchema,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const response =
        await authService
          .forgotPassword({
            email:
              values.email,
          });

      setIsSubmitted(true);

      reset();

      toast.success(
        response.message,
      );
    } catch {
      toast.error(
        "Unable to process your password reset request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-6 sm:p-8">
        {isSubmitted ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
              Check Your Email
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              If an account exists for the email
              address you entered, password reset
              instructions have been sent.
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              The password reset link will expire
              after 15 minutes.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-6 w-full"
              onClick={() =>
                setIsSubmitted(
                  false,
                )
              }
            >
              Try Another Email
            </Button>

            <Link
              href="/login"
              className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <Mail className="h-7 w-7 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Forgot Password
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter your registered email
                address and we&apos;ll send you
                password reset instructions.
              </p>
            </div>

            <form
              onSubmit={
                handleSubmit(
                  onSubmit,
                )
              }
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
                  placeholder="you@example.com"
                  disabled={
                    isLoading
                  }
                  aria-invalid={
                    Boolean(
                      errors.email,
                    )
                  }
                  {...register(
                    "email",
                  )}
                />

                {errors.email && (
                  <p
                    role="alert"
                    className="text-sm text-red-400"
                  >
                    {
                      errors.email
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

                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
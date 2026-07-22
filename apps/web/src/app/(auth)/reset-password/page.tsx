import type { Metadata } from "next";
import { Suspense } from "react";

import { Loader2 } from "lucide-react";

import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Create a new password for your School ERP account.",
};

function ResetPasswordFallback(): React.JSX.Element {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        </div>

        <p className="text-sm text-slate-400">
          Loading reset password form...
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage(): React.JSX.Element {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
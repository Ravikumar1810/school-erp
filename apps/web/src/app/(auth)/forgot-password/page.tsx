import type { Metadata } from "next";

import {
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your School ERP account password.",
};

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Recovery",
    description:
      "Reset your password securely using your registered email.",
  },
  {
    icon: Mail,
    title: "Email Verification",
    description:
      "A password reset link will be sent instantly to your inbox.",
  },
  {
    icon: GraduationCap,
    title: "Continue Learning",
    description:
      "Recover access to your School ERP account in just a few steps.",
  },
  {
    icon: LockKeyhole,
    title: "Protected Access",
    description:
      "Your account remains protected with secure verification.",
  },
];

export default function ForgotPasswordPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <Logo />

              <div className="mt-8">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Forgot Password
                </h1>

                <p className="mt-3 text-slate-400">
                  Don't worry. We'll help you recover your
                  account securely.
                </p>
              </div>
            </div>

            <ForgotPasswordForm />
          </div>
        </section>

        {/* Right Side */}

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950 lg:flex">
          <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-center px-16">
            <span className="inline-flex w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Password Recovery
            </span>

            <h2 className="mt-8 text-5xl font-bold leading-tight text-white">
              Recover Your
              <br />
              School ERP
              <br />
              Account.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
              We use secure verification to ensure only you can
              regain access to your School ERP account.
            </p>

            <div className="mt-14 grid gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
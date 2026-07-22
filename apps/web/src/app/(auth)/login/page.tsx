import type { Metadata } from "next";

import {
  BarChart3,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Login | School ERP",
  description:
    "Securely login to the School ERP platform.",
};

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "JWT authentication with role-based access control.",
  },
  {
    icon: Users,
    title: "Role Based Dashboard",
    description:
      "Dedicated dashboards for Principal, Teacher and Student.",
  },
  {
    icon: GraduationCap,
    title: "Academic Management",
    description:
      "Manage attendance, marks and student records.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Real-time academic performance and attendance insights.",
  },
];

export default function LoginPage(): React.JSX.Element {
  return (
    <main className="min-h-[100dvh] bg-slate-950 lg:h-[100dvh] lg:overflow-hidden">
      <div className="grid min-h-[100dvh] lg:h-full lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Left Side */}
        <section className="flex min-h-[100dvh] items-center justify-center px-5 py-8 sm:px-6 lg:min-h-0 lg:h-full lg:px-8 lg:py-6 xl:px-12">
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="mb-6 lg:mb-7">
              <Logo />

              <div className="mt-6">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Welcome Back
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                  Login to continue managing your school
                  efficiently.
                </p>
              </div>
            </div>

            {/* Login Form */}
            <LoginForm />
          </div>
        </section>

        {/* Right Side */}
        <section className="relative hidden h-full overflow-hidden border-l border-white/5 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950 lg:flex">
          {/* Background Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_35%)]"
          />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full items-center">
            <div className="w-full px-10 py-6 xl:px-14 2xl:px-20">
              {/* Badge */}
              <span className="inline-flex w-fit items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 xl:text-sm">
                School ERP Platform
              </span>

              {/* Heading */}
              <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-5xl">
                Modern School
                <br />
                Management
                <br />
                Simplified.
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400 xl:text-base xl:leading-7">
                A secure ERP platform for Principals, Teachers,
                Students and Parents with modern dashboards,
                attendance management, marks, analytics and
                complete academic workflows.
              </p>

              {/* Features */}
              <div className="mt-7 grid grid-cols-2 gap-3 xl:mt-8 xl:gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-sm transition-colors duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] xl:p-5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/10 bg-emerald-500/10 xl:h-11 xl:w-11">
                        <Icon className="h-5 w-5 text-emerald-400" />
                      </div>

                      <h3 className="mt-3 text-sm font-semibold text-white xl:text-base">
                        {feature.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-400 xl:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
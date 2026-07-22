"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

import { Container } from "@/components/common/Container";
import { GradientText } from "@/components/common/GradientText";
import { Button } from "@/components/ui/button";

export function CTASection(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Background */}

      <div className="absolute inset-0 gradient-background" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-16 backdrop-blur-xl md:px-16">
            {/* Glow */}

            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
                School ERP Platform
              </span>

              <h2 className="mt-8 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Ready To Transform
                <br />

                <GradientText>
                  Your School Management?
                </GradientText>
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
                Empower principals, teachers, students and parents
                with one secure ERP platform designed for modern
                educational institutions.
              </p>

              <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 px-8"
                >
                  <Link href="/login">
                    Get Started

                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-border bg-transparent px-8"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />

                  Watch Demo
                </Button>
              </div>

              <div className="mt-14 grid gap-8 md:grid-cols-3">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    100+
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Schools Supported
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white">
                    50K+
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Student Records
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white">
                    99.9%
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Secure & Reliable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
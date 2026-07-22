"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

import { Container } from "@/components/common/Container";
import { GradientText } from "@/components/common/GradientText";
import { SectionBadge } from "@/components/common/SectionBadge";
import { HeroDashboard } from "@/components/landing/HeroDashboard";
import { Button } from "@/components/ui/button";

export function HeroSection(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
      {/* Background Glow */}

      <div className="absolute inset-0 -z-20 gradient-background" />

      {/* Grid */}

      <div className="absolute inset-0 -z-10 grid-background opacity-40" />

      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col"
          >
            <SectionBadge>
               Modern School ERP Platform
            </SectionBadge>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              Smart School
              <br />

              <GradientText>
                Management
              </GradientText>

              <br />

              Platform
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
              Streamline attendance, marks, teachers,
              students, classes, and academic workflows with
              one secure, modern ERP platform built for
              principals, teachers, students, and parents.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-8 text-base"
              >
                <Link href="/login">
                  Get Started

                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 border-border bg-transparent px-8 text-base"
              >
                <PlayCircle className="mr-2 h-5 w-5" />

                Live Demo
              </Button>
            </div>

            {/* Stats */}

            <div className="mt-14 grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  1.2K+
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Students
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">
                  75+
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Teachers
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">
                  99%
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Attendance
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right */}

          <HeroDashboard />
        </div>
      </Container>
    </section>
  );
}
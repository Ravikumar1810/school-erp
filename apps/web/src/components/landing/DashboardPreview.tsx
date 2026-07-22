"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/common/Container";
import { GradientText } from "@/components/common/GradientText";
import { SectionBadge } from "@/components/common/SectionBadge";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import { Button } from "@/components/ui/button";

const features = [
  "Role-based dashboards for Principal, Teacher & Student",
  "Real-time attendance and marks management",
  "Interactive analytics with academic insights",
  "Modern, responsive and secure ERP platform",
];

export function DashboardPreview(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden py-28">
      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left Content */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionBadge>
              Product Showcase
            </SectionBadge>

            <SectionHeading
              align="left"
              className="mt-6"
              title={
                <>
                  Experience the Future of
                  <br />
                  <GradientText>
                    School Administration
                  </GradientText>
                </>
              }
              description="Manage students, teachers, attendance, marks and academic performance through one beautifully designed ERP dashboard."
            />

            <div className="mt-10 space-y-5">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-4"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />

                  <p className="text-slate-300">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button
                size="lg"
                className="h-12 px-8"
              >
                <Link href="/login">
                  Explore Dashboard

                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Dashboard */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
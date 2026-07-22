"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarCheck2,
  ChartColumn,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { GradientText } from "@/components/common/GradientText";
import { SectionBadge } from "@/components/common/SectionBadge";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Role Based Access",
    description:
      "Secure authentication for Principal, Teachers, Students and Parents with protected dashboards.",
    icon: ShieldCheck,
  },
  {
    title: "Attendance Management",
    description:
      "Track attendance in real time with instant updates for students and parents.",
    icon: CalendarCheck2,
  },
  {
    title: "Marks & Performance",
    description:
      "Manage examinations, marks, report cards and academic performance effortlessly.",
    icon: ChartColumn,
  },
  {
    title: "Student Management",
    description:
      "Manage student records, profiles, classes and academic history from one place.",
    icon: GraduationCap,
  },
  {
    title: "Teacher Management",
    description:
      "Assign teachers, manage responsibilities and monitor daily activities efficiently.",
    icon: Users,
  },
  {
    title: "Subjects & Classes",
    description:
      "Organize classes, subjects and academic workflows with an intuitive interface.",
    icon: BookOpen,
  },
];

export function FeaturesSection(): React.JSX.Element {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-28"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex flex-col items-center"
        >
          <SectionBadge>
            Powerful Features
          </SectionBadge>

          <SectionHeading
            className="mt-6"
            title={
              <>
                Everything You Need To Manage
                <br />
                <GradientText>
                  Your School Efficiently
                </GradientText>
              </>
            }
            description="School ERP provides every essential module required for principals, teachers, students and parents in one secure platform."
          />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
              >
                <Card className="group h-full border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/30 hover:bg-white/10">
                  <CardContent className="p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 transition-colors duration-300 group-hover:bg-emerald-500">
                      <Icon className="h-7 w-7 text-emerald-400 group-hover:text-white" />
                    </div>

                    <h3 className="mt-8 text-2xl font-semibold text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
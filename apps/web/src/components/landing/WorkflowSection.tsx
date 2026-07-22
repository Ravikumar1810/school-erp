"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  GraduationCap,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { GradientText } from "@/components/common/GradientText";
import { SectionBadge } from "@/components/common/SectionBadge";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

const workflow = [
  {
    title: "Principal",
    description:
      "Manage teachers, students, classes and monitor the entire institution.",
    icon: ShieldCheck,
    color: "text-emerald-400",
    background: "bg-emerald-500/10",
  },
  {
    title: "Teachers",
    description:
      "Update attendance, marks and monitor academic progress daily.",
    icon: School,
    color: "text-blue-400",
    background: "bg-blue-500/10",
  },
  {
    title: "Students",
    description:
      "View attendance, marks, assignments and academic performance.",
    icon: GraduationCap,
    color: "text-orange-400",
    background: "bg-orange-500/10",
  },
  {
    title: "Parents",
    description:
      "Track attendance and monitor student progress in real time.",
    icon: Users,
    color: "text-purple-400",
    background: "bg-purple-500/10",
  },
];

export function WorkflowSection(): React.JSX.Element {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden py-28"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <SectionBadge>
            Workflow
          </SectionBadge>

          <SectionHeading
            className="mt-6"
            title={
              <>
                One Platform.
                <br />
                <GradientText>
                  Connected For Everyone.
                </GradientText>
              </>
            }
            description="Every user has their own dedicated dashboard with secure role-based permissions, ensuring efficient collaboration across the entire school."
          />
        </motion.div>

        <div className="mx-auto flex max-w-5xl flex-col items-center">
          {workflow.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="w-full"
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10">
                  <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.background}`}
                    >
                      <Icon
                        className={`h-8 w-8 ${item.color}`}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {index !== workflow.length - 1 && (
                  <div className="flex justify-center py-5">
                    <ArrowDown className="h-7 w-7 text-emerald-400" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const students = [
  {
    name: "Rahul Sharma",
    grade: "Grade 10",
    attendance: "98%",
  },
  {
    name: "Priya Patel",
    grade: "Grade 9",
    attendance: "96%",
  },
  {
    name: "Aarav Singh",
    grade: "Grade 8",
    attendance: "94%",
  },
];

export function DashboardMockup(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      {/* Background Glow */}

      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />

      <Card className="overflow-hidden rounded-3xl border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[90px_1fr]">
            {/* Sidebar */}

            <div className="hidden flex-col items-center gap-8 border-r border-white/10 bg-slate-900/80 py-8 md:flex">
              <div className="rounded-2xl bg-emerald-500 p-3">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>

              <LayoutDashboard className="h-6 w-6 text-emerald-400" />
              <Users className="h-6 w-6 text-slate-400" />
              <BookOpen className="h-6 w-6 text-slate-400" />
              <CalendarDays className="h-6 w-6 text-slate-400" />

              <div className="flex-1" />

              <Settings className="mb-6 h-6 w-6 text-slate-400" />
            </div>

            {/* Main */}

            <div className="p-6">
              {/* Header */}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Dashboard Overview
                  </h3>

                  <p className="text-sm text-slate-400">
                    Welcome back, Principal 👋
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Bell className="h-5 w-5 text-slate-400" />

                  <Avatar>
                    <AvatarFallback className="bg-emerald-500 text-white">
                      RK
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* KPI Cards */}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Card className="border-white/10 bg-slate-900/60">
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-400">
                      Students
                    </p>

                    <h4 className="mt-2 text-3xl font-bold text-white">
                      1,248
                    </h4>

                    <Badge className="mt-3 bg-emerald-500">
                      +12%
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/60">
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-400">
                      Teachers
                    </p>

                    <h4 className="mt-2 text-3xl font-bold text-white">
                      78
                    </h4>

                    <Badge className="mt-3 bg-blue-500">
                      Active
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/60">
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-400">
                      Attendance
                    </p>

                    <h4 className="mt-2 text-3xl font-bold text-white">
                      96%
                    </h4>

                    <Badge className="mt-3 bg-orange-500">
                      Today
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance */}

              <Card className="mt-6 border-white/10 bg-slate-900/60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">
                      Overall Attendance
                    </h4>

                    <span className="text-sm text-emerald-400">
                      96%
                    </span>
                  </div>

                  <Progress
                    value={96}
                    className="mt-5 h-3"
                  />
                </CardContent>
              </Card>

              {/* Student Table */}

              <Card className="mt-6 border-white/10 bg-slate-900/60">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h4 className="font-semibold text-white">
                      Recent Students
                    </h4>

                    <span className="text-sm text-emerald-400">
                      View All
                    </span>
                  </div>

                  <div className="space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.name}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-800/50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-emerald-500 text-white">
                              {student.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium text-white">
                              {student.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {student.grade}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/20 text-emerald-400"
                        >
                          {student.attendance}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
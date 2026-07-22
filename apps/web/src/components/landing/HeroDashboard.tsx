"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const attendance = [
  {
    day: "Mon",
    value: 92,
  },
  {
    day: "Tue",
    value: 84,
  },
  {
    day: "Wed",
    value: 96,
  },
  {
    day: "Thu",
    value: 88,
  },
  {
    day: "Fri",
    value: 98,
  },
];

export function HeroDashboard(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto w-full max-w-xl"
    >
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />

      <Card className="overflow-hidden border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          {/* Header */}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">
                School Dashboard
              </p>

              <p className="text-sm text-slate-400">
                Academic Overview
              </p>
            </div>

            <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">
              Live
            </Badge>
          </div>

          {/* Top Stats */}

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-white/10 bg-slate-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <Users className="h-9 w-9 rounded-lg bg-emerald-500/20 p-2 text-emerald-400" />

                <div>
                  <p className="text-2xl font-bold text-white">
                    1,248
                  </p>

                  <p className="text-xs text-slate-400">
                    Students
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <GraduationCap className="h-9 w-9 rounded-lg bg-blue-500/20 p-2 text-blue-400" />

                <div>
                  <p className="text-2xl font-bold text-white">
                    78
                  </p>

                  <p className="text-xs text-slate-400">
                    Teachers
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance */}

          <Card className="border-white/10 bg-slate-900/60">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-400" />

                  <span className="font-medium text-white">
                    Attendance
                  </span>
                </div>

                <span className="text-sm text-emerald-400">
                  91%
                </span>
              </div>

              <div className="flex items-end justify-between gap-2">
                {attendance.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-emerald-500 to-emerald-300"
                      style={{
                        height: `${item.value}px`,
                      }}
                    />

                    <span className="text-xs text-slate-500">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Cards */}

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-white/10 bg-slate-900/60">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Average Marks
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    89.4%
                  </p>
                </div>

                <TrendingUp className="h-8 w-8 text-emerald-400" />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/60">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Subjects
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    24
                  </p>
                </div>

                <BookOpen className="h-8 w-8 text-orange-400" />
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}

          <Card className="border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-300">
                  Academic Performance
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white">
                  +18%
                </h3>

                <p className="text-xs text-emerald-400">
                  Improved this semester
                </p>
              </div>

              <BarChart3 className="h-12 w-12 text-emerald-400" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </motion.div>
  );
}
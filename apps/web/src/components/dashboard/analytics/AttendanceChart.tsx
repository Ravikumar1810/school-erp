"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AttendanceTrendItem,
} from "@/services/analytics.service";

interface AttendanceChartProps {
  data: AttendanceTrendItem[];
}

export function AttendanceChart({
  data,
}: AttendanceChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState message="No attendance trend data available yet." />
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.15}
          />

          <XAxis
            dataKey="date"
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis
            allowDecimals={
              false
            }
            tick={{
              fontSize: 12,
            }}
          />

          <Tooltip
            contentStyle={{
              borderRadius:
                "12px",

              background:
                "var(--card)",

              border:
                "1px solid var(--border)",
            }}
          />

          <Bar
            dataKey="present"
            name="Present"
            fill="#10b981"
            radius={[
              4,
              4,
              0,
              0,
            ]}
          />

          <Bar
            dataKey="absent"
            name="Absent"
            fill="#ef4444"
            radius={[
              4,
              4,
              0,
              0,
            ]}
          />

          <Bar
            dataKey="leave"
            name="Leave"
            fill="#f59e0b"
            radius={[
              4,
              4,
              0,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed">
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
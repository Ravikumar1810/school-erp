
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
  SubjectPerformanceItem,
} from "@/services/analytics.service";

interface PerformanceChartProps {
  data:
    SubjectPerformanceItem[];
}

export function PerformanceChart({
  data,
}: PerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">
          No subject
          performance data
          available yet.
        </p>
      </div>
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
            dataKey="subject"
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis
            domain={[
              0,
              100,
            ]}
            tick={{
              fontSize: 12,
            }}
          />

          <Tooltip
            formatter={(value) => [
                `${Number(value)}%`,
                "Average",
            ]}
            contentStyle={{
                borderRadius: "12px",
                background: "var(--card)",
            }}
            />

          <Bar
            dataKey="average"
            name="Average"
            fill="#10b981"
            radius={[
              6,
              6,
              0,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
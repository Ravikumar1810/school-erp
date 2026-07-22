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
  ClassPerformanceItem,
} from "@/services/analytics.service";

interface ClassPerformanceChartProps {
  data:
    ClassPerformanceItem[];
}

export function ClassPerformanceChart({
  data,
}: ClassPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">
          No class performance
          data available yet.
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
          layout="vertical"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            opacity={0.15}
          />

          <XAxis
            type="number"
            domain={[
              0,
              100,
            ]}
          />

          <YAxis
            type="category"
            dataKey="className"
            width={80}
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value)}%`,
              "Average",
            ]}
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
            dataKey="average"
            name="Average"
            fill="#10b981"
            radius={[
              0,
              6,
              6,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
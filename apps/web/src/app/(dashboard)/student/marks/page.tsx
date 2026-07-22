"use client";

import {
  Award,
  BookOpen,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { MarksTable } from "@/components/dashboard/marks/MarksTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { markService } from "@/services/mark.service";

export default function StudentMarksPage(): React.JSX.Element {
  const {
    data: records = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "marks",
      "me",
    ],
    queryFn: () =>
      markService.getMyMarks(),
  });

  const average =
    records.length > 0
      ? Math.round(
          records.reduce(
            (total, record) =>
              total +
              record.percentage,
            0,
          ) / records.length,
        )
      : 0;

  const highest =
    records.length > 0
      ? Math.max(
          ...records.map(
            (record) =>
              record.percentage,
          ),
        )
      : 0;

  const lowest =
    records.length > 0
      ? Math.min(
          ...records.map(
            (record) =>
              record.percentage,
          ),
        )
      : 0;

  const subjects =
    new Set(
      records.map(
        (record) =>
          record.subject,
      ),
    ).size;

  const stats = [
    {
      label:
        "Overall Average",
      value: `${average}%`,
      icon: Award,
    },
    {
      label: "Subjects",
      value: subjects,
      icon: BookOpen,
    },
    {
      label:
        "Highest Score",
      value: `${highest}%`,
      icon: TrendingUp,
    },
    {
      label:
        "Lowest Score",
      value: `${lowest}%`,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <Badge
          variant="outline"
          className="mb-3 border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
        >
          My Performance
        </Badge>

        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Academic Results
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Track your examination
          results and academic
          performance.
        </p>
      </section>

      {!isLoading &&
        !isError && (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(
              ({
                label,
                value,
                icon: Icon,
              }) => (
                <Card
                  key={label}
                  className="border-white/10 bg-white/[0.03]"
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        {label}
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        {value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </section>
        )}

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-lg text-white">
            My Results
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
          ) : isError ? (
            <div className="flex min-h-80 flex-col items-center justify-center">
              <p className="text-white">
                Unable to load your
                results.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  void refetch();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <MarksTable
              records={records}
              showStudent={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
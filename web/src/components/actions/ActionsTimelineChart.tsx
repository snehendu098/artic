"use client";

import CardLayout from "@/components/layouts/card-layout";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Actions",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const ActionsTimelineChartSkeleton = () => (
  <CardLayout>
    <div>
      <p className="text-xs text-white/50">// activity timeline</p>
      <p className="uppercase">Actions Over Time</p>
    </div>
    <div className="h-[200px] w-full bg-neutral-800 animate-pulse mt-4" />
  </CardLayout>
);

const ActionsTimelineChart = () => {
  const { data, loading } = useDashboardData();
  const { actions } = data;
  const isLoading = loading.actions;

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: 0,
      };
    });

    if (!actions || actions.length === 0) return last7Days;

    actions.forEach((action) => {
      const actionDate = new Date(action.timestamp).toISOString().split("T")[0];
      const dayEntry = last7Days.find((d) => d.date === actionDate);
      if (dayEntry) {
        dayEntry.count++;
      }
    });

    return last7Days;
  }, [actions]);

  if (isLoading) return <ActionsTimelineChartSkeleton />;

  const hasData = chartData.some((d) => d.count > 0);

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">// activity timeline</p>
        <p className="uppercase">Actions Over Time</p>
      </div>
      {hasData ? (
        <ChartContainer config={chartConfig} className="h-[200px] w-full mt-4">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid
              vertical={false}
              stroke="hsl(var(--neutral-700))"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center h-[200px]">
          <p className="text-sm text-white/40">No activity yet</p>
          <p className="text-xs text-white/30 mt-1">
            Actions will appear here as a timeline
          </p>
        </div>
      )}
    </CardLayout>
  );
};

export default ActionsTimelineChart;

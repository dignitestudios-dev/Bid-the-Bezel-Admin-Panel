"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { useGetDashboardAnalytics } from "@/app/feature/dashboard/hooks";

const chartConfig = {
  sold: {
    label: "Sold",
    color: "var(--chart-1)",
  },

  active: {
    label: "Active",
    color: "var(--chart-2)",
  },

  conversionRate: {
    label: "Conversion %",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartBarMultiple() {
  const { data } = useGetDashboardAnalytics();

  const chartData =
    data?.data?.marketplace?.conversionByType?.map((item: any) => ({
      type: item.type.replaceAll("_", " "),
      sold: item.sold,
      active: item.active,
      conversionRate: item.conversionRate,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Conversion Analytics</CardTitle>

        <CardDescription>Sold vs Active Products by Type</CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <YAxis tickLine={false} axisLine={false} />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />

              <Bar dataKey="sold" radius={4} />

              <Bar dataKey="active" radius={4} />

              <Bar dataKey="conversionRate" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-80 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            No  data available
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Conversion performance overview
          <TrendingUp className="h-4 w-4" />
        </div>

        <div className="text-muted-foreground leading-none">
          Auction, Marketplace Price & Taking Offers insights
        </div>
      </CardFooter>
    </Card>
  );
}

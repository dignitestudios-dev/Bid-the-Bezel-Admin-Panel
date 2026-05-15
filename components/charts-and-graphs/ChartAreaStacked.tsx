"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaStacked() {
  const { data } = useGetDashboardAnalytics();

  const revenueData =
    data?.data?.marketplace?.revenueByProductType?.map((item: any) => ({
      type: item.type.replace("_", " "),
      revenue: item.revenue,
      orders: item.orders,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>

        <CardDescription>
          Revenue & Orders Overview By Product Type
        </CardDescription>
      </CardHeader>

      <CardContent>
        {revenueData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <AreaChart
              accessibilityLayer
              data={revenueData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="type"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <YAxis tickLine={false} axisLine={false} />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />

              <Area
                dataKey="orders"
                type="natural"
                stackId="a"
                fill="black"
                stroke="black"
              />

              <Area
                dataKey="revenue"
                type="natural"
                stackId="a"
                fill="black"
                stroke="black"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-80 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            No revenue data available
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium leading-none">
              Marketplace revenue insights
              <TrendingUp className="h-4 w-4" />
            </div>

            <div className="text-muted-foreground leading-none">
              Based on product type revenue & orders
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
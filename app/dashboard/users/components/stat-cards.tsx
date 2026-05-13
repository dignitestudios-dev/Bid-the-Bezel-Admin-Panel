import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CreditCard,
  UserCheck,
  Clock5,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatCards({ userStats }: any) {
  const performanceMetrics = [
    {
      title: "Total Users",
      current: userStats?.totalUsers || 0,
      icon: Users,
    },
    {
      title: "Paid Users",
      current: userStats?.paidUsers || 0,
      icon: CreditCard,
    },
    {
      title: "Active Users",
      current: userStats?.activeUsers || 0,
      icon: UserCheck,
    },
    {
      title: "Inacitve Users",
      current: userStats?.inactiveUsers || 0,
      icon: Clock5,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {performanceMetrics.map((metric, index) => (
        <Card key={index} className="border">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <metric.icon className="text-muted-foreground size-6" />
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {metric.title}
              </p>
              <div className="text-2xl font-bold">{metric.current}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

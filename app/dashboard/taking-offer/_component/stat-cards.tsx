import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle, Package } from "lucide-react";

export function StatCards({ takingStats }: any) {
  const performanceMetrics = [
    {
      title: "Active",
      current: takingStats?.active || 0,
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Sold",
      current: takingStats?.sold || 0,
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      title: "Total",
      current: takingStats?.total || 0,
      icon: Package,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

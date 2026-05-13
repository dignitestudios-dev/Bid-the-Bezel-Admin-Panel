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
        <Card
          key={index}
          className="border rounded-xl hover:shadow-sm transition"
        >
          <CardContent className=" flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{metric.title}</p>

              <p className="text-2xl font-bold">{metric.current}</p>
            </div>

            <metric.icon className={`size-6 ${metric.color}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

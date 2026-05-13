import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock5, CheckCircle2, XCircle } from "lucide-react";

export function StatCards({ userStats }: any) {
  const performanceMetrics = [
    {
      title: "Approved",
      current: userStats?.approved || 0,
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      current: userStats?.pending || 0,
      icon: Clock5,
    },
    {
      title: "Rejected",
      current: userStats?.rejected || 0,
      icon: XCircle,
    },
    {
      title: "Total",
      current: userStats?.total || 0,
      icon: Users,
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

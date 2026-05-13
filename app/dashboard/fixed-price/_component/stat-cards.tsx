import { Card, CardContent } from "@/components/ui/card";
import { Package, FileText, CheckCircle, Archive } from "lucide-react";

const performanceMetrics = (stats: any) => [
  {
    title: "Total",
    value: stats?.total || 0,
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Draft",
    value: stats?.draft || 0,
    icon: FileText,
    color: "text-yellow-500",
  },
  {
    title: "Active",
    value: stats?.active || 0,
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Sold",
    value: stats?.sold || 0,
    icon: Archive,
    color: "text-purple-600",
  },
];

export function StatCards({ fixedStats }: any) {

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {performanceMetrics(fixedStats).map((m, i) => (
        <Card key={i} className="border rounded-xl hover:shadow-sm transition">
          <CardContent className=" flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{m.title}</p>

              <p className="text-2xl font-bold">{m.value}</p>
            </div>

            <m.icon className={`size-6 ${m.color}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

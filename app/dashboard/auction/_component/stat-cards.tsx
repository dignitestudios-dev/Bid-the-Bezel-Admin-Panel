import { useGetAuctionStats } from "@/app/feature/auction/hooks";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  CheckCircle,
  Clock,
  Archive,
  XCircle,
  Activity,
} from "lucide-react";

const metrics = (stats: any) => [
  {
    title: "Total",
    value: stats?.total || 0,
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Sold",
    value: stats?.sold || 0,
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Reserved",
    value: stats?.reserved || 0,
    icon: Archive,
    color: "text-purple-600",
  },
  {
    title: "Live Auctions",
    value: stats?.liveAuction || 0,
    icon: Clock,
    color: "text-orange-500",
  },
  {
    title: "Failed Auctions",
    value: stats?.failedAuction || 0,
    icon: XCircle,
    color: "text-red-500",
  },
  {
    title: "Threshold",
    value: stats?.meetThreshold || 0,
    icon: Activity,
    color: "text-indigo-500",
  },
];

export function StatCards({ auctionStats }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-3">
      {metrics(auctionStats).map((m, i) => (
        <Card key={i} className="border">
          <CardContent >
            <div className="flex items-center justify-between">
              <m.icon className="text-muted-foreground size-6" />
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {m.title}
              </p>
              <div className="text-2xl font-bold">{m.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

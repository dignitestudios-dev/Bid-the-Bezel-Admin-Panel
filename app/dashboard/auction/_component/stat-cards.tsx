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
  // {
  //   title: "Live Auctions",
  //   value: stats?.liveAuction || 0,
  //   icon: Clock,
  //   color: "text-orange-500",
  // },
  // {
  //   title: "Failed Auctions",
  //   value: stats?.failedAuction || 0,
  //   icon: XCircle,
  //   color: "text-red-500",
  // },
  {
    title: "Threshold",
    value: stats?.meetThreshold || 0,
    icon: Activity,
    color: "text-indigo-500",
  },
];

export function StatCards({ auctionStats }: any) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
      {metrics(auctionStats).map((m, i) => (
        <Card key={i} className="border rounded-xl hover:shadow-sm transition">
          <CardContent className="p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <m.icon className={`size-4 ${m.color}`} />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">{m.title}</p>
              <p className="text-lg font-bold">{m.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

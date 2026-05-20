"use client";

import { useGetDashboardStats } from "@/app/feature/dashboard/hooks";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Clock3,
  Gavel,
  BadgeDollarSign,
  AlertCircle,
} from "lucide-react";

const KeyMetrics = () => {
  const { data, isLoading } = useGetDashboardStats();

  const stats = data?.data;

  const metrics = [
    {
      title: "Total Revenue",
      value: `$${stats?.kpis?.totalRevenue?.value || 0}`,
      sub: `Growth ${stats?.kpis?.totalRevenue?.growth || 0}%`,
      icon: DollarSign,
    },
    {
      title: "Total Users",
      value: stats?.kpis?.totalUsers?.value || 0,
      sub: `${stats?.users?.active || 0} Active / ${
        stats?.users?.inactive || 0
      } Inactive`,
      icon: Users,
    },
    {
      title: "Total Products",
      value: stats?.kpis?.totalProducts?.value || 0,
      sub: `${stats?.products?.byStatus?.active || 0} Active Listings`,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats?.kpis?.totalOrders?.value || 0,
      sub: `${stats?.kpis?.totalOrders?.pending || 0} Pending Orders`,
      icon: ShoppingCart,
    },
    {
      title: "Live Auctions",
      value: stats?.products?.liveAuctions || 0,
      sub: "Currently Running",
      icon: Gavel,
    },
    {
      title: "Marketplace Products",
      value: stats?.products?.byType?.fixedPrice || 0,
      sub: "Direct Purchase Listings",
      icon: BadgeDollarSign,
    },
    {
      title: "Taking Offers",
      value: stats?.products?.byType?.takingOffers || 0,
      sub: "Offer Based Products",
      icon: Clock3,
    },
    {
      title: "Pending Auth Requests",
      value: stats?.kpis?.pendingAuthRequests || 0,
      sub: "Awaiting Approval",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
      {metrics.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {isLoading ? "..." : item.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                <Icon className="size-4.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KeyMetrics;

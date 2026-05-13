"use client";

import { DollarSign, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pagination } from "@/components/pagination";
import { TableSkeleton } from "@/components/Skeleton";
import Link from "next/link";
import Image from "next/image";

interface DataTableProps {
  orders: any[];
  pagination: any;
  search: string;
  status: string;
  loading: boolean;
  activeTab: string;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
}

export function DataTable({
  orders,
  pagination,
  setPage,
  search,
  status,
  setSearch,
  setStatus,
  loading,
  activeTab,
}: DataTableProps) {
  return (
    <div className="w-full space-y-4">
      {/* FILTERS */}

      {/* TABLE */}
      {loading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            {/* ================= ORDERS ================= */}
            {activeTab === "orders" && (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders?.length ? (
                    orders.map((order) => (
                      <TableRow key={order?._id}>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-60">
                            <Image
                              src={
                                order?.product?.images?.[0]?.location ||
                                "/avatar.png"
                              }
                              alt={order?.model || "product"}
                              width={44}
                              height={44}
                              className="rounded-lg object-cover border"
                            />

                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {order?.product?.brandName}
                              </span>

                              <span className="text-sm text-muted-foreground">
                                {order?.product?.model}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {order?.product?.referenceId || "-"}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {order?.seller?.userName || "N/A"}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {order?.seller?.email}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 font-semibold">
                            <DollarSign className="size-4" />
                            {order?.totalAmount}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              order?.status === "delivered"
                                ? "bg-green-50 text-green-600 border-0"
                                : "bg-yellow-50 text-yellow-600 border-0"
                            }
                          >
                            {order?.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </>
            )}

            {/* ================= TRANSACTIONS ================= */}
            {activeTab === "transactions" && (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders?.length ? (
                    orders.map((transaction) => (
                      <TableRow key={transaction?._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {transaction?.userId?.userName}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {transaction?.userId?.email}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 font-semibold">
                            <DollarSign className="size-4" />
                            {transaction?.amount}
                          </div>
                        </TableCell>

                        <TableCell className="capitalize">
                          {transaction?.type}
                        </TableCell>

                        <TableCell className="capitalize">
                          {transaction?.purpose?.replaceAll("_", " ")}
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-green-50 text-green-600 border-0">
                            {transaction?.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {new Date(
                            transaction?.createdAt,
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </>
            )}

            {/* ================= SUBSCRIPTIONS ================= */}
            {activeTab === "subscriptions" && (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders?.length ? (
                    orders.map((subscription) => (
                      <TableRow key={subscription?._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {subscription?.user?.userName}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {subscription?.user?.email}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="capitalize">
                          {subscription?.plan?.name}
                        </TableCell>

                        <TableCell className="capitalize">
                          {subscription?.planType}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 font-semibold">
                            <DollarSign className="size-4" />
                            {subscription?.plan?.metadata?.amount}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-green-50 text-green-600 border-0">
                            {subscription?.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {new Date(
                            subscription?.currentPeriodEnd,
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </>
            )}
          </Table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-end">
        <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}

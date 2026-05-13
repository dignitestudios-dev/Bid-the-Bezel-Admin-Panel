"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "./_component/data-table";

import {
  useGetReportsOrders,
  useGetReportsTransactions,
  useGetReportsSubscriptions,
} from "@/app/feature/reports/hooks";

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  const debouncedSearch = useDebounce(search, 500);

  /* ---------------- API ---------------- */

  const { data: orders, isLoading: ordersLoading } = useGetReportsOrders(
    page,
    debouncedSearch,
  );

  const { data: transactions, isLoading: transactionsLoading } =
    useGetReportsTransactions(page, debouncedSearch);

  const { data: subscriptions, isLoading: subscriptionsLoading } =
    useGetReportsSubscriptions(page, debouncedSearch);

  /* ---------------- TAB DATA ---------------- */

  const tableData =
    activeTab === "orders"
      ? {
          data: orders?.data?.orders || [],
          pagination: orders?.data?.pagination,
          loading: ordersLoading,
        }
      : activeTab === "transactions"
        ? {
            data: transactions?.data?.transactions || [],
            pagination: transactions?.data?.pagination,
            loading: transactionsLoading,
          }
        : {
            data: subscriptions?.data?.subscriptions || [],
            pagination: subscriptions?.data?.pagination,
            loading: subscriptionsLoading,
          };

  return (
    <div className="flex flex-col gap-6">
      {/* TABS */}
      <div className="flex items-center gap-3 border-b px-4 lg:px-6 pt-6">
        {["orders", "transactions", "subscriptions"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`px-5 cursor-pointer py-2.5 text-sm font-medium rounded-t-xl transition-all capitalize
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "text-gray-500 hover:text-black"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="@container/main px-4 lg:px-6">
        <DataTable
          pagination={tableData.pagination}
          orders={tableData.data}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={tableData.loading}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { StatCardsSkeleton } from "@/components/Skeleton";
import { StatCards } from "./_component/stat-cards";
import { DataTable } from "./_component/data-table";
import {
  useGetFixedPrice,
  useGetFixedPriceStats,
} from "@/app/feature/fixed-price/hooks";
export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data: fixedPrice, isLoading: fixedPriceLoading } = useGetFixedPrice(
    page,
    debouncedSearch,
    status,
  );

  const { data: fixedStats, isLoading: fixedStatsLoading } =
    useGetFixedPriceStats();

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        {fixedStatsLoading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCards fixedStats={fixedStats?.data} />
        )}
      </div>

      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          pagination={fixedPrice?.data?.pagination}
          fixedprice={fixedPrice?.data?.products || []}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={fixedPriceLoading}
        />
      </div>
    </div>
  );
}

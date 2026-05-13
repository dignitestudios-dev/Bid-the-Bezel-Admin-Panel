"use client";

import { useState } from "react";

import { useGetUsers, useGetUserStats } from "@/app/feature/users/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { StatCardsSkeleton } from "@/components/Skeleton";
import { StatCards } from "./_component/stat-cards";
import { DataTable } from "./_component/data-table";
import { useGetFixedPrice } from "@/app/feature/fixed-price/hooks";
import { useGetTakingOffer, useGetTakingOfferStats } from "@/app/feature/taking-offer/hooks";
export default function TakingOfferPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data: takingOffer, isLoading: takingOfferLoading } = useGetTakingOffer(
    page,
    debouncedSearch,
    status,
  );

  const { data: takingStats, isLoading: takingStatsLoading } = useGetTakingOfferStats();

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        {takingStatsLoading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCards takingStats={takingStats?.data} />
        )}
      </div>

      <div className="@container/main px-4 lg:px-6 mt-2 lg:mt-2">
        <DataTable
          pagination={takingOffer?.data?.pagination}
          takingoffer={takingOffer?.data?.products || []}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={takingOfferLoading}
        />
      </div>
    </div>
  );
}

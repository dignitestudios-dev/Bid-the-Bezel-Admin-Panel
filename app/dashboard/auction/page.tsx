"use client";

import { useState } from "react";

import { useGetUsers, useGetUserStats } from "@/app/feature/users/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { StatCardsSkeleton } from "@/components/Skeleton";
import { useGetFixedPrice } from "@/app/feature/fixed-price/hooks";
import { StatCards } from "./_component/stat-cards";
import { DataTable } from "./_component/data-table";
import { useGetAuction, useGetAuctionStats } from "@/app/feature/auction/hooks";
export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [failedAuction, setFailedAuction] = useState(false);
  const [shouldAdminIntervene, setShouldAdminIntervene] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data: auctionPrice, isLoading: auctionLoading } = useGetAuction(
    page,
    debouncedSearch,
    status,
    isReserved,
    shouldAdminIntervene,
    failedAuction,
  );

  const { data: auctionStats, isLoading: auctionStatsLoading } = useGetAuctionStats();

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        {auctionStatsLoading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCards auctionStats={auctionStats?.data} />
        )}
      </div>

      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          pagination={auctionPrice?.data?.pagination}
          fixedprice={auctionPrice?.data?.products || []}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={auctionLoading}
          isReserved={isReserved}
          setIsReserved={setIsReserved}
          shouldAdminIntervene={shouldAdminIntervene}
          failedAuction={failedAuction}
          setFailedAuction={setFailedAuction}
          setShouldAdminIntervene={setShouldAdminIntervene}
        />
      </div>
    </div>
  );
}

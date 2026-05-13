"use client";

import { useState } from "react";

import { useGetUserStats } from "@/app/feature/users/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { StatCardsSkeleton } from "@/components/Skeleton";
import { StatCards } from "./_component/stat-cards";
import { DataTable } from "./_component/data-table";
import {
  useGetAuthentication,
  useGetAuthenticationStats,
} from "@/app/feature/authentication/hooks";
import { Button } from "@/components/ui/button";

export default function AuthenticationPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [type, setType] = useState("buyer");

  const debouncedSearch = useDebounce(search, 500);

  const { data: authentication, isLoading: authenticationLoading } =
    useGetAuthentication(page, debouncedSearch, status, type);

  const { data: authenticationStats, isLoading: authenticationStatsLoading } =
    useGetAuthenticationStats();
  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        {authenticationStatsLoading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCards       userStats={authenticationStats?.data?.[type]}
 />
        )}
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-3 px-4 lg:px-6">
        <Button
          variant={type === "buyer" ? "default" : "outline"}
          onClick={() => {
            setType("buyer");
            setPage(1);
          }}
        >
          Buyer
        </Button>

        <Button
          variant={type === "seller" ? "default" : "outline"}
          onClick={() => {
            setType("seller");
            setPage(1);
          }}
        >
          Seller
        </Button>
      </div>

      <div className="@container/main px-4 lg:px-6 lg:mt-6">
        <DataTable
          pagination={authentication?.data?.pagination}
          fixedprice={authentication?.data?.requests || []}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={authenticationLoading}
        />
      </div>
    </div>
  );
}

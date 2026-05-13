"use client";

import { useState } from "react";
import { StatCards } from "./components/stat-cards";
import { DataTable } from "./components/data-table";
import { useGetUsers, useGetUserStats } from "@/app/feature/users/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { StatCardsSkeleton } from "@/components/Skeleton";
export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data: userData, isLoading: userDataLoading } = useGetUsers(
    page,
    debouncedSearch,
    status,
  );

  const { data: userStats, isLoading: userStatsLoading } = useGetUserStats();

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        {userStatsLoading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCards userStats={userStats?.data} />
        )}
      </div>

      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          pagination={userData?.data?.pagination}
          users={userData?.data?.users || []}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={userDataLoading}
        />
      </div>
    </div>
  );
}

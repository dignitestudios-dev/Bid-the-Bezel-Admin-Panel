"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { StatCardsSkeleton } from "@/components/Skeleton";
import {
  useGetFixedPrice,
  useGetFixedPriceStats,
} from "@/app/feature/fixed-price/hooks";
import { DataTable } from "./_component/data-table";
import { useGetNotifications } from "@/app/feature/notifications/hooks";
import { Button } from "@base-ui/react";
import { Bell } from "lucide-react";
import { CreateNotificationModal } from "./_component/create-notification";
export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data: notifications, isLoading: fixedPriceLoading } =
    useGetNotifications(page, debouncedSearch);

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6 flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="h-10 flex items-center cursor-pointer bg-black text-white rounded-xl px-5 font-medium shadow-sm transition hover:shadow-md"
        >
          <Bell className="mr-2 size-4" />
          Create Notification
        </Button>
      </div>
      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          pagination={notifications?.data?.pagination}
          notifications={notifications?.data || []}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={fixedPriceLoading}
        />
      </div>
      <CreateNotificationModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

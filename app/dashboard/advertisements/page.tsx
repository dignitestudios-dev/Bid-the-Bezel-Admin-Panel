"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetFixedPrice,
  useGetFixedPriceStats,
} from "@/app/feature/fixed-price/hooks";
import { DataTable } from "./_component/data-table";
import { Button } from "@base-ui/react";
import { Megaphone } from "lucide-react";
import { useGetAdvertisements } from "@/app/feature/advertisements/hooks";
import { CreateAdvertisementModal } from "./_component/create-advertisements";
export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data: advertisements, isLoading: advertisementsLoading } =
    useGetAdvertisements(page, debouncedSearch);

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6 flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="h-10 flex items-center cursor-pointer bg-black text-white rounded-xl px-5 font-medium shadow-sm transition hover:shadow-md"
        >
          <Megaphone className="mr-2 size-4" />
          Create Advertisement
        </Button>
      </div>

      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          pagination={advertisements?.data?.pagination}
          advertisements={advertisements?.data?.advertisements || []}
          setPage={setPage}
          setStatus={setStatus}
          setSearch={setSearch}
          search={search}
          status={status}
          loading={advertisementsLoading}
        />
      </div>
      <CreateAdvertisementModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

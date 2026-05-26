"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

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

import Image from "next/image";
import { Pagination } from "@/components/pagination";
import { TableSkeleton } from "@/components/Skeleton";
import Link from "next/link";
import { useState } from "react";
import { CreateAdvertisementModal } from "./create-advertisements";
import { DeleteConfirmationModal } from "./delete-confirmation";
import { useDeleteAdvertisement } from "@/app/feature/advertisements/hooks";
import { ViewAdvertisementModal } from "./view-advertisement";

interface DataTableProps {
  advertisements: any[];
  pagination: any;
  search: string;
  status: string;
  loading: boolean;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
}

export function DataTable({
  advertisements,
  pagination,
  setPage,
  search,
  status,
  setSearch,
  setStatus,
  loading,
}: DataTableProps) {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const { mutate: deleteAdvertisement, isPending } = useDeleteAdvertisement();
  const handleDelete = () => {
    if (!selectedId) return;

    deleteAdvertisement(selectedId, {
      onSuccess: () => {
        setOpenDelete(false);
        setSelectedId(null);
      },
    });
  };
  return (
    <div className="w-full space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search</Label>

          <input
            type="text"
            placeholder="Search advertisement..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advertisement</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>

                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {advertisements?.length ? (
                advertisements.map((advertisement) => (
                  <TableRow key={advertisement?._id}>
                    <TableCell>
                      <div className="flex min-w-60 items-center gap-3 max-w-55">
                        <Image
                          src={advertisement?.image?.location || "/avatar.png"}
                          alt={advertisement?.title || "advertisement"}
                          width={50}
                          height={50}
                          className="rounded-lg border object-cover"
                        />

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold truncate">
                            {advertisement?.title}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="max-w-xs truncate text-sm text-muted-foreground">
                        {advertisement?.content}
                      </p>
                    </TableCell>
                    <TableCell>
                      {advertisement?.metadata?.link ? (
                        <a
                          href={advertisement.metadata.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={advertisement.metadata.link}
                          className="block max-w-45 truncate text-sm text-blue-600 hover:underline"
                        >
                          {advertisement.metadata.link}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                    {advertisement?.is_active ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Inactive
                      </span>
                    )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(
                          advertisement?.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedId(advertisement._id);
                            setViewOpen(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditData(advertisement);
                            setEditOpen(true);
                          }}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedId(advertisement._id);
                            setOpenDelete(true);
                          }}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-red-600 transition hover:border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No advertisements found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <CreateAdvertisementModal
        open={editOpen}
        onOpenChange={setEditOpen}
        editData={editData}
      />
      <div className="flex justify-end">
        <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          onPageChange={(p) => setPage(p)}
        />
      </div>
      <DeleteConfirmationModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        loading={isPending}
      />
      <ViewAdvertisementModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        advertisementId={selectedId}
      />
    </div>
  );
}

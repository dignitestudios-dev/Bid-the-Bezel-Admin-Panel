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
import { useDeleteAdvertisement } from "@/app/feature/advertisements/hooks";

interface DataTableProps {
  notifications: any[];
  pagination: any;
  search: string;
  status: string;
  loading: boolean;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
}

export function DataTable({
  notifications,
  pagination,
  setPage,
  search,
  status,
  setSearch,
  setStatus,
  loading,
}: DataTableProps) {
  return (
    <div className="w-full space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search</Label>

          <input
            type="text"
            placeholder="Search Notification..."
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
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
              
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {notifications?.length ? (
                notifications.map((item) => (
                  <TableRow key={item?._id}>
                    {/* TITLE */}
                    <TableCell>
                      <p className="text-sm font-semibold max-w-xs truncate">
                        {item?.title}
                      </p>
                    </TableCell>

                    {/* DESCRIPTION */}
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {item?.description}
                      </p>
                    </TableCell>

                    {/* TYPE */}
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {item?.notificationType || "-"}
                      </span>
                    </TableCell>

                  

                    {/* DATE */}
                    <TableCell>
                      <span className="text-sm">
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No notifications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

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

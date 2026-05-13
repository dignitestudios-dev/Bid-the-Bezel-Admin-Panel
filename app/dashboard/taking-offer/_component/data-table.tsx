"use client";

import { Eye, ToggleLeft, ToggleRight, DollarSign, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ConfirmDialog } from "../../fixed-price/_component/confirm-dialog";
import { useDeleteTakingOffer } from "@/app/feature/taking-offer/hooks";

interface DataTableProps {
  takingoffer: any[];
  pagination: any;
  search: string;
  status: string;
  loading: boolean;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
}

export function DataTable({
  takingoffer,
  pagination,
  setPage,
  search,
  status,
  setSearch,
  setStatus,
  loading,
}: DataTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { mutate: deleteProduct, isPending } = useDeleteTakingOffer();

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;

    deleteProduct(
      { productId: selectedId },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedId(null);
        },
      },
    );
  };
  return (
    <div className="w-full space-y-4">
      {/* FILTERS */}
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search</Label>

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value === "all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <TableSkeleton rows={6} columns={7} />
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {takingoffer?.length ? (
                takingoffer.map((product) => (
                  <TableRow key={product?._id}>
                    {/* PRODUCT */}
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-60">
                        <Image
                          src={product?.images?.[0]?.location || "/avatar.png"}
                          alt={product?.model || "product"}
                          width={44}
                          height={44}
                          className="rounded-lg object-cover border"
                        />

                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {product?.brandName}
                          </span>

                          <span className="text-sm text-muted-foreground">
                            {product?.model}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* REFERENCE */}
                    <TableCell>
                      <span className="font-medium">
                        {product?.referenceId || "-"}
                      </span>
                    </TableCell>

                    {/* SELLER */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {product?.seller?.firstName || "N/A"}{" "}
                          {product?.seller?.lastName}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {product?.seller?.email}
                        </span>
                      </div>
                    </TableCell>

                    {/* PRICE */}
                    <TableCell>
                      <div className="flex items-center gap-1 font-semibold">
                        <DollarSign className="size-4 text-muted-foreground" />
                        {product?.price}
                      </div>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge
                        className={
                          product?.status === "active"
                            ? "bg-green-50 text-green-600 border-0"
                            : "bg-red-50 text-red-600 border-0"
                        }
                      >
                        {product?.status}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/taking-offer/${product?._id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                        >
                          <Eye className="size-4" />
                        </Link>

                        {product?.status !== "sold" && (
                          <button
                            onClick={() => handleDeleteClick(product?._id)}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-red-600 hover:bg-red-50 hover:border-red-200 transition"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-end">
        <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          onPageChange={(p) => setPage(p)}
        />
      </div>
      <ConfirmDialog
        open={open}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        loading={isPending}
        onCancel={() => {
          setOpen(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

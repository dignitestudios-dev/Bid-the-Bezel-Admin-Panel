"use client";

import {
  Eye,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Check,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useAuthenticateUser } from "@/app/feature/authentication/hooks";

interface DataTableProps {
  fixedprice: any[];
  pagination: any;
  search: string;
  status: string;
  loading: boolean;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
}

export function DataTable({
  fixedprice,
  pagination,
  setPage,
  search,
  status,
  setSearch,
  setStatus,
  loading,
}: DataTableProps) {
  const [confirm, setConfirm] = useState<null | {
    type: "approved" | "rejected";
    product: any;
  }>(null);

  const { mutate, isPending } = useAuthenticateUser();

  const handleAction = (type: "approved" | "rejected") => {
    if (!confirm?.product) return;

    mutate(
      {
        productId: confirm.product._id,
        status: type,
      },
      {
        onSuccess: () => setConfirm(null),
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
              <SelectItem
                value="all"
                className="focus:bg-white cursor-pointer data-[highlighted]:bg-white data-[highlighted]:text-black"
              >
                All
              </SelectItem>

              <SelectItem
                value="approved"
                className="focus:bg-white cursor-pointer data-[highlighted]:bg-white data-[highlighted]:text-black"
              >
                Approved
              </SelectItem>

              <SelectItem
                value="rejected"
                className="focus:bg-white cursor-pointer data-[highlighted]:bg-white data-[highlighted]:text-black"
              >
                Rejected
              </SelectItem>

              <SelectItem
                value="pending"
                className="focus:bg-white data-[highlighted]:bg-white data-[highlighted]:text-black"
              >
                Pending
              </SelectItem>
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
                <TableHead>Authentication Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fixedprice?.length ? (
                fixedprice.map((product) => (
                  <TableRow key={product?._id}>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-60">
                        <Image
                          src={product?.images?.[0]?.location || "/avatar.png"}
                          alt={product?.model || "product"}
                          width={44}
                          height={44}
                          className="rounded-lg object-cover border"
                        />

                        <div className="flex flex-col max-w-[180px]">
                          <span className="font-medium text-sm truncate">
                            {product?.brandName}
                          </span>

                          <span className="text-sm text-muted-foreground truncate">
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
                      <div className="flex flex-col max-w-55">
                        <span className="text-sm font-medium truncate">
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
                          product?.authentication?.status === "approved"
                            ? "capitalize bg-green-50 text-green-600 border-0"
                            : "capitalize bg-red-50 text-red-600 border-0"
                        }
                      >
                        {product?.authentication?.status}
                      </Badge>
                    </TableCell>

                    {/* TYPE */}
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {product?.type?.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/authentication/${product?._id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                        >
                          <Eye className="size-4" />
                        </Link>
                        {product?.authentication?.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={isPending}
                              onClick={() =>
                                setConfirm({ type: "approved", product })
                              }
                              className="h-8 w-8 hover:bg-green-50"
                            >
                              <Check className="size-4 text-green-600" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={isPending}
                              onClick={() =>
                                setConfirm({ type: "rejected", product })
                              }
                              className="h-8 w-8 hover:bg-red-50"
                            >
                              <X className="size-4 text-red-600" />
                            </Button>
                          </>
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
      <Dialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>

            <DialogDescription>
              Are you sure you want to approve
              <span className="font-semibold">
                {confirm?.type === "approved" ? "approve" : "reject"}
              </span>{" "}
              this product?
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirm(null)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                if (!confirm) return;
                handleAction(confirm.type);
              }}
              disabled={isPending || !confirm}
              variant={confirm?.type === "approved" ? "default" : "destructive"}
            >
              {isPending ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

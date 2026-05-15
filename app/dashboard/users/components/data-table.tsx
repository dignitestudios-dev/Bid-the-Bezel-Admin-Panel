"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
  Download,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { UserFormDialog } from "./user-form-dialog";
import Image from "next/image";
import { Pagination } from "@/components/pagination";
import { useActiveInactiveUser } from "@/app/feature/users/hooks";
import { TableSkeleton } from "@/components/Skeleton";
import Link from "next/link";

interface DataTableProps {
  users: any[];
  pagination: any;
  search: string;
  status: string;
  loading: boolean;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
}

export function DataTable({
  users,
  pagination,
  setPage,
  search,
  status,
  setSearch,
  setStatus,
  loading,
}: DataTableProps) {
  const { mutate: toggleUserStatus, isPending } = useActiveInactiveUser();

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleToggleUserStatus = (user: any) => {
    setLoadingUserId(user?._id);

    toggleUserStatus(
      {
        userId: user?._id,
      },
      {
        onSettled: () => {
          setLoadingUserId(null);
        },
      },
    );
  };
  return (
    <div className="w-full space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        {/* SEARCH */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search</Label>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border rounded-md px-3 py-2 text-sm"
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
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                
                <TableHead>Subscribed</TableHead>
                <TableHead>User Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users?.length ? (
                users.map((user, index) => (
                  <TableRow key={index}>
                    {/* USER */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100 shrink-0">
                          <Image
                            src={
                              user?.profilePicture?.location || "/avatar.png"
                            }
                            alt={user?.userName || "user"}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium">{user?.userName}</span>
                          <span className="text-sm text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* EMAIL VERIFIED */}
                    {/* <TableCell>
                      <Badge
                        className={
                          user?.isEmailVerified
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }
                        variant="secondary"
                      >
                        {user?.isEmailVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell> */}

                    {/* SUBSCRIPTION */}
                    <TableCell>
                      <Badge
                        className={
                          user?.isSubscribed
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-50 text-gray-600"
                        }
                        variant="secondary"
                      >
                        {user?.isSubscribed ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user?.isDeactivatedByAdmin
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }
                        variant="secondary"
                      >
                        {user?.isDeactivatedByAdmin ? "Inactive" : "Active"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/users/${user?._id}`}
                          className="h-8 w-8"
                        >
                          <Eye className="size-4" />
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending && loadingUserId === user._id}
                          className="h-8 w-8 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleToggleUserStatus(user)}
                        >
                          {isPending && loadingUserId === user._id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                          ) : user?.isDeactivatedByAdmin ? (
                            <ToggleRight className="size-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="size-5 text-red-600" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
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

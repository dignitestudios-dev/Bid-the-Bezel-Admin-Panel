import { useGetAuctionBids } from "@/app/feature/auction/hooks";
import { TableSkeleton } from "@/components/Skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { formatDate } from "@/lib/utils/date.utils";
import { Pagination } from "@/components/pagination";
import { useState } from "react";

const BidsDataTable = ({ id }: { id: string }) => {
    const [page, setPage] = useState(1);
    const { data: bidsData, isLoading } = useGetAuctionBids(id, page);
    const bids = bidsData?.data?.bids || [];
    const pagination = bidsData?.pagination;

    return (
        <>
            {isLoading ? (
                <TableSkeleton rows={6} columns={4} />
            ) : (
                <div className="rounded-xl border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bidder</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {bids.length ? (
                                bids.map((bid: any) => (
                                    <TableRow key={bid._id}>
                                        {/* BIDDER */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={
                                                        bid?.bidder?.profilePicture?.location ||
                                                        "/avatar.png"
                                                    }
                                                    alt="bidder"
                                                    width={44}
                                                    height={44}
                                                    className="rounded-lg object-cover border"
                                                />

                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">
                                                        {bid?.bidder?.userName || "Unknown"}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* AMOUNT */}
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-semibold text-green-600">
                                                <DollarSign className="size-4" />
                                                {bid?.amount}
                                            </div>
                                        </TableCell>

                                        {/* STATUS */}
                                        <TableCell>
                                            <Badge
                                                className={
                                                    bid?.status === "accepted"
                                                        ? "bg-green-100 text-green-700 border-0"
                                                        : bid?.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700 border-0"
                                                            : "bg-gray-100 text-gray-700 border-0"
                                                }
                                            >
                                                {bid?.status}
                                            </Badge>
                                        </TableCell>

                                        {/* TIME */}
                                        <TableCell className="text-muted-foreground text-sm">
                                            {formatDate(bid.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No bids found
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
        </>
    );
};

export default BidsDataTable;
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="rounded-md border bg-gray-50 dark:bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-700" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-transparent">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-5 w-full bg-gray-300/70 dark:bg-gray-700/70" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border">
          <CardContent className="space-y-4">
            {/* ICON */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-6 rounded-md bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* CONTENT */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-700" />

              <Skeleton className="h-8 w-16 bg-gray-300 dark:bg-gray-700" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAdvertisementsId } from "@/app/feature/advertisements/hooks";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertisementId: string | null;
}

export function ViewAdvertisementModal({
  open,
  onOpenChange,
  advertisementId,
}: Props) {
  const { data, isLoading } = useGetAdvertisementsId(advertisementId || "");

  const ad = data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xl rounded-2xl p-0 overflow-hidden"
      >
        {/* HEADER */}
        <div className="border-b px-6 py-4 bg-muted/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Advertisement Details
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="space-y-5 px-6 py-5">
          {isLoading ? (
            <div className="space-y-3 ">
              <Skeleton className="h-48 w-full bg-gray-200 rounded-xl" />
              <Skeleton className="h-6 w-1/2 bg-gray-200" />
              <Skeleton className="h-20 w-full bg-gray-200" />
              <Skeleton className="h-6 w-1/3 bg-gray-200" />
              <Skeleton className="h-6 w-1/4 bg-gray-200" />
            </div>
          ) : (
            <>
              {/* IMAGE CARD */}
              {ad?.image?.location && (
                <div className="relative h-52 w-full overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={ad.image.location}
                    alt={ad.title || "advertisement"}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}

              {/* TITLE CARD */}
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="text-sm font-medium text-foreground">
                  {ad?.title}
                </p>
              </div>

              {/* CONTENT CARD */}
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Content</p>
                <p className="text-sm leading-relaxed text-foreground">
                  {ad?.content}
                </p>
              </div>

              {/* LINK CARD */}
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Link</p>

                {ad?.metadata?.link ? (
                  <a
                    href={ad.metadata.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {ad.metadata.link}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">No link</p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Status</p>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    ad?.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {ad?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

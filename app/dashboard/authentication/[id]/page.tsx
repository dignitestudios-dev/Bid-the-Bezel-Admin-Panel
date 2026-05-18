"use client";

import Image from "next/image";
import {
  DollarSign,
  Package,
  ShoppingBag,
  User,
  Gavel,
  Clock3,
  BadgeCheck,
  Trash2,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useParams, useRouter } from "next/navigation";
import { useGetAuctionById } from "@/app/feature/auction/hooks";
import { useDeleteProduct } from "@/app/feature/fixed-price/hooks";
import { useState } from "react";
import { ConfirmDialog } from "../../fixed-price/_component/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useAuthenticateUser } from "@/app/feature/authentication/hooks";

const Page = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { mutate, isPending } = useAuthenticateUser();
  const [confirm, setConfirm] = useState<null | {
    type: "approved" | "rejected";
    product: any;
  }>(null);
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetAuctionById(id);

  const product = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-125 w-full rounded-2xl bg-gray-300" />
        <Skeleton className="h-10 w-1/3 bg-gray-300" />
        <Skeleton className="h-24 w-full bg-gray-300" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Product not found
      </div>
    );
  }

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  //   const confirmDelete = () => {
  //     if (!selectedId) return;

  //     deleteProduct(
  //       { productId: selectedId },
  //       {
  //         onSuccess: () => {
  //           setOpen(false);
  //           setSelectedId(null);
  //           router.push("/dashboard/auction");
  //         },
  //       },
  //     );
  //   };

  const handleAction = (type: "approved" | "rejected") => {
    if (!confirm?.product) return;

    mutate(
      {
        productId: confirm.product._id,
        status: type,
      },
      {
        onSuccess: () => {
          router.push("/dashboard/authentication");
          setConfirm(null)
        },
      },
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMAGE CAROUSEL */}
        <div className="rounded-2xl border bg-background p-4">
          <Carousel className="w-full">
            <CarouselContent>
              {product?.images?.map((img: any) => (
                <CarouselItem key={img?._id}>
                  <div className="relative h-125 w-full overflow-hidden rounded-2xl border bg-muted">
                    <Image
                      src={img?.location}
                      alt={product?.model}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          {/* THUMBNAILS */}
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {product?.images?.map((img: any) => (
              <div
                key={img?._id}
                className="relative h-20 w-20 overflow-hidden rounded-xl border shrink-0"
              >
                <Image
                  src={img?.location}
                  alt="thumb"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="rounded-2xl border bg-background p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Badge variant="secondary" className="capitalize">
                {product?.type?.replace("_", " ")}
              </Badge>
              {product?.authentication?.status !== "approved" ||
                product?.authentication?.status !== "rejected" && (
                  <div className="flex items-center gap-2">
                    {/* APPROVE */}
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={() => setConfirm({ type: "approved", product })}
                      className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>

                    {/* REJECT */}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => setConfirm({ type: "rejected", product })}
                      className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </div>
                )}
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight break-words">
                {product?.brandName}
              </h1>

              <p className="text-lg text-muted-foreground break-words">{product?.model}</p>
            </div>
          </div>

          {/* PRICE */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-4xl font-bold">
              <DollarSign className="size-8" />
              {product?.price}
            </div>

            <Badge className="bg-blue-100 text-blue-700 border-0 capitalize">
              {product?.status}
            </Badge>
          </div>

          {/* STATUS BADGES */}
          <div className="flex flex-wrap gap-2">
            <Badge
              className={
                product?.authentication?.status === "approved"
                  ? "bg-green-100 text-green-700 border-0 capitalize"
                  : product?.authentication?.status === "rejected"
                    ? "bg-red-100 text-red-700 border-0 capitalize"
                    : product?.authentication?.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border-0 capitalize"
                      : "bg-gray-100 text-gray-700 border-0 capitalize"
              }
            >
              {product?.authentication?.status === "not_required"
                ? "Unauthenticated"
                : product?.authentication?.status === "approved"
                  ? "Authenticated"
                  : product?.authentication?.status === "rejected"
                    ? "Rejected"
                    : "Pending"}
            </Badge>
            <Badge className="bg-orange-100 text-orange-700 border-0 capitalize">
              Auction: {product?.auction?.status}
            </Badge>

            <Badge className="bg-gray-100 text-gray-700 border-0">
              Holder: {product?.currentHolder}
            </Badge>
          </div>

          <Separator />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Description</h2>

            <p className="leading-7 text-muted-foreground break-words">
              {product?.description}
            </p>
          </div>

          {product?.type === "auction" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Gavel className="size-4" />
                  Current Bid
                </div>

                <p className="text-2xl font-bold">
                  ${product?.auction?.currentBidAmount || 0}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <BadgeCheck className="size-4" />
                  Total Bids
                </div>

                <p className="text-2xl font-bold">
                  {product?.auction?.totalBids || 0}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Clock3 className="size-4" />
                  Starts At
                </div>

                <p className="text-sm font-medium">
                  {new Date(product?.auction?.startsAt).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Clock3 className="size-4" />
                  Ends At
                </div>

                <p className="text-sm font-medium">
                  {new Date(product?.auction?.endsAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRODUCT DETAILS */}
        <div className="rounded-2xl border p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Package className="size-5" />
            <h2 className="text-lg font-semibold">Product Details</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference ID</span>

              <span className="font-medium">{product?.referenceId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Flow</span>

              <span className="font-medium capitalize">
                {product?.deliveryFlow?.replace("_", " ")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Effective Price</span>

              <span className="font-medium">${product?.effectivePrice}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Created At</span>

              <span className="font-medium">
                {new Date(product?.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated At</span>

              <span className="font-medium">
                {new Date(product?.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* SELLER */}
        <div className="rounded-2xl border p-5 space-y-5">
          <div className="flex items-center gap-2">
            <User className="size-5" />
            <h2 className="text-lg font-semibold">Seller Info</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border">
              <Image
                src={product?.seller?.profilePicture?.location || "/avatar.png"}
                alt="seller"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-semibold">{product?.seller?.userName}</p>

              <p className="text-sm text-muted-foreground">
                {product?.seller?.email}
              </p>

              <p className="text-sm mt-1">⭐ {product?.seller?.rating}</p>
            </div>
          </div>
        </div>

        {/* BUYER */}
        <div className="rounded-2xl border p-5 space-y-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            <h2 className="text-lg font-semibold">Buyer Info</h2>
          </div>

          {product?.buyer ? (
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border">
                <Image
                  src={
                    product?.buyer?.profilePicture?.location || "/avatar.png"
                  }
                  alt="buyer"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <p className="font-semibold">
                  {product?.buyer?.userName || "-"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {product?.buyer?.email || "-"}
                </p>

                <p className="text-sm mt-1">
                  ⭐ {product?.buyer?.rating ?? "0"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <ShoppingBag className="size-8 mb-2 opacity-50" />
              <p className="text-sm">No buyer yet</p>
            </div>
          )}
        </div>
      </div>
      <Dialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>

            <DialogDescription>
              Do you really want to{" "}
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
};

export default Page;

"use client";

import Image from "next/image";
import { DollarSign, Package, ShoppingBag, Trash2, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteTakingOffer,
  useGetTakingOfferById,
} from "@/app/feature/taking-offer/hooks";
import { useState } from "react";
import { ConfirmDialog } from "../../fixed-price/_component/confirm-dialog";
import ProductQA from "../_component/product-qa";

const Page = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { mutate: deleteProduct, isPending } = useDeleteTakingOffer();

  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetTakingOfferById(id);

  const product = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-125 w-full rounded-xl bg-gray-300" />
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

  const seller = product?.seller;
  const buyer = product?.buyer;

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
          router.push("/dashboard/taking-offer");
        },
      },
    );
  };
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMAGE */}
        <Carousel className="w-full">
          <CarouselContent>
            {product?.images?.map((img: any) => (
              <CarouselItem key={img?._id}>
                <div className="relative h-125 w-full overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={img?.location}
                    alt={product?.model || "product"}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-4 z-10" />
          <CarouselNext className="right-4 z-10" />
        </Carousel>

        {/* INFO */}
        <div className="rounded-2xl border bg-background p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Badge variant="secondary" className="capitalize">
                {product?.type?.replace("_", " ")}
              </Badge>
              {product?.status !== "sold" && (
                <button
                  onClick={() => handleDeleteClick(product?._id)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-red-600 hover:bg-red-50 hover:border-red-200 transition"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {product?.brandName}
            </h1>

            <p className="text-lg text-muted-foreground">{product?.model}</p>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-3xl font-bold">
              <DollarSign className="size-7" />
              {product?.price}
            </div>

            <Badge
              className={
                product?.auction?.status === "ended"
                  ? "bg-green-100 text-green-700 border-0"
                  : "bg-yellow-100 text-yellow-700 border-0"
              }
            >
              {product?.auction?.status}
            </Badge>
          </div>

          {/* STATUS */}
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

            <Badge className="bg-gray-100 text-gray-700 border-0">
              {product?.status}
            </Badge>
          </div>

          <Separator />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Description</h2>
            <p className="text-muted-foreground leading-7">
              {product?.description}
            </p>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRODUCT DETAILS */}
        <div className="rounded-2xl border p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Package className="size-5" />
            <h2 className="font-semibold text-lg">Product Details</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference ID</span>
              <span className="font-medium">{product?.referenceId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Holder</span>
              <span className="font-medium capitalize">
                {product?.currentHolder}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Flow</span>
              <span className="font-medium capitalize">
                {product?.deliveryFlow?.replace("_", " ")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Created At</span>
              <span className="font-medium">
                {product?.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : "-"}
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
      <ProductQA />
    </div>
  );
};

export default Page;

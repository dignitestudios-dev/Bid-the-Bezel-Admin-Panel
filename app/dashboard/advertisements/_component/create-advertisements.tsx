"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Megaphone, ImagePlus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";

import {
  AdvertisementFormValues,
  advertisementSchema,
  updateAdvertisementSchema,
} from "@/app/feature/advertisements/schema";

import { zodResolver } from "@hookform/resolvers/zod";

import { FloatingInput } from "@/components/ui/floating-input";
import {
  useAdvertisement,
  useUpdateAdvertisement,
} from "@/app/feature/advertisements/hooks";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: any;
}

export function CreateAdvertisementModal({
  open,
  onOpenChange,
  editData,
}: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEdit = !!editData;

  const { mutate: createAdvertisement, isPending: advertisementLoading } =
    useAdvertisement();

  const { mutate: updateAdvertisement, isPending: updateLoading } =
    useUpdateAdvertisement();
  const schema = isEdit ? updateAdvertisementSchema : advertisementSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
      is_active: true,
      link: "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        title: editData?.title || "",
        content: editData?.content || "",
        link: editData?.metadata?.link || "",
        image: undefined,
        is_active: editData?.is_active ?? true,
      });

      setImagePreview(editData?.image?.location || null);
    }
  }, [editData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 10MB check
    if (file.size > 10 * 1024 * 1024) {
      form.setError("image", {
        type: "manual",
        message: "Image must be less than 10MB",
      });
      return;
    }

    form.clearErrors("image");

    form.setValue("image", file);

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };
  const onSubmit = (values: any) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("is_active", values.is_active ? "true" : "false");
    const metadata = {
      link: values.link || "",
    };

    formData.append("metadata", JSON.stringify(metadata));

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    if (isEdit) {
      updateAdvertisement(
        {
          advertisementId: editData?._id,
          data: formData,
        },
        {
          onSuccess: () => {
            onOpenChange(false);

            form.reset();

            setImagePreview(null);
          },
        },
      );
    } else {
      createAdvertisement(formData as any, {
        onSuccess: () => {
          onOpenChange(false);

          form.reset();

          setImagePreview(null);
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (advertisementLoading || updateLoading) return;
        onOpenChange(val);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto overflow-x-hidden sm:max-w-xl rounded-2xl p-0"
      >
        <div className="border-b px-6 py-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <Megaphone className="size-5" />
              </div>

              <div>
                <DialogTitle className="text-xl">
                  {isEdit ? "Edit Advertisement" : "Create Advertisement"}
                </DialogTitle>

                <DialogDescription className="mt-1">
                  {isEdit
                    ? "Update advertisement details."
                    : "Add a new advertisement campaign."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 sm:max-w-xl rounded-2xl p-0"
        >
          <div className="space-y-5 px-6 py-5">
            <div className="space-y-2">
              <FloatingInput
                type="text"
                label="Enter advertisement title"
                id="title"
                maxLength={50}
                {...form.register("title")}
                error={form.formState.errors.title?.message}
              />
            </div>
            <div className="space-y-2">
              <FloatingInput
                type="text"
                label="Enter advertisement link"
                id="link"
                {...form.register("link")}
                error={form.formState.errors.link?.message}
              />
            </div>
            <div className="space-y-2 sm:max-w-xl">
              <Textarea
                placeholder="Write advertisement content..."
                className="min-h-30 resize-none overflow-hidden  whitespace-pre-wrap"
                maxLength={250}
                {...form.register("content")}
              />

              {form.formState.errors.content?.message && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.content?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>

              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                {...form.register("is_active", {
                  setValueAs: (v) => v === "true",
                })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {form.formState.errors.is_active?.message && (
                <p className="text-xs text-red-500">
                  {String(form.formState.errors.is_active.message)}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label>Advertisement Image</Label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 transition hover:bg-muted/40">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {!imagePreview ? (
                  <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
                    <ImagePlus className="size-6" />

                    <p className="text-xs">
                      Click to upload advertisement image
                    </p>
                  </div>
                ) : (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview}
                      alt="preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </label>

              {form.formState.errors.image?.message && (
                <p className="text-xs text-red-500">
                  {String(form.formState.errors.image?.message)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={advertisementLoading || updateLoading}
              className="bg-black text-white hover:bg-black/90"
            >
              {advertisementLoading || updateLoading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Advertisement"
                  : "Create Advertisement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

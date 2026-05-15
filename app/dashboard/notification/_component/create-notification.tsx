"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FloatingInput } from "@/components/ui/floating-input";

import {
  notificationSchema,
  NotificationFormValues,
} from "@/app/feature/notifications/schema";
import { useNotification } from "@/app/feature/notifications/hooks";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNotificationModal({ open, onOpenChange }: Props) {
  const { mutate: createNotification, isPending } = useNotification();

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      description: "",
      notificationType: "All",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const onSubmit = (values: NotificationFormValues) => {
    createNotification(values, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xl rounded-2xl p-0"
      >
        <div className="border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Notification</DialogTitle>
            <DialogDescription>
              Send a new notification to users.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:max-w-xl rounded-2xl p-0">
          <div className="space-y-5 px-6 py-5">
            <FloatingInput
              id="title"
              label="Title"
              {...form.register("title")}
              maxLength={50}
              error={form.formState.errors.title?.message}
            />

            <div>
              <Textarea
                placeholder="Enter description..."
                className=" resize-none"
                maxLength={250}
                {...form.register("description")}
              />

              {form.formState.errors.description?.message && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-black text-white"
            >
              {isPending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

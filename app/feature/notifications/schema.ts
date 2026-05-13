// schema.ts
import * as z from "zod";

export const notificationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  notificationType: z.enum(["All", "Specific"]),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;

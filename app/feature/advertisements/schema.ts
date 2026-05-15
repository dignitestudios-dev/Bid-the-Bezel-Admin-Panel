import * as z from "zod";

export const advertisementSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),

  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be less than 1000 characters"),
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Image is required",
    })
    .refine((file) => file?.size <= 10 * 1024 * 1024, {
      message: "Image must be less than 10MB",
    }),
  is_active: z.boolean().optional(),
  link: z
    .string()
    .trim()
    .min(1, "Link is required")
    .refine((val) => /^https?:\/\/.+/.test(val), {
      message: "Invalid URL",
    }),
});
export const updateAdvertisementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  link: z
    .string()
    .trim()
    .min(1, "Link is required")
    .refine((val) => /^https?:\/\/.+/.test(val), {
      message: "Invalid URL",
    }),
  is_active: z.boolean().optional(),
  image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "Invalid image",
    })
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
      message: "Image must be less than 10MB",
    }),
});

export type AdvertisementFormValues = z.infer<typeof advertisementSchema>;

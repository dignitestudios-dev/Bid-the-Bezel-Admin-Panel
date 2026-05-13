import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255)
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
});
export type LoginPayload = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(5, "OTP is required"),
});
export type OtpPayload = z.infer<typeof otpSchema>;

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must be at most 12 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include uppercase, lowercase, number and special character",
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),
    resetToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type updatePasswordPayload = z.infer<typeof updatePasswordSchema>;

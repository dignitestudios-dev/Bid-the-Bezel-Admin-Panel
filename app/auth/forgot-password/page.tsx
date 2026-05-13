"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FloatingInput } from "@/components/ui/floating-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPassword } from "@/app/feature/auth/hook";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const router = useRouter();

  const { mutate: forgotPasswordMutate, isPending: forgotPasswordPending } =
    useForgotPassword();

  const forgotPasswordForm = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordPayload) => {
    forgotPasswordMutate(values, {
      onSuccess: (res) => {
    
        router.push("/auth/verification");
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          Forgot Password
        </h2>

        <p className="text-gray-600">
          Enter your email address and we'll send you an OTP to reset your
          password
        </p>
      </div>

      <form
        onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <FloatingInput
            id="email"
            label="Email"
            type="email"
            maxLength={256}
            error={forgotPasswordForm.formState.errors.email?.message}
            {...forgotPasswordForm.register("email")}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={forgotPasswordPending}
        >
          {forgotPasswordPending ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;

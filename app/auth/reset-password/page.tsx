"use client";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FloatingInput } from "@/components/ui/floating-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePassword } from "@/app/feature/auth/hook";
import {
  updatePasswordPayload,
  updatePasswordSchema,
} from "@/app/feature/auth/schema";
import { getToken, removeToken } from "@/lib/cookies";
import { showSuccess } from "@/lib/toast";

const ResetPassword = () => {
  const router = useRouter();

  const { mutate: updatePasswordMutate, isPending: updatePasswordPending } =
    useUpdatePassword();

  const resetPasswordForm = useForm<updatePasswordPayload>({
    resolver: zodResolver(updatePasswordSchema),

    defaultValues: {
      password: "",
      confirmPassword: "",
      resetToken: "",
    },
  });

  const onSubmit = (body: updatePasswordPayload) => {
    const { password, resetToken } = body;
    updatePasswordMutate({ password, resetToken } as any, {
      onSuccess: () => {
        removeToken();
        showSuccess(
          "Password updated successfully. Please log in with your new password.",
        );
        router.push("/auth/login");
      },
      onError: (error) => {
        showSuccess(error as any);
      },
    });
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      resetPasswordForm.setValue("resetToken", token);
    }
  }, []);

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          Reset Password
        </h2>

        <p className="text-gray-600">Enter your new password below</p>
      </div>

      <form
        onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Password */}

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>

          <FloatingInput
            id="password"
            label="New Password"
            type="password"
            maxLength={256}
            error={resetPasswordForm.formState.errors.password?.message}
            {...resetPasswordForm.register("password")}
          />
        </div>

        {/* Confirm Password */}

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>

          <FloatingInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            maxLength={256}
            error={resetPasswordForm.formState.errors.confirmPassword?.message}
            {...resetPasswordForm.register("confirmPassword")}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={updatePasswordPending}
        >
          {updatePasswordPending ? "Updating..." : "Reset Password"}
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

export default ResetPassword;

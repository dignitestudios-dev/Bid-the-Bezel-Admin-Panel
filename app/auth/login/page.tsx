"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingInput } from "@/components/ui/floating-input";
import { useLogin } from "@/app/feature/auth/hook";
import { LoginPayload, loginSchema } from "@/app/feature/auth/schema";

const Login = () => {
  const router = useRouter();

  const { mutate: loginMutate, isPending: loginPending } = useLogin();

  const loginForm = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginPayload) => {
    loginMutate(values, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h2>

        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          
          <FloatingInput
            id="email"
            label="Email"
            type="email"
            maxLength={256}
            error={loginForm.formState.errors.email?.message}
            {...loginForm.register("email")}
          />
        </div>

        <div className="space-y-2">
        

          <FloatingInput
            id="password"
            label="Password"
            type="password"
            maxLength={256}
            error={loginForm.formState.errors.password?.message}
            {...loginForm.register("password")}
          />
        </div>

        <div className="text-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loginPending}>
          {loginPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default Login;

"use client";

import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { useForgotOtpVerify, useForgotPassword } from "@/app/feature/auth/hook";
import { setToken } from "@/lib/cookies";
import { showSuccess } from "@/lib/toast";

const Verification = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const [timer, setTimer] = useState(120);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const { mutate: verifyOtpMutate, isPending: verifyOtpPending } =
    useForgotOtpVerify();

  const { mutate: resendOtpMutate, isPending: resendPending } =
    useForgotPassword();

  // countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      return;
    }

    if (value.length > 1) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";

        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";

        setOtp(newOtp);

        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");

    const email = localStorage.getItem("email");

    if (otpCode.length !== 5 || !email) {
      return;
    }

    verifyOtpMutate(
      {
        email,
        otp: otpCode,
      },
      {
        onSuccess: (res) => {
          setToken(res?.data?.token || "");
          router.push("/auth/reset-password");
        },
      },
    );
  };

  const handleResendOtp = () => {
    const email = localStorage.getItem("email");

    if (!email) return;

    resendOtpMutate(
      { email },
      {
        onSuccess: (res) => {
          showSuccess(res?.data?.message || "OTP resent successfully");
          setTimer(120);
        },
      },
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          Verify Your Email
        </h2>

        <p className="text-gray-600">
          We've sent a 5-digit code to your email address.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-12 w-12 rounded-lg border border-gray-300 text-center text-2xl font-bold focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center text-sm text-gray-500">
          {timer > 0 ? (
            <>
              Resend OTP in{" "}
              <span className="font-medium text-black">
                {formatTime(timer)}
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendPending}
              className="font-medium text-primary hover:underline"
            >
              {resendPending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isComplete || verifyOtpPending}
        >
          {verifyOtpPending ? "Verifying..." : "Verify OTP"}
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

export default Verification;

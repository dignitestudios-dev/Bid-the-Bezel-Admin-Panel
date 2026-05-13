"use client";

import Image from "next/image";
import * as React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 24, className }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      width={size}
      height={size}
      alt="Logo"
      className={className}
      unoptimized
    />
  );
}

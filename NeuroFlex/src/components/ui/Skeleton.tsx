"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "rounded";
}

export function Skeleton({
  variant = "rounded",
  className,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-none",
    circular: "rounded-full",
    rounded: "rounded-xl",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-800/60",
        variantStyles[variant],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

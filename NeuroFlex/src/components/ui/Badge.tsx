"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "cyan" | "emerald" | "amber" | "rose" | "purple";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border-slate-700/80",
    brand: "bg-brand-950/80 text-brand-300 border-brand-500/30",
    cyan: "bg-cyan-950/80 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-950/80 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-950/80 text-amber-300 border-amber-500/30",
    rose: "bg-rose-950/80 text-rose-300 border-rose-500/30",
    purple: "bg-purple-950/80 text-purple-300 border-purple-500/30",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border tracking-wide transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

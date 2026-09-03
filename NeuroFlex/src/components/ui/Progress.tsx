"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "brand" | "cyan" | "purple" | "emerald" | "amber";
  showLabel?: boolean;
}

export function Progress({
  value,
  max = 100,
  size = "md",
  variant = "brand",
  showLabel = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const gradientClasses = {
    brand: "bg-gradient-to-r from-brand-600 to-brand-400",
    cyan: "bg-gradient-to-r from-accent-cyan to-teal-400",
    purple: "bg-gradient-to-r from-purple-600 to-pink-500",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-400",
    amber: "bg-gradient-to-r from-amber-500 to-orange-400",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Progress</span>
          <span className="font-bold text-white">{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${percentage}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            gradientClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/25 focus:ring-brand-500 border border-brand-400/20 active:scale-[0.98]",
      secondary:
        "bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700/60 shadow-sm focus:ring-slate-400 active:scale-[0.98]",
      outline:
        "border border-slate-700 hover:border-brand-500/60 text-slate-200 hover:bg-brand-500/10 focus:ring-brand-400 active:scale-[0.98]",
      ghost:
        "text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-400",
      accent:
        "bg-gradient-to-r from-accent-cyan to-accent-teal hover:opacity-95 text-slate-950 font-semibold shadow-lg shadow-accent-cyan/20 focus:ring-accent-cyan active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

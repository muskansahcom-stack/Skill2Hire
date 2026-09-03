import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      icon,
      iconPosition = "left",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3.5 text-slate-500 pointer-events-none shrink-0">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 transition-all duration-150 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed",
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",
              error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30",
              className
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-3.5 text-slate-500 pointer-events-none shrink-0">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-rose-400 font-medium animate-fadeIn">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-[11px] text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  onClose?: () => void;
}

export function Alert({
  variant = "info",
  title,
  children,
  className,
  onClose,
  ...props
}: AlertProps) {
  const variantStyles = {
    info: "bg-cyan-950/30 border-cyan-500/40 text-cyan-200",
    success: "bg-emerald-950/30 border-emerald-500/40 text-emerald-200",
    warning: "bg-amber-950/30 border-amber-500/40 text-amber-200",
    error: "bg-rose-950/30 border-rose-500/40 text-rose-200",
  };

  const IconComponent = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  }[variant];

  const iconColors = {
    info: "text-cyan-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-rose-400",
  }[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md animate-fadeIn text-xs sm:text-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <IconComponent className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors)} aria-hidden="true" />
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-bold text-white leading-none">{title}</h5>}
        <div className="leading-relaxed text-slate-300">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-slate-400"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

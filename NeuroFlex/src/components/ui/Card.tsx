"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
  glow?: boolean;
}

export function Card({
  className,
  hoverEffect = false,
  glass = true,
  glow = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 transition-all duration-300",
        glass && "backdrop-blur-xl bg-slate-900/70 border-slate-800/80",
        hoverEffect && "hover:border-brand-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-0.5",
        glow && "relative before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-brand-500/20 before:to-accent-cyan/20 before:-z-10 before:blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4 border-b border-slate-800/60", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-4", className)} {...props}>{children}</div>;
}

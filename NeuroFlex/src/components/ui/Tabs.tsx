import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1 rounded-xl bg-slate-900/90 p-1.5 border border-slate-800", className)}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-brand-600/90 text-white shadow-md shadow-brand-600/30 border border-brand-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                  isActive ? "bg-brand-400/30 text-white" : "bg-slate-800 text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

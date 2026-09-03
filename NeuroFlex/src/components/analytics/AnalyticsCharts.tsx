"use client";

import React, { useState } from "react";
import { LearningSessionStat } from "@/lib/progress/progressService";

/**
 * 1. Radial Mastery Gauge Chart
 */
export function MasteryRadialGauge({
  percentage = 72,
  size = 180,
  strokeWidth = 14,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-800/80"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#masteryGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="masteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Metric Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl sm:text-4xl font-black text-white font-display">
          {percentage}%
        </span>
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
          Mastery Index
        </span>
      </div>
    </div>
  );
}

/**
 * 2. Weekly Learning Sessions Bar Chart
 */
export function WeeklySessionsBarChart({ sessions }: { sessions: LearningSessionStat[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxMinutes = Math.max(...sessions.map((s) => s.minutes), 60);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
        {sessions.map((s, idx) => {
          const heightPercent = Math.max((s.minutes / maxMinutes) * 100, 8);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={s.day}
              className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 z-10 bg-slate-900 border border-slate-700 text-white text-[11px] font-mono px-2 py-1 rounded-lg shadow-xl whitespace-nowrap animate-fadeIn">
                  {s.minutes} mins • {s.sessionsCount} session(s)
                </div>
              )}

              {/* Bar */}
              <div className="w-full max-w-[36px] bg-slate-800/80 rounded-t-xl overflow-hidden flex items-end h-full">
                <div
                  className={`w-full rounded-t-xl transition-all duration-300 ${
                    isHovered
                      ? "bg-accent-cyan shadow-lg shadow-cyan-500/30"
                      : "bg-gradient-to-t from-brand-600 to-indigo-400 group-hover:from-brand-500 group-hover:to-accent-cyan"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-xs font-mono transition-colors ${
                  isHovered ? "text-accent-cyan font-bold" : "text-slate-400"
                }`}
              >
                {s.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 3. Quiz Performance Area / Line Chart
 */
export function QuizPerformanceAreaChart({
  data,
}: {
  data: { date: string; score: number; topic: string }[];
}) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 500;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;

  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * usableWidth;
    const y = height - paddingY - ((d.score - 50) / 50) * usableHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${
    points[0].x
  } ${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="quizAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[60, 80, 100].map((scoreVal) => {
          const y = height - paddingY - ((scoreVal - 50) / 50) * usableHeight;
          return (
            <g key={scoreVal}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {scoreVal}%
              </text>
            </g>
          );
        })}

        {/* Filled Area */}
        <path d={areaD} fill="url(#quizAreaGradient)" />

        {/* Smooth Curve Line */}
        <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, i) => {
          const isHovered = hoveredPoint === i;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? "#38bdf8" : "#0f172a"}
                stroke="#06b6d4"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-200"
              />
            </g>
          );
        })}
      </svg>

      {/* Point Hover Tooltip Overlay */}
      {hoveredPoint !== null && (
        <div className="absolute top-2 right-4 bg-slate-900 border border-slate-700 text-xs p-2 rounded-xl shadow-xl space-y-0.5 animate-fadeIn">
          <span className="font-bold text-white">{points[hoveredPoint].topic}</span>
          <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
            <span>{points[hoveredPoint].date}</span>
            <span className="text-emerald-400 font-bold">{points[hoveredPoint].score}% Score</span>
          </div>
        </div>
      )}
    </div>
  );
}

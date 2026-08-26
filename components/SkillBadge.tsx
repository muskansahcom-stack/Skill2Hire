import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { SkillLevel } from '@/lib/types';

interface SkillBadgeProps {
  name: string;
  level?: SkillLevel | string;
  isVerified?: boolean;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export default function SkillBadge({
  name,
  level = 'Intermediate',
  isVerified = false,
  score,
  size = 'md',
  showScore = true
}: SkillBadgeProps) {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  };

  if (isVerified) {
    return (
      <span
        className={`inline-flex items-center rounded-lg font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm ${sizeClasses[size]}`}
      >
        <CheckCircle2 className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600 shrink-0`} />
        <span>{name}</span>
        <span className="text-emerald-600/80 font-medium">({level})</span>
        <span className="text-emerald-700 font-bold bg-emerald-100/80 px-1 py-0.2 rounded text-[10px]">
          Verified ✓ {showScore && score ? `${score}%` : ''}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg font-medium bg-amber-50/80 text-amber-800 border border-amber-300 ${sizeClasses[size]}`}
    >
      <AlertCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-500 shrink-0`} />
      <span>{name}</span>
      <span className="text-amber-600/80 text-[11px]">({level})</span>
      <span className="text-amber-700 text-[10px] bg-amber-100/70 px-1 py-0.2 rounded">
        Self-Declared
      </span>
    </span>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Flame,
  Award,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Student Learner");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">
                Student Profile
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              Personal Account &amp; Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage your student profile, view your active learning metrics, and access settings.
            </p>
          </div>

          <Link href="/settings">
            <Button variant="secondary" size="sm" icon={<Sliders className="h-4 w-4" />}>
              Accessibility Settings
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar & Quick Stats */}
          <Card glass className="md:col-span-1 p-6 text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-brand-500/20">
              {user?.name.charAt(0) || "S"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user?.name || "Student"}</h2>
              <p className="text-xs text-slate-400 font-mono">{user?.email || "student@neuroflex.edu"}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Daily Streak</span>
                <p className="text-lg font-bold text-amber-400 font-mono flex items-center justify-center gap-1">
                  <Flame className="h-4 w-4" /> {user?.streakDays || 5}d
                </p>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Mastered</span>
                <p className="text-lg font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <Award className="h-4 w-4" /> {user?.topicsMastered || 12}
                </p>
              </div>
            </div>
          </Card>

          {/* Form */}
          <Card glass className="md:col-span-2 p-6 md:p-8 space-y-6">
            <CardTitle className="text-base font-bold text-white">Student Details</CardTitle>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={user?.email || "student@neuroflex.edu"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950/50 border border-slate-800/80 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                </div>
                <span className="text-[11px] text-slate-500">Email is linked to your student credentials.</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button type="submit" variant="primary" size="md" className="text-xs font-bold">
                  Save Changes
                </Button>

                {isSaved && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4" /> Profile updated successfully
                  </span>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

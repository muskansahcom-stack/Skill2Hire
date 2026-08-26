'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isLoading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [deniedMessage, setDeniedMessage] = useState<string>('');

  useEffect(() => {
    if (isLoading) return;

    if (!user && !role) {
      // Not logged in -> redirect to login
      router.push('/login');
      return;
    }

    const currentRole: UserRole = role || user?.role || 'student';
    
    // Check if role is allowed or if user is admin
    const isAllowed = allowedRoles.includes(currentRole) || currentRole === 'admin';

    if (isAllowed) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
      const correctDashboard = currentRole === 'student'
        ? '/student/dashboard'
        : currentRole === 'college'
        ? '/college/dashboard'
        : currentRole === 'company'
        ? '/recruiter/dashboard'
        : '/admin/dashboard';

      setDeniedMessage(`You don't have permission to access this dashboard. Redirecting to your ${currentRole.toUpperCase()} dashboard...`);

      const timer = setTimeout(() => {
        router.push(correctDashboard);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [user, role, isLoading, allowedRoles, router, pathname]);

  if (isLoading || authorized === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    const currentRole: UserRole = role || user?.role || 'student';
    const correctDashboard = currentRole === 'student'
      ? '/student/dashboard'
      : currentRole === 'college'
      ? '/college/dashboard'
      : currentRole === 'company'
      ? '/recruiter/dashboard'
      : '/admin/dashboard';

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
            <p className="text-xs text-rose-700 font-semibold">
              You don't have permission to access this dashboard.
            </p>
            <p className="text-xs text-slate-500 pt-2">
              Your account is registered with the <strong className="capitalize text-slate-900 font-bold">{currentRole}</strong> role.
            </p>
          </div>

          <button
            onClick={() => router.push(correctDashboard)}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <span>Go to My {currentRole.toUpperCase()} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

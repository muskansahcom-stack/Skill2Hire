'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, College, Company, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  profile: Student | College | Company | any | null;
  isLoading: boolean;
  login: (identifier: string, passwordOrOtp?: string, isOtp?: boolean) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  switchPersona: (role: UserRole, userId?: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_PERSONAS = [
  {
    role: 'student' as UserRole,
    userId: 'u_student_1',
    name: 'Alex Rivera',
    label: 'Student (Alex Rivera)',
    email: 'alex.rivera@student.skill2hire.com',
    phone: '+91 98765 43210',
    badge: 'B.S. CS 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Check skill gaps, learn Python/DSA, take assessments, view academic report, and get placed.'
  },
  {
    role: 'college' as UserRole,
    userId: 'u_col_1',
    name: 'Apex University',
    label: 'College (Apex University)',
    email: 'admin@apexuniversity.edu',
    phone: '+91 98765 43211',
    badge: 'Placement Cell',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    description: 'Monitor student academic transcripts, view skill heatmap, and track batch placements.'
  },
  {
    role: 'company' as UserRole,
    userId: 'u_comp_1',
    name: 'TechNova Recruiter',
    label: 'Company (TechNova)',
    email: 'recruiter@technova.com',
    phone: '+91 98765 43212',
    badge: 'Recruiter Hub',
    avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    description: 'Post jobs, search verified talent, audit academic transcripts, and hire candidates.'
  },
  {
    role: 'admin' as UserRole,
    userId: 'u_admin',
    name: 'Platform Admin',
    label: 'SuperAdmin',
    email: 'admin@skill2hire.com',
    phone: '+91 98765 43213',
    badge: 'System Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Global ecosystem analytics, moderation, transcript audits, and demand management.'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with student persona (Alex Rivera) for immediate interactive testing
  useEffect(() => {
    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('s2h_user_id') : null;
    const targetUserId = savedUserId || 'u_student_1';
    
    switchPersona('student', targetUserId).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const switchPersona = async (role: UserRole, userId?: string) => {
    setIsLoading(true);
    try {
      const targetId = userId || DEMO_PERSONAS.find(p => p.role === role)?.userId || 'u_student_1';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetId })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('s2h_user_id', data.user.id);
          localStorage.setItem('s2h_role', data.user.role);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to switch persona', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, passwordOrOtp?: string, isOtp = false) => {
    setIsLoading(true);
    try {
      const payload = isOtp
        ? { identifier, otp: passwordOrOtp || '123456' }
        : { identifier, password: passwordOrOtp || 'demo123' };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('s2h_user_id', data.user.id);
          localStorage.setItem('s2h_role', data.user.role);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, otp: string) => {
    return login(phone, otp, true);
  };

  const logout = () => {
    // Revert to demo student
    switchPersona('student', 'u_student_1');
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      if (user.role === 'student' && profile?.id) {
        const res = await fetch(`/api/students/${profile.id}`);
        const data = await res.json();
        if (data.student) setProfile(data.student);
      } else if (user.role === 'college' && profile?.id) {
        const res = await fetch(`/api/colleges/${profile.id}`);
        const data = await res.json();
        if (data.college) setProfile(data.college);
      }
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        profile,
        isLoading,
        login,
        loginWithPhone,
        switchPersona,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

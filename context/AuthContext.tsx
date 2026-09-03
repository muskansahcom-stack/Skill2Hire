'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, College, Company, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  profile: Student | College | Company | any | null;
  isLoading: boolean;
  login: (identifier: string, passwordOrOtp?: string, isOtp?: boolean) => Promise<{ success: boolean; error?: string; requireOtp?: boolean }>;
  loginWithPhone: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (emailPrompt?: string) => Promise<{ success: boolean; isNewUser?: boolean; email?: string; name?: string; error?: string }>;
  loginWithGmail: (gmailAddress: string) => Promise<{ success: boolean; isNewUser?: boolean; email?: string; name?: string; error?: string }>;
  switchPersona: (role: UserRole, userId?: string) => Promise<boolean>;
  setAuthSession: (user: User, profile?: any) => void;
  logout: () => Promise<void>;
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

  // Initialize with logged-in user session or active persona
  useEffect(() => {
    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('s2h_user_id') : null;
    const savedRole = typeof window !== 'undefined' ? (localStorage.getItem('s2h_role') as UserRole) : null;
    
    if (savedUserId) {
      // Fetch the actual authenticated user account from backend
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: savedUserId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            setProfile(data.profile);
          }
        })
        .catch(e => console.error('Session load error', e))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
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
      if (data.success && data.user) {
        setUser(data.user);
        setProfile(data.profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('s2h_user_id', data.user.id);
          localStorage.setItem('s2h_role', data.user.role);
        }
        return { success: true, user: data.user, profile: data.profile };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login error' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, otp: string) => {
    return login(phone, otp, true);
  };

  // Gmail / Google login — directly uses our app's identity API (no Supabase redirect)
  const loginWithGoogle = async (emailPrompt?: string) => {
    setIsLoading(true);
    try {
      if (!emailPrompt) {
        return { success: false, error: 'Please enter your Gmail address to continue.' };
      }
      return await loginWithGmail(emailPrompt);
    } catch (e: any) {
      return { success: false, error: e.message || 'Google authentication error' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGmail = async (gmailAddress: string) => {
    setIsLoading(true);
    try {
      const cleanEmail = gmailAddress.trim().toLowerCase();
      const cleanName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: cleanName,
          isGoogleAuth: true
        })
      });
      const data = await res.json();

      // User does not exist yet — send to signup with prefilled Gmail
      if (data.isNewUser || data.requireProfileCompletion) {
        return {
          success: false,
          isNewUser: true,
          email: data.googleEmail || cleanEmail,
          name: data.googleName || cleanName
        };
      }

      // Existing user — set session and proceed to dashboard
      if (data.success && data.user) {
        setUser(data.user);
        setProfile(data.profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('s2h_user_id', data.user.id);
          localStorage.setItem('s2h_role', data.user.role);
        }
        return { success: true, user: data.user, profile: data.profile };
      }

      return { success: false, error: data.error || 'This Google account is not registered. Please sign up first.' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Gmail login error' };
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthSession = (newUser: User, newProfile?: any) => {
    setUser(newUser);
    if (newProfile) setProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('s2h_user_id', newUser.id);
      localStorage.setItem('s2h_role', newUser.role);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('s2h_user_id');
        localStorage.removeItem('s2h_role');
      }
      setUser(null);
      setProfile(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
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
        loginWithGoogle,
        loginWithGmail,
        switchPersona,
        setAuthSession,
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

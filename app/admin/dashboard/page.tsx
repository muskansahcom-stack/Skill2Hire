'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  BookOpen,
  Award,
  TrendingUp,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Lock,
  LogOut,
  AlertTriangle,
  History,
  Sliders,
  Trash2,
  UserCheck,
  ShieldAlert,
  Save,
  Clock,
  KeyRound
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit' | 'settings'>('overview');
  const [statsData, setStatsData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    allowRegistration: true,
    requireOtpForLogin: false,
    maintenanceMode: false,
    systemNotice: ''
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Authenticate user & load initial data
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/admin/login');
        return;
      }
      loadAllAdminData();
    }
  }, [user, authLoading, router]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, logsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/audit-logs'),
        fetch('/api/admin/settings')
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        router.push('/admin/login');
        return;
      }

      const stats = await statsRes.json();
      const users = await usersRes.json();
      const logs = await logsRes.json();
      const settingsData = await settingsRes.json();

      if (stats.stats) setStatsData(stats);
      if (users.users) setUsersList(users.users);
      if (logs.logs) setAuditLogs(logs.logs);
      if (settingsData.settings) setSettings(settingsData.settings);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, newRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: `Role updated to ${newRole} successfully.` });
        // Refresh users list
        const refreshed = await fetch('/api/admin/users').then(r => r.json());
        if (refreshed.users) setUsersList(refreshed.users);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update role.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Network error updating role.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (targetUserId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) {
      return;
    }
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${targetUserId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: `User "${userName}" deleted successfully.` });
        setUsersList(prev => prev.filter(u => u.id !== targetUserId));
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to delete user.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Network error deleting user.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: 'Platform settings saved successfully.' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Network error saving settings.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Verifying root administrative credentials...</p>
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {};
  const topSkills = statsData?.topDemandedSkills || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 selection:bg-rose-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Skill2Hire SuperAdmin Root Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ecosystem Governance & Security Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Backend-enforced administrative control: user privileges, immutable audit trails, and platform telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
              title="Refresh all data"
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Logout</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/70 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/70 text-rose-300'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Platform Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Security Audit Logs ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Platform Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 8 Global KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Students</span>
                <span className="text-xl font-black text-white mt-1 block">{stats.totalStudents?.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Colleges</span>
                <span className="text-xl font-black text-indigo-400 mt-1 block">{stats.totalColleges}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Companies</span>
                <span className="text-xl font-black text-amber-400 mt-1 block">{stats.totalCompanies}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jobs</span>
                <span className="text-xl font-black text-rose-400 mt-1 block">{stats.totalJobs}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applications</span>
                <span className="text-xl font-black text-slate-200 mt-1 block">{stats.totalApplications?.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Courses</span>
                <span className="text-xl font-black text-slate-200 mt-1 block">{stats.totalCourses}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 shadow-sm">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Verified Skills</span>
                <span className="text-xl font-black text-emerald-300 mt-1 block">{stats.verifiedSkillsCount?.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Placements</span>
                <span className="text-xl font-black text-indigo-300 mt-1 block">{stats.placementsCount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Demanded Skills & Connected Entities */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Top Demanded Skills */}
              <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  <span>Most Demanded Platform Skills</span>
                </h2>
                <div className="space-y-2.5">
                  {topSkills.map((sk: any) => (
                    <div key={sk.skillName} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{sk.skillName}</span>
                        <span className="text-[10px] text-slate-400">({sk.category})</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-rose-400">{sk.demandPercent}% Demand</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Partners */}
              <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Connected Enterprise Partners & Universities</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {statsData?.companies?.slice(0, 6).map((c: any) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                      <span className="font-bold text-xs text-white block truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{c.industry}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose-400" />
                  <span>Registered Platform Users</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Strict administrative role management. Admin accounts cannot be downgraded or deleted via this table.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email / Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => {
                    const isAdmin = u.role === 'admin';
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{u.name}</span>
                            {isAdmin && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                                ROOT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono">
                          {u.email || u.phone}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : u.role === 'student'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : u.role === 'college'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {u.email_verified !== false ? 'Verified' : 'Unverified'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isAdmin ? (
                            <span className="text-[10px] text-slate-500 font-mono">Protected</span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                disabled={actionLoading}
                                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-2 py-1 text-xs outline-none focus:border-rose-500 disabled:opacity-50"
                              >
                                <option value="student">Student</option>
                                <option value="college">College</option>
                                <option value="company">Company</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                disabled={actionLoading}
                                className="p-1.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-400 hover:bg-red-900 transition-colors disabled:opacity-50"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-rose-400" />
                <span>Security Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically tracked administrative events, authentication actions, and authorization checks.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-rose-300">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {log.adminEmail || log.adminUserId || 'system'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {log.ipAddress}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {JSON.stringify(log.details || {})}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-sans text-xs">
                        No security audit logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm max-w-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                <span>Platform Governance Settings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure global platform policies, authentication rules, and maintenance modes.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="space-y-4">
                {/* Allow Registration */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                    className="mt-1 accent-rose-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">Allow Public Registration</span>
                    <span className="text-[11px] text-slate-400">
                      When enabled, students, colleges, and companies can register new accounts.
                    </span>
                  </div>
                </label>

                {/* Require OTP */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireOtpForLogin}
                    onChange={(e) => setSettings({ ...settings, requireOtpForLogin: e.target.checked })}
                    className="mt-1 accent-rose-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">Enforce OTP for Regular Users</span>
                    <span className="text-[11px] text-slate-400">
                      Enforce one-time password verification for standard candidate and recruiter logins.
                    </span>
                  </div>
                </label>

                {/* Maintenance Mode */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="mt-1 accent-rose-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">Maintenance Mode</span>
                    <span className="text-[11px] text-slate-400">
                      Place the public application in maintenance mode while preserving admin console access.
                    </span>
                  </div>
                </label>

                {/* System Notice */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    Platform Global Banner Notice
                  </label>
                  <input
                    type="text"
                    value={settings.systemNotice || ''}
                    onChange={(e) => setSettings({ ...settings, systemNotice: e.target.value })}
                    placeholder="e.g. Scheduled platform maintenance on Sunday 2:00 AM UTC"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Settings</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

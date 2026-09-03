'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import DemoWorkflowBanner from './DemoWorkflowBanner';
import Footer from './Footer';
import AiAdvisorWidget from './AiAdvisorWidget';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  // Check if we are on standalone auth/landing pages where a bare layout might be preferred, or keep unified SaaS layout
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. LEFT-SIDE VERTICAL SIDEBAR (Fixed / Sticky) */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. MAIN CONTENT AREA (Takes remaining available width) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64 sm:lg:pl-72'
        }`}
      >
        {/* Top Minimal Header (Search + Notifications + Profile) */}
        <TopHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isWorkflowOpen={false}
          setIsWorkflowOpen={() => {}}
        />

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating AI Career Advisor Assistant */}
      <AiAdvisorWidget />
    </div>
  );
}

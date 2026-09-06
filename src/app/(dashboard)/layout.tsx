'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex h-screen w-full bg-[#020b14] overflow-hidden text-slate-200 selection:bg-cyan-500 selection:text-black">
      {/* মোবাইল ব্যাকড্রপ ওভারলে (মোবাইলে সাইডবার খুললে পেছনের কন্টেন্ট আবছা থাকবে) */}
      {sidebarOpen && (
        <div
          role="presentation"
          onClick={handleCloseSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* সাইডবার */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* মূল বডি ও হেডার কন্টেন্ট */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
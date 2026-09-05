"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Server,
  Activity,
  CreditCard,
  Settings,
  Sparkles,
  X,
  Cpu,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: "Analytics Hub", href: "/", icon: LayoutDashboard },
  { name: "Gateway Traffic", href: "/clients", icon: Users },
  { name: "Model Provisioning", href: "/orders", icon: Server },
  { name: "Token Telemetry", href: "/transactions", icon: Activity },
  { name: "Settlements & Quotas", href: "/payments", icon: CreditCard },
  { name: "Security & API Keys", href: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1f2233] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-[#7367f0] flex items-center justify-center text-white shadow-md shadow-[#7367f0]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                  TechknowPointAI
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#7367f0]/20 text-[#7367f0] border border-[#7367f0]/30 font-semibold">
                  PRO
                </span>
              </div>
              
            </div>
          </Link>

          {/* Close button visible only on Mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Dashboards
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#7367f0] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Fleet Status Widget */}
      <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-[#272b40]/80 border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
            <Cpu className="w-3.5 h-3.5 text-[#7367f0]" />
            <span className="text-[11px]">Compute Fleet</span>
          </div>
          <span className="text-[10px] font-mono text-[#7367f0] font-semibold">
            88%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-2">
          <div className="h-full bg-[#7367f0] rounded-full w-[88%]" />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Active: 112/128</span>
          <span className="text-emerald-500 font-medium">Nominal</span>
        </div>
      </div>
    </aside>
  );
}
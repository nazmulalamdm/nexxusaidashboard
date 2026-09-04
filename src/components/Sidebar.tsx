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
  Cpu,
  Sparkles,
} from "lucide-react";

const navigationItems = [
  {
    name: "Analytics Hub",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "AI Clients & Mesh",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Model Provisioning",
    href: "/orders",
    icon: Server,
  },
  {
    name: "Token Telemetry",
    href: "/transactions",
    icon: Activity,
  },
  {
    name: "Settlements & Quotas",
    href: "/payments",
    icon: CreditCard,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-w-[16rem] max-w-[16rem] h-screen sticky top-0 bg-[#1f2233] border-r border-slate-800/90 flex flex-col justify-between shrink-0 select-none z-30">
      {/* Top Header & Navigation */}
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-1 pb-4 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-[#7367f0] flex items-center justify-center text-white shadow-md shadow-[#7367f0]/25 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100 tracking-tight">
                NexusAI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#7367f0]/20 text-[#7367f0] border border-[#7367f0]/30 font-semibold">
                PRO
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Enterprise Mesh</span>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1.5">
          <span className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Dashboards
          </span>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#7367f0] text-white shadow-sm shadow-[#7367f0]/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="leading-none">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Fleet Status Card (Proper Inside Margins) */}
      <div className="p-4 pt-0">
        <div className="p-3 rounded-xl bg-[#272b40] border border-slate-700/80 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#7367f0]" />
              <span className="font-medium text-slate-200">
                Compute Fleet
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-[#7367f0]">
              88%
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full rounded-full bg-[#7367f0] w-[88%]" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Active: 112/128</span>
            <span className="text-emerald-400 font-medium">Nominal</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
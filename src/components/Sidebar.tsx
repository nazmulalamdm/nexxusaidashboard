"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Cpu, Activity, CreditCard, Zap } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Analytics", href: "/", icon: LayoutGrid },
    { label: "AI Clients", href: "/clients", icon: Users },
    { label: "Order Tracking", href: "/orders", icon: Cpu },
    { label: "Transactions", href: "/transactions", icon: Activity },
    { label: "Payment History", href: "/payments", icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#2b2c40] border-r border-[#ebe9f1] dark:border-slate-700/60 flex flex-col justify-between h-screen fixed left-0 top-0 z-30 transition-colors">
      <div>
        <div className="h-16 flex items-center px-6 gap-3 border-b border-[#f3f2f7] dark:border-slate-700/60">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
            <Zap size={18} />
          </div>
          <div>
            <span className="font-extrabold text-base text-[#5d596c] dark:text-white tracking-tight">
              Nexus<span className="text-brand-500">AI</span>
            </span>
            <span className="block text-[9px] font-bold text-slate-400 -mt-1 tracking-wider uppercase">
              Next.js 15
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            Dashboards
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-md shadow-brand-500/25"
                    : "text-slate-500 dark:text-slate-400 hover:bg-brand-500/10 hover:text-brand-500"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
        <div className="flex items-center justify-between text-[10px] font-semibold mb-1.5">
          <span className="text-brand-500">Compute Fleet</span>
          <span className="text-slate-600 dark:text-slate-300">88%</span>
        </div>
        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="w-[88%] h-full bg-brand-500 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
}
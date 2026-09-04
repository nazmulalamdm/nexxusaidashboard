"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  BookOpen,
  ChevronDown,
  Command,
  User,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isDark = mounted ? theme === "dark" || resolvedTheme === "dark" : true;

  const handleSignOut = () => {
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#1f2233] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none transition-colors">
      {/* Left: Mobile Toggle & Responsive Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Field (Hidden on very narrow mobile, visible from sm) */}
        <div className="relative hidden sm:flex items-center w-full">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search telemetry, models..."
            className="w-full pl-9 pr-10 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#7367f0] transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-0.5 px-1 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 text-[10px] font-mono text-slate-400">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Docs Button (Hidden on Mobile) */}
        <a
          href="#docs"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Docs</span>
        </a>

        {/* Dark/Light Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7367f0] ring-2 ring-white dark:ring-[#1f2233]" />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1" />

        {/* User Pill Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="relative">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#7367f0]/20 border border-[#7367f0]/30 text-[#7367f0] flex items-center justify-center font-bold text-xs">
                TA
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1f2233]" />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                Tanvir Ahmed
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Founder & CEO
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white dark:bg-[#1f2233] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xl py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Tanvir Ahmed
                </p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  admin@nexusai.cloud
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Overview</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Security & API Keys</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
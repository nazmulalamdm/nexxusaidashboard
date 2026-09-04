"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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

export default function Topbar() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Prevent Next.js SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on clicking outside
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
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#1f2233] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20 select-none transition-colors">
      {/* Search Input with Shortcut Badge */}
      <div className="relative flex items-center w-72 sm:w-80">
        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search telemetry, models, tenants..."
          className="w-full pl-9 pr-12 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#7367f0] transition-colors"
        />
        <div className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 text-[10px] font-mono text-slate-400">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Right Action Items */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Documentation Link */}
        <a
          href="#docs"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Docs</span>
        </a>

        {/* Theme Toggle Button (Hydration-Safe) */}
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

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7367f0] ring-2 ring-white dark:ring-[#1f2233]" />
        </button>

        {/* Vertical Separator */}
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile Pill with Interactive Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg transition-colors text-left ${
              dropdownOpen
                ? "bg-slate-100 dark:bg-slate-800/80 ring-1 ring-slate-200 dark:ring-slate-700"
                : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-[#7367f0]/20 border border-[#7367f0]/30 text-[#7367f0] flex items-center justify-center font-bold text-xs">
                TA
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1f2233]" />
            </div>

            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                Tanvir Ahmed
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Founder & CEO
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 ml-0.5 hidden md:block transition-transform duration-200 ${
                dropdownOpen ? "rotate-180 text-slate-700 dark:text-slate-200" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1f2233] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* User Info Header */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Tanvir Ahmed
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  admin@nexusai.cloud
                </p>
              </div>

              {/* Navigation Options */}
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile Overview</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Security & API Keys</span>
                </Link>

                <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SSO Verification</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
                    Verified
                  </span>
                </div>
              </div>

              {/* Sign Out Action */}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left font-medium"
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
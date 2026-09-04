"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@nexusai.cloud");
  const [password, setPassword] = useState("••••••••••••");

  return (
    <div className="min-h-screen w-full flex bg-[#161822] text-slate-100 select-none">
      {/* Left Branding Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-[#1f2233] via-[#161822] to-[#12131b] border-r border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7367f0] flex items-center justify-center text-white shadow-lg shadow-[#7367f0]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">NexusAI</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#7367f0]/20 text-[#7367f0] border border-[#7367f0]/30 font-semibold">
            Enterprise Cloud
          </span>
        </div>

        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            High-Velocity Inference & GPU Multi-Tenant Fabric
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor real-time telemetry, orchestrate multi-cloud microservices,
            and enforce strict SLA latency targets across global nodes.
          </p>
          <div className="p-3.5 rounded-xl bg-[#272b40]/60 border border-slate-700/80 text-xs font-mono text-emerald-400 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Fabric: 100% Operational (us-east-1)</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          © 2026 NexusAI Orchestrator Systems Inc. All rights reserved.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Welcome back
            </h1>
            <p className="text-xs text-slate-400">
              Enter your enterprise credentials to access the orchestrator
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-[#272b40] border border-slate-700 text-slate-100 focus:outline-none focus:border-[#7367f0] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-[11px] text-[#7367f0] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-[#272b40] border border-slate-700 text-slate-100 focus:outline-none focus:border-[#7367f0] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#7367f0] hover:bg-[#685dd8] text-white text-xs font-medium transition-all shadow-md shadow-[#7367f0]/20"
            >
              <span>Sign In to Fabric</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don&apos;t have tenant access?{" "}
            <Link href="/" className="text-[#7367f0] hover:underline font-medium">
              Request Demo Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
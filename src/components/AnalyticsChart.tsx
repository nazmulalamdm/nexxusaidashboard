"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface TelemetryPoint {
  time: string;
  tokens: number;
}

const velocityData: TelemetryPoint[] = [
  { time: "00:00", tokens: 180 },
  { time: "04:00", tokens: 320 },
  { time: "08:00", tokens: 740 },
  { time: "12:00", tokens: 1120 },
  { time: "16:00", tokens: 890 },
  { time: "20:00", tokens: 1340 },
  { time: "23:59", tokens: 910 },
];

const liveStreamLogs = [
  {
    id: "run_8f910a",
    model: "claude-3-5-sonnet",
    promptTokens: "1,240",
    completionTokens: "380",
    latency: "240ms",
    status: "200 OK",
    burn: "$0.0084",
  },
  {
    id: "run_4c112d",
    model: "gpt-4o-mini",
    promptTokens: "820",
    completionTokens: "190",
    latency: "115ms",
    status: "200 OK",
    burn: "$0.0003",
  },
  {
    id: "run_99e31b",
    model: "deepseek-r1",
    promptTokens: "3,110",
    completionTokens: "740",
    latency: "680ms",
    status: "200 OK",
    burn: "$0.0039",
  },
  {
    id: "run_33a01c",
    model: "llama-3.1-70b",
    promptTokens: "450",
    completionTokens: "85",
    latency: "190ms",
    status: "200 OK",
    burn: "$0.0007",
  },
];

export default function AnalyticsDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Banner & Spend Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Hero Banner */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-indigo-600 to-slate-900 p-5 text-white shadow-xs border border-white/10">
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white/15 text-white backdrop-blur-xs border border-white/20 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Cluster Mesh Status
              </span>
              <h1 className="text-base font-semibold tracking-tight mt-2">
                Unified Inference Operations Hub
              </h1>
              <p className="text-xs text-white/80 max-w-xl mt-0.5">
                99.98% pipeline uptime achieved across active model gateways and edge orchestrators.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/15 font-mono">
              <div>
                <span className="text-[10px] text-white/70 uppercase tracking-wider block">
                  Gross Spend
                </span>
                <span className="text-sm font-bold">$48.9k</span>
              </div>
              <div>
                <span className="text-[10px] text-white/70 uppercase tracking-wider block">
                  Total Runs
                </span>
                <span className="text-sm font-bold">1.24M</span>
              </div>
              <div>
                <span className="text-[10px] text-white/70 uppercase tracking-wider block">
                  P95 Latency
                </span>
                <span className="text-sm font-bold">12ms</span>
              </div>
              <div>
                <span className="text-[10px] text-white/70 uppercase tracking-wider block">
                  Fleet Nodes
                </span>
                <span className="text-sm font-bold">128 Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Compute Spend Card */}
        <div className="rounded-xl bg-white dark:bg-[#1f2233] p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Compute Spend (MTD)
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                +14.2%
              </span>
            </div>
            <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
              $1,420.50
            </div>

            <div className="space-y-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">LLaMA 3 Dedicated Fleet</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  $840.00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">GPT-4 Turbo Gateway</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  $420.10
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Stable Diffusion Node</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  $160.40
                </span>
              </div>
            </div>
          </div>

          <a
            href="/billing"
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-brand-500 hover:underline flex items-center justify-between"
          >
            <span>Manage Cluster Instances</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Realtime Velocity Chart */}
      <div className="bg-white dark:bg-[#1f2233] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Inference Velocity & Token Throughput
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rolling aggregate token throughput (k/min) across all active instances
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Telemetry (5.2k req/m)
          </span>
        </div>

        <div className="h-52 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={velocityData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7367f0" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7367f0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800/80"
                />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
                          <p className="text-slate-400 mb-1">{label} UTC</p>
                          <p className="text-brand-500 font-semibold">
                            {payload[0].value}k tokens/min
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="#7367f0"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#velocityGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center font-mono text-xs text-slate-400">
              Ingesting stream data...
            </div>
          )}
        </div>
      </div>

      {/* Live Stream Telemetry Table (Fills Bottom Blank Space) */}
      <div className="bg-white dark:bg-[#1f2233] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Recent Stream Ingestion Telemetry
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Realtime Audit Engine
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 px-4">Run Identifier</th>
                <th className="py-2 px-4">Model Architecture</th>
                <th className="py-2 px-4 text-right">Prompt / Out</th>
                <th className="py-2 px-4 text-right">TTFT Latency</th>
                <th className="py-2 px-4 text-center">Status</th>
                <th className="py-2 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300">
              {liveStreamLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono text-[11px] font-medium text-brand-500">
                    {log.id}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    {log.model}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {log.promptTokens} / <span className="text-indigo-500">{log.completionTokens}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    {log.latency}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {log.burn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
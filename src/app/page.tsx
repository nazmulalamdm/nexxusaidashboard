"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
  Zap,
  Activity,
  Clock,
  ShieldCheck,
  Server,
  ArrowUpRight,
  TrendingUp,
  Terminal,
  CheckCircle2,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

const velocityData = [
  { time: "00:00", tokens: 210 },
  { time: "04:00", tokens: 380 },
  { time: "08:00", tokens: 840 },
  { time: "12:00", tokens: 1290 },
  { time: "16:00", tokens: 980 },
  { time: "20:00", tokens: 1450 },
  { time: "23:59", tokens: 1020 },
];

const modelWorkload = [
  { name: "Claude 3.5", shares: 42, color: "#7367f0" },
  { name: "GPT-4o", shares: 28, color: "#6366f1" },
  { name: "DeepSeek R1", shares: 18, color: "#10b981" },
  { name: "Llama 3.1", shares: 12, color: "#f59e0b" },
];

const livePipelines = [
  {
    id: "run_908a",
    tenant: "OpenAI Dev Lab",
    model: "GPT-4 Turbo Node",
    hardware: "8x H100 SXM5",
    throughput: "1.4k t/s",
    latency: "185ms",
    status: "Healthy",
  },
  {
    id: "run_771b",
    tenant: "NeuroFlow SaaS",
    model: "DeepSeek R1 Mesh",
    hardware: "4x A100 80GB",
    throughput: "920 t/s",
    latency: "340ms",
    status: "Healthy",
  },
  {
    id: "run_442c",
    tenant: "Cognitive Studio",
    model: "Whisper Voice Pipe",
    hardware: "2x L40S GPU",
    throughput: "410 t/s",
    latency: "95ms",
    status: "Provisioning",
  },
  {
    id: "run_119d",
    tenant: "Synthetix Media",
    model: "SDXL Core API",
    hardware: "8x A10G Fleet",
    throughput: "2.1k t/s",
    latency: "510ms",
    status: "Healthy",
  },
];

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const gridStroke = isDark ? "#33374e" : "#e2e8f0";
  const textStroke = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Top Banner: Fleet Pulse */}
      <div className="rounded-xl bg-gradient-to-r from-[#7367f0]/15 via-slate-50 to-white dark:via-[#272b40] dark:to-[#272b40] border border-slate-200 dark:border-slate-700/80 p-4 lg:p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Fleet Orchestrator Active
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">•</span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Region: us-east-1 (N. Virginia)
              </span>
            </div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Nexus Compute Fabric & Edge Gateway
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Autonomous workload scheduling, multi-region GPU routing, and tenant quota ingestion
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-md bg-white dark:bg-[#1f2233] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-xs">
              <Server className="w-3.5 h-3.5 text-[#7367f0]" />
              <span>128 / 128 Online</span>
            </div>
            <a
              href="/orders"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7367f0] hover:bg-[#685dd8] text-white rounded-md font-medium transition-all shadow-xs"
            >
              <span>Deploy</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>24h Token Velocity</span>
            <Zap className="w-3.5 h-3.5 text-[#7367f0]" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            6.18M <span className="text-xs font-normal text-slate-400">Tokens</span>
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% throughput</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Aggregated Burn (MTD)</span>
            <Activity className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            $8,520.40
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Projected: $11.2k ceiling
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>P95 Edge Latency</span>
            <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            182ms <span className="text-xs font-normal text-slate-400">TTFT</span>
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
            14ms below target
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Multi-Tenant Fleet</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#7367f0]" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            128 <span className="text-xs font-normal text-slate-400">Orgs</span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Zero SLA breach
          </div>
        </div>
      </div>

      {/* Dual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart with Theme-Adaptive Colors */}
        <div className="lg:col-span-2 bg-white dark:bg-[#272b40] p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Inference Velocity & Compute Ingestion
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Rolling 24-hour aggregate token pipeline across edge clusters
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded font-medium">
              Real-time Ingestion
            </span>
          </div>

          <div className="h-56 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={velocityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="velocityGradAdaptive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7367f0" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7367f0" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke={gridStroke}
                  />
                  <XAxis
                    dataKey="time"
                    stroke={textStroke}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={textStroke}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}k`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-[#1f2233] p-2.5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-xs font-mono">
                            <p className="text-slate-500 dark:text-slate-400 mb-0.5">{label} UTC</p>
                            <p className="text-[#7367f0] font-semibold">
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
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#velocityGradAdaptive)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-slate-400">
                Loading telemetry stream...
              </div>
            )}
          </div>
        </div>

        {/* Model Workload Allocation */}
        <div className="bg-white dark:bg-[#272b40] p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Workload by Model
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Allocation %</span>
            </div>

            <div className="space-y-3 mt-3">
              {modelWorkload.map((m) => (
                <div key={m.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {m.name}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {m.shares}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${m.shares}%`,
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Dominant: Claude 3.5</span>
            <a
              href="/clients"
              className="text-[#7367f0] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Mesh Rules</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Live Node Operations Table */}
      <div className="bg-white dark:bg-[#272b40] rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs transition-colors">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#7367f0]" />
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Active Compute Pods & Worker Fleet
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Auto-scaling: Enabled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/80">
                <th className="py-2.5 px-4">Worker Pod</th>
                <th className="py-2.5 px-4">Assigned Tenant</th>
                <th className="py-2.5 px-4">Serving Model</th>
                <th className="py-2.5 px-4">Accelerators</th>
                <th className="py-2.5 px-4 text-right">Throughput</th>
                <th className="py-2.5 px-4 text-right">P95 TTFT</th>
                <th className="py-2.5 px-4 text-center">Node State</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              {livePipelines.map((pod) => (
                <tr
                  key={pod.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono text-[11px] font-medium text-[#7367f0]">
                    {pod.id}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {pod.tenant}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {pod.model}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {pod.hardware}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-slate-800 dark:text-slate-200 font-medium">
                    {pod.throughput}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {pod.latency}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                        pod.status === "Healthy"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                          : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                      }`}
                    >
                      {pod.status === "Healthy" ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      )}
                      {pod.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
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
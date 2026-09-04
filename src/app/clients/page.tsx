"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Gauge,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TokenLedgerEntry {
  id: string;
  timestamp: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: 200 | 429 | 500;
  cost: string;
}

const ledgerMockData: TokenLedgerEntry[] = [
  {
    id: "req_88a9f12c",
    timestamp: "10:58:12.410",
    model: "claude-3-5-sonnet",
    promptTokens: 1420,
    completionTokens: 382,
    latencyMs: 480,
    status: 200,
    cost: "$0.0099",
  },
  {
    id: "req_77c4d31e",
    timestamp: "10:57:45.102",
    model: "gpt-4o-mini",
    promptTokens: 890,
    completionTokens: 154,
    latencyMs: 195,
    status: 200,
    cost: "$0.0002",
  },
  {
    id: "req_99b2e04a",
    timestamp: "10:56:19.824",
    model: "deepseek-r1",
    promptTokens: 3200,
    completionTokens: 810,
    latencyMs: 820,
    status: 200,
    cost: "$0.0041",
  },
  {
    id: "req_12f8e99b",
    timestamp: "10:55:03.015",
    model: "llama-3.1-70b",
    promptTokens: 412,
    completionTokens: 0,
    latencyMs: 42,
    status: 429,
    cost: "$0.0000",
  },
  {
    id: "req_55d1c87f",
    timestamp: "10:54:22.671",
    model: "gpt-4o",
    promptTokens: 2150,
    completionTokens: 940,
    latencyMs: 640,
    status: 200,
    cost: "$0.0201",
  },
  {
    id: "req_66a1b209",
    timestamp: "10:53:11.890",
    model: "mistral-large-2",
    promptTokens: 1100,
    completionTokens: 320,
    latencyMs: 310,
    status: 200,
    cost: "$0.0042",
  },
  {
    id: "req_44c8e715",
    timestamp: "10:52:05.114",
    model: "claude-3-haiku",
    promptTokens: 620,
    completionTokens: 110,
    latencyMs: 140,
    status: 200,
    cost: "$0.0002",
  },
  {
    id: "req_33d99f01",
    timestamp: "10:51:44.201",
    model: "gemini-1.5-pro",
    promptTokens: 4500,
    completionTokens: 1200,
    latencyMs: 910,
    status: 200,
    cost: "$0.0078",
  },
];

export default function TransactionsPage() {
  const [filterModel, setFilterModel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = ledgerMockData.filter((entry) => {
    const matchesSearch =
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel =
      filterModel === "all" || entry.model.includes(filterModel);
    return matchesSearch && matchesModel;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Token Ledger & Gateway Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable log of all inferred model calls, egress compute units, and execution latencies
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#272b40] text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-xs transition-colors">
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export JSONL</span>
        </button>
      </div>

      {/* 4 Gateway KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Mesh Throughput</span>
            <Activity className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            5.2k req / min
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            Optimal bandwidth
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Average P95 Latency</span>
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            218ms TTFT
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 font-mono">
            Direct edge routes
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Daily Ingestion Quota</span>
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            18.4M Tokens
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            +6.4% vs yesterday
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Gateway HTTP 200</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            99.88%
          </div>
          <div className="mt-1.5 text-[11px] text-amber-500 font-mono">
            0.12% 429 Limited
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search request ID or endpoint stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 w-full sm:w-72"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#272b40] text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Architectural Stacks</option>
            <option value="claude">Anthropic Claude</option>
            <option value="gpt">OpenAI Models</option>
            <option value="deepseek">DeepSeek Mesh</option>
            <option value="llama">Meta Llama</option>
          </select>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-[#272b40] rounded-lg border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-700/80">
                <th className="py-2.5 px-4">Request Log ID</th>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">Endpoint Stack</th>
                <th className="py-2.5 px-4 text-right">Prompt / Completion</th>
                <th className="py-2.5 px-4 text-right">TTFT Latency</th>
                <th className="py-2.5 px-4 text-center">Gateway Status</th>
                <th className="py-2.5 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              {filteredData.map((entry) => {
                const isSuccess = entry.status === 200;
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono text-[11px] font-medium text-brand-500">
                      {entry.id}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{entry.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
                        {entry.model}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[11px]">
                      <span className="text-slate-400">{entry.promptTokens}</span>
                      <span className="text-slate-300 dark:text-slate-600 mx-1">/</span>
                      <span className="text-indigo-400 font-medium">
                        {entry.completionTokens}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[11px]">
                      <span
                        className={
                          entry.latencyMs < 300
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }
                      >
                        {entry.latencyMs}ms
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                          isSuccess
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {isSuccess ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <AlertTriangle className="w-2.5 h-2.5" />
                        )}
                        {entry.status} {isSuccess ? "OK" : "Limit"}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {entry.cost}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Egress Dropped (Cluster 01)</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Showing 1 to {filteredData.length} of 4.2k logs</span>
            <div className="inline-flex items-center gap-1">
              <button
                disabled
                className="p-1 rounded border border-slate-200 dark:border-slate-700/80 disabled:opacity-40 text-slate-500"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
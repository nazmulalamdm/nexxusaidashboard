"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Terminal,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
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
    <div className="p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Token Ledger & Gateway Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable log of all inferred model calls, egress compute units, and execution latencies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-xs">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export JSONL</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search request ID or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
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
      <div className="bg-white dark:bg-[#1f2233] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-4">Request Log ID</th>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">Endpoint Stack</th>
                <th className="py-2.5 px-4 text-right">In / Out Tokens</th>
                <th className="py-2.5 px-4 text-right">TTFT Latency</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300">
              {filteredData.map((entry) => {
                const isSuccess = entry.status === 200;
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
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
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                        {entry.model}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[11px]">
                      <span className="text-slate-400">{entry.promptTokens}</span>
                      <span className="text-slate-300 dark:text-slate-600 mx-1">/</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {entry.completionTokens}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[11px]">
                      <span
                        className={
                          entry.latencyMs < 300
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }
                      >
                        {entry.latencyMs}ms
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
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
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {entry.cost}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Egress Dropped</span>
          </div>
          <span>Showing {filteredData.length} records</span>
        </div>
      </div>
    </div>
  );
}
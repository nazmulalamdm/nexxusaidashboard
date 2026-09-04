"use client";

import React, { useState } from "react";
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const tokenTransactions = [
  {
    id: "tx_9018bf",
    tenant: "Cognitive Studio",
    modelCluster: "Claude 3.5 Sonnet",
    type: "Ingestion Burn",
    tokens: "4.82M",
    cost: "$14.46",
    timestamp: "10:58:32 UTC",
    status: "Settled",
  },
  {
    id: "tx_8812ca",
    tenant: "OpenAI Dev Lab",
    modelCluster: "GPT-4o Dedicated",
    type: "Quota Pre-pay",
    tokens: "25.00M",
    cost: "$75.00",
    timestamp: "10:54:15 UTC",
    status: "Settled",
  },
  {
    id: "tx_7741ef",
    tenant: "NeuroFlow SaaS",
    modelCluster: "DeepSeek R1 Mesh",
    type: "Burst Compute",
    tokens: "1.25M",
    cost: "$2.50",
    timestamp: "10:50:02 UTC",
    status: "Processing",
  },
  {
    id: "tx_6650da",
    tenant: "Synthetix Media",
    modelCluster: "SDXL Ingestion",
    type: "Ingestion Burn",
    tokens: "850K",
    cost: "$6.80",
    timestamp: "10:45:19 UTC",
    status: "Settled",
  },
  {
    id: "tx_5549ac",
    tenant: "HyperScale Corp",
    modelCluster: "Llama 3.1 70B",
    type: "Over-Quota Egress",
    tokens: "3.10M",
    cost: "$9.30",
    timestamp: "10:39:40 UTC",
    status: "Settled",
  },
  {
    id: "tx_4418fa",
    tenant: "AutoAgent Systems",
    modelCluster: "Mistral Large 2",
    type: "Ingestion Burn",
    tokens: "920K",
    cost: "$2.76",
    timestamp: "10:32:11 UTC",
    status: "Settled",
  },
];

export default function TokenTelemetryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = tokenTransactions.filter(
    (tx) =>
      tx.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.modelCluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto select-none pt-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#272b40] p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Token Ingestion & Telemetry Settlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time multi-tenant token deductions, compute cost allocation, and ledger audit
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7367f0] hover:bg-[#685dd8] text-white rounded-md text-xs font-medium transition-all self-start sm:self-auto shadow-xs">
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* 3 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>24h Ingestion Burn</span>
            <Coins className="w-3.5 h-3.5 text-[#7367f0]" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            35.94M <span className="text-xs font-normal text-slate-400">Tokens</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            Directly mapped to compute pods
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Settled Ledger Value</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            $110.82
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Rolling hourly aggregate
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Mesh Pipeline Quota</span>
            <Layers className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            88.4% <span className="text-xs font-normal text-slate-400">Healthy</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            Zero dropouts across 128 pods
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transaction ID, tenant, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-[#7367f0]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-600 dark:text-slate-300">
            <Filter className="w-3 h-3 text-[#7367f0]" />
            <span>Filter Type</span>
          </button>
        </div>
      </div>

      {/* Distinct Token Transaction Ledger Table */}
      <div className="bg-white dark:bg-[#272b40] rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/80">
                <th className="py-2.5 px-4">Ledger ID</th>
                <th className="py-2.5 px-4">Organization / Tenant</th>
                <th className="py-2.5 px-4">Serving Architecture</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-right">Tokens Consumed</th>
                <th className="py-2.5 px-4 text-right">Cost (MTD)</th>
                <th className="py-2.5 px-4 text-center">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono text-[11px] font-medium text-[#7367f0]">
                    {item.id}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.tenant}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {item.modelCluster}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {item.type.includes("Burn") ? (
                        <ArrowDownLeft className="w-3 h-3 text-amber-500" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      )}
                      {item.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-slate-800 dark:text-slate-200 font-semibold">
                    {item.tokens}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-slate-800 dark:text-slate-200 font-bold">
                    {item.cost}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                        item.status === "Settled"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                          : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                      }`}
                    >
                      {item.status === "Settled" ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5 animate-pulse" />
                      )}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Distinct Pagination Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono text-[11px]">Showing 1 to 6 of 84 ledger entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
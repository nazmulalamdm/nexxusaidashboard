"use client";

import React, { useState } from "react";
import { Search, Filter, Play, Cpu, Layers, Terminal } from "lucide-react";
import { orders } from "@/data/mockData";

export default function DeploymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRuns = orders.filter(
    (order) =>
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Model Ingestion & Provisioning Runs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active serverless deployments, worker orchestration, and compute allocations
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-md text-xs font-medium transition-colors shadow-xs">
          <Play className="w-3 h-3 fill-current" />
          <span>Provision New Pipeline</span>
        </button>
      </div>

      {/* Control Bar (Search & Metrics) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search run ID, model, or tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded border border-slate-200 dark:border-slate-700/60">
            Active Runs: <strong className="text-slate-800 dark:text-slate-200">{filteredRuns.length}</strong>
          </span>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-white dark:bg-[#1f2233] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-4">Run ID</th>
                <th className="py-2.5 px-4">Assigned Tenant</th>
                <th className="py-2.5 px-4">Target Model Architecture</th>
                <th className="py-2.5 px-4">Triggered At</th>
                <th className="py-2.5 px-4 text-center">Cluster Status</th>
                <th className="py-2.5 px-4 text-right">Burn Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300">
              {filteredRuns.map((order) => {
                const statusLower = order.status.toLowerCase();
                const isReady = statusLower.includes("complete") || statusLower.includes("active");
                const isPending = statusLower.includes("process") || statusLower.includes("pending");

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono text-[11px] font-medium text-brand-500">
                      {order.id}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {order.client}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.model}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {order.date}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium inline-block border ${
                          isReady
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : isPending
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-right text-slate-800 dark:text-slate-200 font-semibold">
                      {order.amount}
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
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Cluster Dispatcher: Ready</span>
          </div>
          <span>Showing {filteredRuns.length} runs</span>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import {
  Key,
  Shield,
  Copy,
  Check,
  Plus,
  Trash2,
  Lock,
  Globe,
  RefreshCw,
  Sliders,
} from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  created: string;
  lastUsed: string;
  env: "Production" | "Staging";
}

const initialKeys: ApiKeyItem[] = [
  {
    id: "key_prod_901a",
    name: "Core Ingestion Engine",
    keyMasked: "nx_live_9a87f6...38c1",
    created: "2026-08-12",
    lastUsed: "2 mins ago",
    env: "Production",
  },
  {
    id: "key_dev_441b",
    name: "Fine-Tuning Worker Fleet",
    keyMasked: "nx_test_01f92e...77ab",
    created: "2026-08-28",
    lastUsed: "4 hours ago",
    env: "Staging",
  },
];

export default function SettingsPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1400px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Security & API Orchestration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your AI model inference secret tokens, webhooks, and rate limits
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const newKey: ApiKeyItem = {
              id: `key_${Date.now().toString().slice(-4)}`,
              name: "New Ephemeral Pipeline",
              keyMasked: `nx_live_${Math.random().toString(36).substring(2, 8)}...8a`,
              created: "Just now",
              lastUsed: "Never",
              env: "Production",
            };
            setKeys([newKey, ...keys]);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#7367f0] hover:bg-[#685dd8] text-white rounded-lg text-xs font-medium transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Secret Token</span>
        </button>
      </div>

      {/* Grid Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
            <Key className="w-4 h-4 text-[#7367f0]" />
            <span>Active Tokens</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
            {keys.length} / 10
          </div>
          <p className="text-[11px] text-slate-400">
            Encrypted with Ed25519 hardware enclave
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>SSO Enforced</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
            SAML 2.0
          </div>
          <p className="text-[11px] text-slate-400">
            Active via Okta Enterprise Gateway
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Global Ingestion Rate</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
            50,000 req/m
          </div>
          <p className="text-[11px] text-slate-400">Burst limit: 120,000 req/m</p>
        </div>
      </div>

      {/* API Key Table */}
      <div className="bg-white dark:bg-[#272b40] rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#7367f0]" />
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Secret API Keys
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Rotation Policy: 90 Days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-700/80">
                <th className="py-2.5 px-4">Token Label</th>
                <th className="py-2.5 px-4">Secret Key Mask</th>
                <th className="py-2.5 px-4">Environment</th>
                <th className="py-2.5 px-4">Created Date</th>
                <th className="py-2.5 px-4">Last Telemetry</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              {keys.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#7367f0]">
                    {item.keyMasked}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                        item.env === "Production"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {item.env}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {item.created}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {item.lastUsed}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.keyMasked)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
                        title="Copy Key"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevoke(item.id)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Revoke Token"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
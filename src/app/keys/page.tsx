'use client';

import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sliders, 
  RotateCw, 
  Lock, 
  AlertCircle,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  secret: string;
  environment: 'production' | 'staging' | 'development';
  rateLimitRpm: number;
  monthlySpendCap: number;
  currentSpend: number;
  allowedModels: string[];
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Mobile App Gateway Service',
    prefix: 'tk_live_94f8...',
    secret: 'tk_live_94f8b210c49e782a1d0f88e1a',
    environment: 'production',
    rateLimitRpm: 1200,
    monthlySpendCap: 500,
    currentSpend: 142.80,
    allowedModels: ['gpt-4o', 'claude-3-5-sonnet'],
    lastUsed: '2 minutes ago',
    createdAt: 'Jan 14, 2026',
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'Enterprise Batch Ingestion Cron',
    prefix: 'tk_live_83a1...',
    secret: 'tk_live_83a17e04f98129cc6b7a54a2',
    environment: 'production',
    rateLimitRpm: 4500,
    monthlySpendCap: 1500,
    currentSpend: 890.15,
    allowedModels: ['deepseek-r1', 'llama-3-1-70b'],
    lastUsed: 'Just now',
    createdAt: 'Feb 02, 2026',
    status: 'active'
  },
  {
    id: 'key-3',
    name: 'Staging Integration Sandbox',
    prefix: 'tk_test_12c9...',
    secret: 'tk_test_12c9ff45a892b31cd8001e3b',
    environment: 'staging',
    rateLimitRpm: 300,
    monthlySpendCap: 100,
    currentSpend: 18.40,
    allowedModels: ['gpt-4o', 'deepseek-r1'],
    lastUsed: '4 hours ago',
    createdAt: 'Aug 10, 2026',
    status: 'active'
  },
  {
    id: 'key-4',
    name: 'Legacy Microservice Token',
    prefix: 'tk_live_00d4...',
    secret: 'tk_live_00d481ab7612c0199f1100aa',
    environment: 'production',
    rateLimitRpm: 60,
    monthlySpendCap: 50,
    currentSpend: 49.90,
    allowedModels: ['gpt-4o'],
    lastUsed: '3 days ago',
    createdAt: 'Dec 01, 2025',
    status: 'revoked'
  }
];

export default function ApiKeysVaultPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newEnv, setNewEnv] = useState<'production' | 'staging' | 'development'>('production');
  const [newRpm, setNewRpm] = useState(600);
  const [newCap, setNewCap] = useState(250);
  const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHash = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    const prefixStr = newEnv === 'production' ? 'tk_live_' : 'tk_test_';
    const fullSecret = `${prefixStr}${randomHash}`;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: `${fullSecret.substring(0, 11)}...`,
      secret: fullSecret,
      environment: newEnv,
      rateLimitRpm: newRpm,
      monthlySpendCap: newCap,
      currentSpend: 0.00,
      allowedModels: ['gpt-4o', 'claude-3-5-sonnet', 'deepseek-r1'],
      lastUsed: 'Never',
      createdAt: 'Just now',
      status: 'active'
    };

    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setShowModal(false);
  };

  const handleRevoke = (id: string) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
  };

  const totalMonthlySpend = keys.reduce((acc, k) => acc + (k.status === 'active' ? k.currentSpend : 0), 0);
  const activeKeysCount = keys.filter(k => k.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-6 lg:p-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                API Key Vault & Rate Enclaves
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ed25519 Encrypted
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Provision programmatic authentication tokens, configure RPM velocity throttles, and set quota caps.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> Generate Secret Key
        </button>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Enclave Keys</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{activeKeysCount}</span>
            <span className="text-xs text-slate-500">/ {keys.length} total</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Gateway Spend MTD</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">${totalMonthlySpend.toFixed(2)}</span>
            <span className="text-xs text-slate-500">USD</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Throughput Enforcement</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-400">Sliding Window</span>
            <span className="text-xs text-slate-500">Redis</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Hardware Vault Status</span>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" /> HS-256 Validated
          </div>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="rounded-2xl bg-[#0D121F] border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" /> Provisioned Gateway Tokens
          </h2>
          <span className="text-xs text-slate-500 font-mono">Auto-rotates in 90 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#090D17]">
                <th className="py-3 px-6">Key Identifier</th>
                <th className="py-3 px-4">Environment</th>
                <th className="py-3 px-4">Secret Token</th>
                <th className="py-3 px-4">Rate Cap (RPM)</th>
                <th className="py-3 px-4">Budget Utilization</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {keys.map((k) => {
                const isRevealed = revealedKeyId === k.id;
                const spendPercentage = Math.min(100, Math.round((k.currentSpend / k.monthlySpendCap) * 100));

                return (
                  <tr key={k.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{k.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">Created: {k.createdAt} • Last: {k.lastUsed}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                        k.environment === 'production'
                          ? 'border-purple-500/30 text-purple-300 bg-purple-500/10'
                          : 'border-blue-500/30 text-blue-300 bg-blue-500/10'
                      }`}>
                        {k.environment}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#080B12] px-2 py-1 rounded border border-slate-800 text-slate-300 text-[11px]">
                          {isRevealed ? k.secret : k.prefix}
                        </span>
                        <button
                          onClick={() => setRevealedKeyId(isRevealed ? null : k.id)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          title={isRevealed ? 'Hide secret' : 'Reveal secret'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(k.id, k.secret)}
                          className="text-slate-500 hover:text-purple-400 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="text-slate-200 font-semibold">{k.rateLimitRpm}</span>
                      <span className="text-slate-500 text-[11px]"> req/min</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-300">${k.currentSpend.toFixed(2)}</span>
                          <span className="text-slate-500">${k.monthlySpendCap}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              spendPercentage > 85 ? 'bg-red-500' : spendPercentage > 50 ? 'bg-amber-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${spendPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {k.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          Revoked
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {k.status === 'active' ? (
                        <button
                          onClick={() => handleRevoke(k.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs transition-colors"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Disabled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate New Key */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D121F] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" /> Create API Secret Key
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Key Name / Consumer Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js Edge Client, Mobile App Backend"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Environment</label>
                  <select
                    value={newEnv}
                    onChange={(e) => setNewEnv(e.target.value as any)}
                    className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Rate Limit (RPM)</label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={newRpm}
                    onChange={(e) => setNewRpm(Number(e.target.value))}
                    className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Budget Cap ($ USD)</label>
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={newCap}
                  onChange={(e) => setNewCap(Number(e.target.value))}
                  className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>The full key secret will be hashed on your server. Make sure to copy the key immediately after creation.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md shadow-purple-600/20"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { 
  getApiKeys, 
  createApiKey, 
  toggleApiKeyStatus, 
  deleteApiKey, 
  ApiKeyItem 
} from '@/server/actions/keys';
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Power, 
  ShieldAlert, 
  Loader2,
  Lock,
  Gauge,
  ShieldCheck,
  Zap,
  Activity,
  X
} from 'lucide-react';

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [budgetCap, setBudgetCap] = useState('25.00');
  const [rateLimitRpm, setRateLimitRpm] = useState('120');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchKeys = async () => {
    setIsLoading(true);
    const data = await getApiKeys();
    setKeys(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createApiKey({
        name,
        budgetCap: parseFloat(budgetCap) || 10,
        rateLimitRpm: parseInt(rateLimitRpm, 10) || 60,
      });
      setNewlyCreatedKey(res.secretKey);
      setName('');
      fetchKeys();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate API Key';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, status: boolean) => {
    await toggleApiKeyStatus(id, status);
    fetchKeys();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this API Key? Any application using this key will immediately lose access.')) {
      await deleteApiKey(id);
      fetchKeys();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <Key className="w-6 h-6 text-cyan-400" />
              API Key Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SHA-256 Encrypted
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Manage client secret tokens, enforce budget caps, and monitor per-key rate limits for TechknowPointAI proxies.
          </p>
        </div>

        <button
          onClick={() => {
            setNewlyCreatedKey(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 self-start md:self-auto font-sans"
        >
          <Plus className="w-4 h-4" />
          Create New API Key
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Active Keys</span>
            <span className="text-xl font-bold font-mono text-white">
              {keys.filter((k) => k.is_active).length} / {keys.length} Active
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Access Gateway</span>
            <span className="text-xl font-bold font-mono text-cyan-300">Reverse Proxy</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] shadow-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Rate Throttling</span>
            <span className="text-xl font-bold font-mono text-purple-300">RPM Enforced</span>
          </div>
        </div>
      </div>

      {/* Keys Table Container */}
      <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-5 border-b border-[#0d3b66] flex items-center justify-between bg-[#041224]/80">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              AUTHENTICATION TOKENS
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {keys.length} keys total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#030e1d] text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 border-b border-[#0d3b66]">
              <tr>
                <th className="px-6 py-4">Key Name</th>
                <th className="px-6 py-4">Secret Prefix</th>
                <th className="px-6 py-4">Budget / Spend</th>
                <th className="px-6 py-4">Rate Limit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d3b66]/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-mono text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                    Loading security credentials...
                  </td>
                </tr>
              ) : keys.map((key) => {
                const percentSpent = Math.min(100, (key.current_spend / (key.monthly_budget_cap || 1)) * 100);
                return (
                  <tr key={key.id} className="hover:bg-[#0a2342]/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <div>
                          <div className="text-sm font-semibold text-white">{key.name}</div>
                          <div className="text-[11px] text-slate-500 font-sans">Created on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      <span className="px-2.5 py-1 rounded-lg bg-[#030e1d] border border-[#0e355c] text-cyan-300">
                        {key.key_prefix}••••••••••••
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5 w-44">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-cyan-400 font-semibold">${key.current_spend.toFixed(4)}</span>
                          <span className="text-slate-500">/ ${key.monthly_budget_cap.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#030e1d] rounded-full overflow-hidden border border-[#0e355c]/60">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentSpent > 85 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                            }`}
                            style={{ width: `${percentSpent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#041224] border border-[#0e355c]">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                        {key.rate_limit_rpm} RPM
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          key.is_active
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            : 'bg-[#08203d] text-slate-500 border border-[#0d3b66]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${key.is_active ? 'bg-cyan-400' : 'bg-slate-500'}`} />
                        {key.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(key.id, key.is_active)}
                        title={key.is_active ? 'Revoke Key' : 'Activate Key'}
                        className="p-2 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] border border-[#0d3b66] text-slate-400 hover:text-white transition-colors inline-flex"
                      >
                        <Power className={`w-3.5 h-3.5 ${key.is_active ? 'text-amber-400' : 'text-slate-500'}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(key.id)}
                        title="Delete Key"
                        className="p-2 rounded-xl bg-[#08203d] hover:bg-rose-950/60 border border-[#0d3b66] text-slate-400 hover:text-rose-400 transition-colors inline-flex"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && keys.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-sans text-xs">
                    No API keys created yet. Click &quot;Create New API Key&quot; to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#051427] border border-[#0e355c] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            {!newlyCreatedKey ? (
              <>
                <div className="flex items-center justify-between border-b border-[#0d3b66] pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white font-mono">CREATE API KEY</h2>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">Set name, monthly spend limit, and rate caps.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg bg-[#08203d] text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateKey} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-mono uppercase text-slate-400 mb-1.5">
                      Key Label / Application Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Production Mobile App"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono uppercase text-slate-400 mb-1.5">
                        Budget Cap ($ USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={budgetCap}
                        onChange={(e) => setBudgetCap(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-mono uppercase text-slate-400 mb-1.5">
                        Rate Limit (RPM)
                      </label>
                      <input
                        type="number"
                        required
                        value={rateLimitRpm}
                        onChange={(e) => setRateLimitRpm(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t border-[#0d3b66]">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] text-slate-300 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Generate Key
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Check className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-mono">KEY GENERATED SUCCESSFULLY</h2>
                    <p className="text-xs text-slate-400 font-sans">Save this key now. It will not be shown again.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300 font-sans leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>For security reasons, your secret key cannot be recovered after leaving this screen. Store it in a secure password manager or environment file.</span>
                </div>

                <div className="flex items-center gap-2 bg-[#030e1d] border border-[#0e355c] p-3 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={newlyCreatedKey}
                    className="bg-transparent font-mono text-xs text-cyan-300 outline-none flex-1 select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(newlyCreatedKey)}
                    className="p-2 bg-[#08203d] hover:bg-[#0a2a50] text-white rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewlyCreatedKey(null);
                  }}
                  className="w-full py-2.5 bg-[#08203d] hover:bg-[#0a2a50] text-white rounded-xl text-xs font-semibold transition-colors font-sans"
                >
                  I Have Secured My Key
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
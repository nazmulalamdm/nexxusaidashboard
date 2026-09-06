'use client';

import { useState, useEffect } from 'react';
import { 
  getGatewaySettings, 
  updateGlobalSettings, 
  updateProviderKey, 
  SettingsPayload, 
  GatewayGlobalSettings 
} from '@/server/actions/settings';
import { 
  Settings, 
  Key, 
  ShieldCheck, 
  Sliders, 
  Bell, 
  Radio, 
  Cpu, 
  Save, 
  Loader2, 
  Check, 
  Eye, 
  EyeOff, 
  Lock, 
  Globe, 
  RefreshCw,
  Zap,
  Layers
} from 'lucide-react';

export default function SettingsPage() {
  const [data, setData] = useState<SettingsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Global Config Form State
  const [defaultProvider, setDefaultProvider] = useState('groq');
  const [enableFallback, setEnableFallback] = useState(true);
  const [maxRetries, setMaxRetries] = useState(3);
  const [timeoutMs, setTimeoutMs] = useState(15000);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [alertPercent, setAlertPercent] = useState(85);
  const [strictSsl, setStrictSsl] = useState(true);

  // Provider Key Inputs
  const [activeProviderKey, setActiveProviderKey] = useState('');
  const [selectedProviderToUpdate, setSelectedProviderToUpdate] = useState('groq');
  const [keySaved, setKeySaved] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    const res = await getGatewaySettings();
    setData(res);
    setDefaultProvider(res.settings.defaultProvider);
    setEnableFallback(res.settings.enableFallbackRouting);
    setMaxRetries(res.settings.maxRetryAttempts);
    setTimeoutMs(res.settings.requestTimeoutMs);
    setWebhookUrl(res.settings.alertWebhookUrl);
    setAlertPercent(res.settings.alertThresholdPercent);
    setStrictSsl(res.settings.strictSslVerification);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updated: GatewayGlobalSettings = {
      defaultProvider,
      enableFallbackRouting: enableFallback,
      maxRetryAttempts: Number(maxRetries),
      requestTimeoutMs: Number(timeoutMs),
      alertWebhookUrl: webhookUrl,
      alertThresholdPercent: Number(alertPercent),
      strictSslVerification: strictSsl,
    };
    await updateGlobalSettings(updated);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProviderKey.trim()) return;
    await updateProviderKey(selectedProviderToUpdate, activeProviderKey);
    setKeySaved(true);
    setActiveProviderKey('');
    setTimeout(() => setKeySaved(false), 2000);
    loadSettings();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <Settings className="w-6 h-6 text-cyan-400" />
              GATEWAY CONTROL & POLICY SUITE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              CORE PROTOCOL V2
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Manage root LLM upstream credentials, automated failover routes, and edge alerting thresholds.
          </p>
        </div>

        <button
          onClick={handleSaveGlobal}
          disabled={isSaving}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 self-start md:self-auto"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saveSuccess ? 'CONFIG APPLIED!' : 'SAVE GATEWAY RULES'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Providers & Routing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upstream Provider Credentials Box */}
          <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] p-6 shadow-2xl backdrop-blur-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#0d3b66] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  UPSTREAM PROVIDER CREDENTIALS
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Vault Hashed</span>
            </div>

            {/* Provider List Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data?.providers.map((p) => (
                <div
                  key={p.provider}
                  className="p-3.5 rounded-xl bg-[#030e1d] border border-[#0e355c] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{p.name}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          p.isConfigured ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-600'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/80 block mt-1">
                      {p.latencyTier}
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] font-mono text-slate-400 truncate">
                    {p.isConfigured ? p.maskedKey : 'Not Connected'}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Provider Key Setter */}
            <form onSubmit={handleSaveKey} className="pt-2 border-t border-[#0d3b66]/60 flex flex-col sm:flex-row gap-2.5">
              <select
                value={selectedProviderToUpdate}
                onChange={(e) => setSelectedProviderToUpdate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#030e1d] border border-[#0e355c] text-xs font-mono text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="groq">Groq Cloud (Default)</option>
                <option value="openai">OpenAI API</option>
                <option value="anthropic">Anthropic Claude</option>
              </select>

              <input
                type="password"
                required
                placeholder="Enter secret provider API Key..."
                value={activeProviderKey}
                onChange={(e) => setActiveProviderKey(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-[#030e1d] border border-[#0e355c] text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#08203d] hover:bg-[#0a2a50] border border-[#0d3b66] text-white rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap"
              >
                {keySaved ? 'UPDATED!' : 'UPDATE KEY'}
              </button>
            </form>
          </div>

          {/* Fault Tolerance & Routing Engine */}
          <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] p-6 shadow-2xl backdrop-blur-2xl space-y-5">
            <div className="flex items-center gap-2 border-b border-[#0d3b66] pb-3">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                EDGE ROUTING & FAILOVER TOLERANCE
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default Primary */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="block text-slate-400 uppercase text-[10px]">Primary Routing Cluster</label>
                <select
                  value={defaultProvider}
                  onChange={(e) => setDefaultProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="groq">Groq LPU Fleet (Default Priority)</option>
                  <option value="openai">OpenAI Direct Socket</option>
                  <option value="anthropic">Anthropic Edge</option>
                </select>
              </div>

              {/* Max Retries */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="block text-slate-400 uppercase text-[10px]">Retry Attempts On 5xx Fault</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Timeout */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="block text-slate-400 uppercase text-[10px]">Socket Timeout (Milliseconds)</label>
                <input
                  type="number"
                  step={1000}
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Fallback Toggle Card */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#030e1d] border border-[#0e355c]">
                <div>
                  <span className="text-xs font-mono text-white block">Auto Fallback</span>
                  <span className="text-[10px] text-slate-400 font-sans">Switch route on downtime</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableFallback(!enableFallback)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    enableFallback ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      enableFallback ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Telemetry Webhook & Security */}
        <div className="space-y-6">
          {/* Edge Notification Webhook */}
          <div className="rounded-3xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  TELEMETRY ALERTS
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">Out-of-band incident dispatches</p>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">Alert Webhook Endpoint</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Quota Alert Threshold</span>
                  <span className="text-cyan-400 font-bold">{alertPercent}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={alertPercent}
                  onChange={(e) => setAlertPercent(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-[#030e1d] rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Security Node Protocol */}
          <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">SECURITY PROTOCOL</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-2 border-t border-[#0e355c]/60">
              <span>Strict TLS 1.3 Handshake</span>
              <span className="text-emerald-400">ENFORCED</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>CORS Policy Mesh</span>
              <span className="text-cyan-400">RESTRICTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDashboardMetrics } from '@/server/actions/analytics';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { 
  Activity, 
  DollarSign, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  Terminal,
  Zap,
  Radio,
  Layers
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // ১. ড্যাশবোর্ড সার্ভার-সাইড প্রোটেকশন চেক
  const cookieStore = await cookies();
  const token = cookieStore.get('tp_auth_token')?.value;

  if (!token) {
    redirect('/login?callbackUrl=/overview');
  }

  // ২. লগইন করা ইউজারের প্রোফাইল সেফ পার্সিং (ক্র্যাশ-প্রুফ)
  const profileRaw = cookieStore.get('tp_user_profile')?.value;
  let user = { name: 'Operator', email: '' };

  if (profileRaw) {
    try {
      user = JSON.parse(decodeURIComponent(profileRaw));
    } catch {
      user = { name: 'Operator', email: '' };
    }
  }

  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner & Mesh Status with Dynamic User Name */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <Terminal className="w-6 h-6 text-cyan-400" />
              OPERATOR: <span className="text-cyan-400 uppercase">{user.name}</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SYNAPSE MESH ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Real-time proxy telemetry, token expenditure metrics, and low-latency edge logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#06182e] border border-[#0e355c] text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Groq Direct Acceleration
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spend */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] hover:border-cyan-500/50 transition-all duration-200 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">TOTAL SPEND</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              ${metrics.totalCostUsd.toFixed(6)}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-cyan-400/80">
              <span>● Micro-settled</span>
              <span className="text-slate-600">/</span>
              <span>Groq Cloud Tier</span>
            </div>
          </div>
        </div>

        {/* Total Inferences */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] hover:border-cyan-500/50 transition-all duration-200 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">TOTAL INFERENCES</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {metrics.totalRequests.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-blue-400/80">
              <span>● 100% Routed</span>
              <span className="text-slate-600">/</span>
              <span>Last 30 Days</span>
            </div>
          </div>
        </div>

        {/* Latency (TTFT) */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] hover:border-cyan-500/50 transition-all duration-200 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">LATENCY (TTFT)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {metrics.avgLatencyMs} <span className="text-xs font-mono font-normal text-slate-400">ms</span>
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-amber-400/80">
              <span>● Low-Jitter</span>
              <span className="text-slate-600">/</span>
              <span>Direct Socket</span>
            </div>
          </div>
        </div>

        {/* Reliability Rate */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] hover:border-cyan-500/50 transition-all duration-200 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">RELIABILITY RATE</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {metrics.successRate}%
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-emerald-400/80">
              <span>● HTTP 200 Mesh</span>
              <span className="text-slate-600">/</span>
              <span>Zero Drop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Volumetric Trend Charts Container */}
      <div className="p-6 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#0d3b66]/60 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Traffic &amp; Cost Volumetrics
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Dynamic aggregate inference trendline across active client keys
            </p>
          </div>
        </div>
        <AnalyticsCharts data={metrics.chartData} />
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-5 border-b border-[#0d3b66] flex items-center justify-between bg-[#041224]/80">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              RECENT GATEWAY INFERENCE LOGS
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Live Buffer
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#030e1d] text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 border-b border-[#0d3b66]">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Model Engine</th>
                <th className="px-6 py-3.5">Token In/Out</th>
                <th className="px-6 py-3.5">Latency</th>
                <th className="px-6 py-3.5">Cost</th>
                <th className="px-6 py-3.5">Status Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d3b66]/60">
              {metrics.recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0a2342]/40 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#041224] border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.1)]">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      {log.model}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">
                    <span className="text-slate-400">{log.inputTokens}</span>
                    <span className="text-cyan-500 mx-1.5">/</span>
                    <span className="text-white font-bold">{log.outputTokens}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {log.latencyMs}ms
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-cyan-400 font-semibold">
                    ${log.costUsd.toFixed(6)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                        log.statusCode >= 200 && log.statusCode < 300
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {log.statusCode} OK
                    </span>
                  </td>
                </tr>
              ))}
              {metrics.recentLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 font-mono text-xs">
                    No inference transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
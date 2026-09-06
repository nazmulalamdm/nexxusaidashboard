import { getGatewayTrafficMetrics } from '@/server/actions/traffic';
import { 
  Activity, 
  Cpu, 
  Radio, 
  Zap, 
  ArrowUpRight, 
  ShieldAlert, 
  Clock, 
  Layers, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GatewayTrafficPage() {
  const data = await getGatewayTrafficMetrics();

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              GATEWAY TRAFFIC DISPATCHER
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              REAL-TIME LOAD
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Monitor per-model reverse-proxy routing distributions, edge concurrency, and payload fault margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#06182e] border border-[#0e355c] text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Active Route Mesh: {data.activeRoutes} Engines
          </div>
        </div>
      </div>

      {/* Real-time Dispatch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">INBOUND SAMPLING</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{data.totalInbound} Calls</p>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">Analyzed buffer window</span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">PEAK CONCURRENCY</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{data.peakRpm} RPM</p>
          <span className="text-[11px] font-mono text-amber-400/80 mt-1 block">Dynamic threshold</span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">ANOMALY BUFFER</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{data.recentErrors.length} Exceptions</p>
          <span className="text-[11px] font-mono text-rose-400/80 mt-1 block">4xx / 5xx error events</span>
        </div>
      </div>

      {/* Model Route Distribution Grid */}
      <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-5 border-b border-[#0d3b66] flex items-center justify-between bg-[#041224]/80">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              MODEL INFERENCE ROUTING BREAKDOWN
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Load Weighted</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#030e1d] text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 border-b border-[#0d3b66]">
              <tr>
                <th className="px-6 py-4">Target Model Route</th>
                <th className="px-6 py-4">Total Requests</th>
                <th className="px-6 py-4">Token Volume</th>
                <th className="px-6 py-4">Avg Latency</th>
                <th className="px-6 py-4">Status Distribution (2xx / 4xx / 5xx)</th>
                <th className="px-6 py-4">Fault Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d3b66]/60 font-mono text-xs">
              {data.modelsTraffic.map((item) => (
                <tr key={item.model} className="hover:bg-[#0a2342]/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {item.model}
                  </td>
                  <td className="px-6 py-4 text-slate-200">{item.totalRequests}</td>
                  <td className="px-6 py-4 text-cyan-300">{item.totalTokens.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">{item.avgLatencyMs} ms</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-emerald-400">{item.status2xx} OK</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-amber-400">{item.status4xx} 4xx</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-rose-400">{item.status5xx} 5xx</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.errorRate === 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.errorRate}%
                    </span>
                  </td>
                </tr>
              ))}
              {data.modelsTraffic.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No active routing telemetry logs detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly / Failed Request Buffer */}
      <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-5 border-b border-[#0d3b66] flex items-center justify-between bg-[#041224]/80">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              RECENT ROUTING ANOMALIES & EXCEPTION LOGS
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#030e1d] text-[10px] uppercase font-mono tracking-widest text-rose-400/80 border-b border-[#0d3b66]">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Failing Route</th>
                <th className="px-6 py-3.5">HTTP Status</th>
                <th className="px-6 py-3.5">Elapsed Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d3b66]/60 font-mono text-xs">
              {data.recentErrors.map((err) => (
                <tr key={err.id} className="hover:bg-rose-950/20 transition-colors">
                  <td className="px-6 py-3.5 text-slate-400">
                    {new Date(err.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-3.5 text-white">{err.model}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                      HTTP {err.statusCode}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">{err.latencyMs} ms</td>
                </tr>
              ))}
              {data.recentErrors.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-emerald-400/80 text-xs">
                    Clean edge state: zero exception anomalies in current telemetry window.
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
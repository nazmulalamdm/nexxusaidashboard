import { orders } from "@/data/mockData";
import Link from "next/link";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-5">
      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-xl p-5 text-white shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="bg-white/20 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              AI Engine Status
            </span>
            <h2 className="text-xl font-bold mt-2">Startup Operations Console</h2>
            <p className="text-white/80 text-[11px] mt-0.5 max-w-md">
              99.98% cluster efficiency achieved across all active compute nodes.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/15 relative z-10">
            <div>
              <p className="text-[9px] text-white/70 uppercase">Revenue</p>
              <p className="text-lg font-extrabold mt-0.5">$48.9k</p>
            </div>
            <div>
              <p className="text-[9px] text-white/70 uppercase">Inferences</p>
              <p className="text-lg font-extrabold mt-0.5">1.2M</p>
            </div>
            <div>
              <p className="text-[9px] text-white/70 uppercase">Latency</p>
              <p className="text-lg font-extrabold mt-0.5">12ms</p>
            </div>
            <div>
              <p className="text-[9px] text-white/70 uppercase">Nodes</p>
              <p className="text-lg font-extrabold mt-0.5">128</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-[#2b2c40] rounded-xl p-5 border border-[#ebe9f1] dark:border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Compute Spend</p>
              <h3 className="text-xl font-extrabold text-[#5d596c] dark:text-white mt-0.5">$1,420.50</h3>
            </div>
            <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">+14.2%</span>
          </div>

          <div className="space-y-2 my-3">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">LLaMA 3 Dedicated</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">$840.00</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">GPT-4 Turbo Proxy</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">$420.10</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Stable Diffusion Node</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">$160.40</span>
            </div>
          </div>

          <Link href="/orders" className="w-full text-center py-2 bg-brand-500/10 text-brand-500 font-bold text-[10px] rounded-lg hover:bg-brand-500 hover:text-white transition-all">
            Manage Instances →
          </Link>
        </div>
      </div>

      {/* Analytics Realtime Chart */}
      <AnalyticsChart />

      {/* 10px Font Table */}
      <div className="bg-white dark:bg-[#2b2c40] rounded-xl border border-[#ebe9f1] dark:border-slate-700/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#5d596c] dark:text-white">Live Deployments Tracker</h3>
          <Link href="/orders" className="text-[10px] font-semibold text-brand-500 hover:underline">View All Activity</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-data">
            <thead className="text-[9px] uppercase tracking-wider bg-slate-50/80 dark:bg-[#1f2233]/60 text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Client</th>
                <th className="py-2.5 px-4">Target Model</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-brand-500">{order.id}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-200">{order.client}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{order.model}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 inline-block">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-700 dark:text-slate-200 text-right">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
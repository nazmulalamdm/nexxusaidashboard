import { orders } from "@/data/mockData";

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#5d596c] dark:text-white">Order Tracking</h1>
          <p className="text-xs text-slate-400">Manage compute orders and deployed AI instances</p>
        </div>
        <button className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-medium transition-all shadow-sm shadow-brand-500/30">
          + New Instance
        </button>
      </div>

      <div className="bg-white dark:bg-[#2b2c40] rounded-xl border border-[#ebe9f1] dark:border-slate-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-data">
            <thead className="text-[9px] uppercase tracking-wider bg-slate-50/80 dark:bg-[#1f2233]/60 text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Client</th>
                <th className="py-2.5 px-4">Target Model</th>
                <th className="py-2.5 px-4">Date</th>
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
                  <td className="py-2.5 px-4 text-slate-400">{order.date}</td>
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
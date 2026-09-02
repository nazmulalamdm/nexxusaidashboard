import { clients } from "@/data/mockData";

export default function ClientsPage() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-lg font-bold text-[#5d596c] dark:text-white">AI Clients</h1>
        <p className="text-xs text-slate-400">Enterprise accounts & API quota usage</p>
      </div>

      <div className="bg-white dark:bg-[#2b2c40] rounded-xl border border-[#ebe9f1] dark:border-slate-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-data">
            <thead className="text-[9px] uppercase tracking-wider bg-slate-50/80 dark:bg-[#1f2233]/60 text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4">Client ID</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Plan</th>
                <th className="py-2.5 px-4">Token Consumption</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-brand-500">{c.id}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{c.plan}</td>
                  <td className="py-2.5 px-4 font-mono">{c.creditsUsed}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold border bg-indigo-500/10 text-indigo-500 border-indigo-500/20 inline-block">
                      {c.status}
                    </span>
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
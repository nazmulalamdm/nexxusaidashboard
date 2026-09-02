export default function TransactionsPage() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-lg font-bold text-[#5d596c] dark:text-white">Transactions</h1>
        <p className="text-xs text-slate-400">Live compute token logs and API ledger</p>
      </div>
      <div className="p-8 text-center bg-white dark:bg-[#2b2c40] rounded-xl border border-[#ebe9f1] dark:border-slate-700/60 text-slate-400 text-xs">
        Real-time API gateway ledger is active. No pending transactions.
      </div>
    </div>
  );
}
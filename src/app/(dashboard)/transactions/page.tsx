'use client';

import { useState, useEffect } from 'react';
import { 
  getTransactionsLedger, 
  TransactionsSummary, 
  TransactionRecord, 
  TransactionType 
} from '@/server/actions/transactions';
import { 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Coins, 
  Cpu, 
  Filter,
  Layers,
  Receipt
} from 'lucide-react';

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const fetchLedger = async () => {
    setIsLoading(true);
    const res = await getTransactionsLedger();
    setData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const filteredTransactions = data?.transactions.filter((tx) => {
    const matchesSearch = tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tx.modelRoute && tx.modelRoute.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'ALL' || tx.type === selectedType;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <Receipt className="w-6 h-6 text-cyan-400" />
              FINANCIAL LEDGER & TRANSACTIONS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              AUDITED MICRO-SETTLEMENTS
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Immutable settlement stream of inference compute micro-debits, escrow deposits, and fee adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={fetchLedger}
            title="Refresh Ledger"
            className="p-2.5 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] border border-[#0d3b66] text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => alert('Exporting full ledger audit (CSV)...')}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 font-mono"
          >
            <Download className="w-4 h-4" />
            EXPORT LEDGER
          </button>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Escrow */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">ACTIVE ESCROW POOL</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-white font-mono tracking-tight">
              ${data?.availableEscrowUsd.toFixed(2) || '0.00'}
            </p>
            <span className="text-[11px] font-mono text-cyan-400 mt-1 block">
              ● Guaranteed compute liquidity
            </span>
          </div>
        </div>

        {/* Gross Audited Volume */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">TOTAL TRANSACTION VOLUME</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-white font-mono tracking-tight">
              ${data?.grossVolumeUsd.toFixed(4) || '0.0000'}
            </p>
            <span className="text-[11px] font-mono text-slate-400 mt-1 block">
              Processed lifetime ledger
            </span>
          </div>
        </div>

        {/* Micro-Settled Calls */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">SETTLED INFERENCES</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-white font-mono tracking-tight">
              {data?.totalSettledInferences || 0}
            </p>
            <span className="text-[11px] font-mono text-purple-300 mt-1 block">
              Direct sub-cent settlements
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Omni Search Bar */}
      <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 w-full sm:w-80 px-3.5 py-2 rounded-xl bg-[#030e1d] border border-[#0e355c] focus-within:border-cyan-500 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tx hash, model, note..."
            className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder-slate-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto font-mono text-xs">
          {['ALL', 'INFERENCE_DEBIT', 'WALLET_TOPUP', 'REFUND_CREDIT'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#08203d]'
              }`}
            >
              {type === 'ALL' ? 'ALL LEDGERS' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Stream Table */}
      <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-5 border-b border-[#0d3b66] flex items-center justify-between bg-[#041224]/80">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              REAL-TIME TRANSACTION STREAM
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Showing {filteredTransactions.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#030e1d] text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 border-b border-[#0d3b66]">
              <tr>
                <th className="px-6 py-4">Tx Hash & Event</th>
                <th className="px-6 py-4">Classification</th>
                <th className="px-6 py-4">Tokens Processed</th>
                <th className="px-6 py-4">Debit / Credit (USD)</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d3b66]/60 font-mono text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-mono text-xs">
                    Replaying cryptographic settlement ledger...
                  </td>
                </tr>
              ) : filteredTransactions.map((tx) => {
                const isDebit = tx.type === 'INFERENCE_DEBIT';
                const isTopup = tx.type === 'WALLET_TOPUP';

                return (
                  <tr key={tx.id} className="hover:bg-[#0a2342]/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#030e1d] border border-[#0e355c] text-cyan-400 text-[11px]">
                          {tx.txHash}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans mt-1">
                        {tx.description}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isTopup
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isDebit
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isTopup ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {tx.tokensProcessed ? (
                        <span className="text-cyan-300">{tx.tokensProcessed.toLocaleString()} Tokens</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-bold">
                      <span className={isTopup ? 'text-emerald-400' : isDebit ? 'text-cyan-400' : 'text-slate-400'}>
                        {isTopup ? `+$${tx.amountUsd.toFixed(2)}` : `-$${tx.amountUsd.toFixed(6)}`}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {new Date(tx.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SETTLED
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-sans text-xs">
                    No transactions matching your criteria found in ledger.
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
'use client';

import { useState, useEffect } from 'react';
import { getBillingAndOrders, createTopUpOrder, BillingSummary, OrderItem } from '@/server/actions/orders';
import { 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  Receipt, 
  Layers, 
  Zap, 
  Coins, 
  ShieldCheck, 
  Sparkles,
  Download,
  Loader2,
  X
} from 'lucide-react';

const TOPUP_TIERS = [
  { credits: 5000000, label: '5M Tokens', usd: 25, popular: false },
  { credits: 15000000, label: '15M Tokens', usd: 65, popular: true },
  { credits: 50000000, label: '50M Tokens', usd: 200, popular: false },
  { credits: 150000000, label: '150M Tokens', usd: 550, popular: false },
];

export default function OrdersPage() {
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(TOPUP_TIERS[1]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getBillingAndOrders();
    setBilling(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTopUpOrder({
        creditsAmount: selectedTier.credits,
        totalUsd: selectedTier.usd,
        paymentMethod,
      });
      setIsModalOpen(false);
      fetchOrders();
    } catch {
      alert('Payment processing failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <CreditCard className="w-6 h-6 text-cyan-400" />
              ORDERS & BILLING SETTLEMENTS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              PREPAID WALLET
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Refill token credits, manage payment methods, and review automated gateway settlement invoices.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 self-start md:self-auto font-sans"
        >
          <Plus className="w-4 h-4" />
          Top Up Balance
        </button>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">CREDIT BALANCE</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-white font-mono tracking-tight">
              ${billing?.walletBalance.toFixed(2) || '0.00'}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-cyan-400">
              <span>● Auto-refill disabled</span>
            </div>
          </div>
        </div>

        {/* All-Time Spend */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">TOTAL SPENT</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-white font-mono tracking-tight">
              ${billing?.totalSpentAllTime.toFixed(2) || '0.00'}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-slate-400">
              <span>Across all model inferences</span>
            </div>
          </div>
        </div>

        {/* Soft Budget Cap */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">MONTHLY CAP</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-white font-mono tracking-tight">
              ${billing?.monthlySpendLimit.toFixed(2) || '1,000.00'}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-purple-300">
              <span>Hard limit stop at 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders & Settlements History Table */}
      <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-5 border-b border-[#0d3b66] flex items-center justify-between bg-[#041224]/80">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              TRANSACTION SETTLEMENT HISTORY
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {billing?.orders.length || 0} Invoices Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#030e1d] text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 border-b border-[#0d3b66]">
              <tr>
                <th className="px-6 py-4">Invoice / Order ID</th>
                <th className="px-6 py-4">Token Credits Added</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Payment Channel</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0d3b66]/60 font-mono text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-mono text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                    Fetching settlement ledgers...
                  </td>
                </tr>
              ) : (
                billing?.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#0a2342]/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-cyan-300">
                      {(order.creditsAmount / 1000000).toFixed(1)}M Tokens
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ${order.totalUsd.toFixed(2)} USD
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-sans">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        PAID
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        title="Download Invoice PDF"
                        className="p-1.5 rounded-lg bg-[#08203d] hover:bg-[#0a2a50] border border-[#0d3b66] text-slate-300 hover:text-cyan-400 transition-colors inline-flex"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-Up Balance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#051427] border border-[#0e355c] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#0d3b66] pb-3">
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  RECHARGE TOKEN BALANCE
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Choose token allocation volume for your TechknowPointAI gateway.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#08203d] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-5">
              {/* Packages Grid */}
              <div className="grid grid-cols-2 gap-3">
                {TOPUP_TIERS.map((tier) => (
                  <div
                    key={tier.label}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedTier.label === tier.label
                        ? 'bg-cyan-500/15 border-cyan-500 ring-1 ring-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'bg-[#030e1d] border-[#0e355c] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-white">{tier.label}</span>
                      {tier.popular && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-lg font-mono font-bold text-cyan-400">
                      ${tier.usd} <span className="text-xs text-slate-500 font-sans">USD</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Channel */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-400">PAYMENT METHOD</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white text-xs font-sans focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Credit Card (Stripe)">Credit Card (Stripe Instant Checkout)</option>
                  <option value="Crypto (USDC Polygon)">Crypto Settlement (USDC / Polygon)</option>
                  <option value="Bank Wire / Invoicing">Corporate Wire Transfer (ACH / SEPA)</option>
                </select>
              </div>

              {/* Checkout Summary */}
              <div className="p-3.5 rounded-xl bg-[#030e1d] border border-[#0e355c] flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Total Billed Today:</span>
                <span className="text-white font-bold text-base">${selectedTier.usd}.00 USD</span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  PROCEED TO SETTLEMENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
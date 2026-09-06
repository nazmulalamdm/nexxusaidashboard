'use client';

import { useState, useEffect } from 'react';
import { 
  getPaymentsData, 
  updateAutoRecharge, 
  setDefaultPaymentMethod, 
  removePaymentMethod,
  PaymentsPageData,
  PaymentMethodItem 
} from '@/server/actions/payments';
import { 
  CreditCard, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  Coins, 
  Zap, 
  Lock, 
  AlertCircle, 
  Mail, 
  Building2, 
  Save, 
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Auto recharge settings local state
  const [autoRecharge, setAutoRecharge] = useState(true);
  const [threshold, setThreshold] = useState('15.00');
  const [rechargeAmount, setRechargeAmount] = useState('100.00');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New card modal inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const res = await getPaymentsData();
    setData(res);
    setAutoRecharge(res.settings.autoRechargeEnabled);
    setThreshold(res.settings.rechargeThresholdUsd.toFixed(2));
    setRechargeAmount(res.settings.rechargeAmountUsd.toFixed(2));
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateAutoRecharge({
      enabled: autoRecharge,
      threshold: parseFloat(threshold) || 10,
      amount: parseFloat(rechargeAmount) || 50,
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultPaymentMethod(id);
    loadData();
  };

  const handleRemove = async (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      await removePaymentMethod(id);
      loadData();
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    const newMethod: PaymentMethodItem = {
      id: `pm-${Date.now().toString().slice(-4)}`,
      brand: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4: cardNumber.slice(-4) || '1234',
      expMonth: 12,
      expYear: 2029,
      holderName: cardHolder || 'Authorized User',
      isDefault: false,
    };
    setData({
      ...data,
      methods: [...data.methods, newMethod],
    });
    setIsAddModalOpen(false);
    setCardNumber('');
    setCardHolder('');
    setCardExp('');
    setCardCvc('');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <CreditCard className="w-6 h-6 text-cyan-400" />
              PAYMENT METHODS & BILLING PROFILES
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              PCI-DSS COMPLIANT
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Configure primary funding sources, smart auto-refill triggers, and company tax invoice details.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 font-mono self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          ATTACH PAYMENT SOURCE
        </button>
      </div>

      {/* Main Grid: Left side Cards, Right side Auto-refill Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Saved Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] overflow-hidden backdrop-blur-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#0d3b66] pb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  ACTIVE PAYMENT SOURCES
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Encrypted with Stripe Vault
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                <div className="col-span-2 py-12 text-center text-slate-500 font-mono text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                  Loading payment tokens...
                </div>
              ) : (
                data?.methods.map((method) => (
                  <div
                    key={method.id}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-44 ${
                      method.isDefault
                        ? 'bg-gradient-to-br from-[#0c274a] via-[#06182e] to-[#041022] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : 'bg-[#030e1d] border-[#0e355c] hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                          {method.brand === 'usdc' ? 'CRYPTO ASSET' : `${method.brand.toUpperCase()} CARD`}
                        </span>
                        {method.isDefault ? (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
                            PRIMARY
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                          >
                            Set Primary
                          </button>
                        )}
                      </div>

                      <div className="mt-4 font-mono text-lg font-bold text-white tracking-widest">
                        •••• •••• •••• {method.last4}
                      </div>

                      <div className="text-xs font-sans text-slate-400 mt-1">
                        {method.network ? method.network : method.holderName}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#0e355c]/60 text-xs font-mono text-slate-400">
                      <span>
                        {method.brand === 'usdc' ? 'Non-Custodial' : `Expires ${method.expMonth}/${method.expYear}`}
                      </span>

                      {!method.isDefault && (
                        <button
                          onClick={() => handleRemove(method.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete payment source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Billing Contact & Tax Profile */}
          <div className="rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] p-6 shadow-2xl backdrop-blur-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#0d3b66] pb-3">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                CORPORATE INVOICING REQUISITES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#030e1d] border border-[#0e355c]">
                <span className="text-slate-500 block text-[10px] uppercase">Finance Department Email</span>
                <span className="text-slate-200 mt-1 block">{data?.settings.billingEmail}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#030e1d] border border-[#0e355c]">
                <span className="text-slate-500 block text-[10px] uppercase">Registered Tax / VAT ID</span>
                <span className="text-slate-200 mt-1 block">{data?.settings.taxId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Autonomous Top-Up Trigger */}
        <div className="space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="rounded-3xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] p-6 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  AUTONOMOUS AUTO-REFILL
                </h3>
                <p className="text-[11px] text-slate-400">Zero-downtime balance protection</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>When your gateway escrow falls below the set threshold, it will automatically bill your primary card.</span>
            </div>

            {/* Toggle switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#030e1d] border border-[#0e355c]">
              <span className="text-xs font-mono text-white">Enable Auto-TopUp</span>
              <button
                type="button"
                onClick={() => setAutoRecharge(!autoRecharge)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  autoRecharge ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoRecharge ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Threshold Input */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="block text-slate-400 uppercase text-[10px]">
                Trigger When Balance Hits ($ USD)
              </label>
              <input
                type="number"
                step="5.00"
                disabled={!autoRecharge}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            </div>

            {/* Top-up Amount Input */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="block text-slate-400 uppercase text-[10px]">
                Automatic Recharge Sum ($ USD)
              </label>
              <input
                type="number"
                step="10.00"
                disabled={!autoRecharge}
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'CONFIG APPLIED!' : 'UPDATE BILLING RULES'}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-[#06182e]/50 border border-[#0d3b66] text-xs text-slate-400 flex items-start gap-2.5 font-sans">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>All credentials and tokens are processed via 256-bit AES end-to-end cryptographic vaults.</span>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#051427] border border-[#0e355c] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#0d3b66] pb-3">
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  ATTACH PAYMENT SOURCE
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Card details are tokenized securely.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#08203d] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">CARD NUMBER</label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CARDHOLDER NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe / Company LLC"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">EXPIRY (MM/YY)</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="•••"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#0d3b66]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                >
                  TOKENIZE & ATTACH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
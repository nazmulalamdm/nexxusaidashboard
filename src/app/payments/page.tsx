"use client";

import React, { useState } from "react";
import {
  Download,
  CreditCard,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface InvoiceEntry {
  id: string;
  period: string;
  generatedDate: string;
  tokensBilled: string;
  amount: string;
  method: string;
  status: "Paid" | "Processing" | "Failed";
}

const invoicesData: InvoiceEntry[] = [
  {
    id: "INV-2026-089",
    period: "Aug 01, 2026 – Aug 31, 2026",
    generatedDate: "Sep 01, 2026",
    tokensBilled: "184.2M Tokens",
    amount: "$2,840.50",
    method: "Mastercard •••• 4092",
    status: "Paid",
  },
  {
    id: "INV-2026-074",
    period: "Jul 01, 2026 – Jul 31, 2026",
    generatedDate: "Aug 01, 2026",
    tokensBilled: "142.9M Tokens",
    amount: "$1,980.20",
    method: "Mastercard •••• 4092",
    status: "Paid",
  },
  {
    id: "INV-2026-058",
    period: "Jun 01, 2026 – Jun 30, 2026",
    generatedDate: "Jul 01, 2026",
    tokensBilled: "98.4M Tokens",
    amount: "$1,340.00",
    method: "Wire Transfer (ACH)",
    status: "Paid",
  },
  {
    id: "INV-2026-041",
    period: "May 01, 2026 – May 31, 2026",
    generatedDate: "Jun 01, 2026",
    tokensBilled: "45.1M Tokens",
    amount: "$680.75",
    method: "Visa •••• 9811",
    status: "Paid",
  },
  {
    id: "INV-2026-032",
    period: "Apr 01, 2026 – Apr 30, 2026",
    generatedDate: "May 01, 2026",
    tokensBilled: "38.2M Tokens",
    amount: "$540.20",
    method: "Mastercard •••• 4092",
    status: "Paid",
  },
  {
    id: "INV-2026-019",
    period: "Mar 01, 2026 – Mar 31, 2026",
    generatedDate: "Apr 01, 2026",
    tokensBilled: "29.8M Tokens",
    amount: "$412.00",
    method: "Visa •••• 9811",
    status: "Paid",
  },
  {
    id: "INV-2026-008",
    period: "Feb 01, 2026 – Feb 28, 2026",
    generatedDate: "Mar 01, 2026",
    tokensBilled: "18.5M Tokens",
    amount: "$290.40",
    method: "Wire Transfer (ACH)",
    status: "Paid",
  },
];

export default function PaymentsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Billing Architecture & Settlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise usage-based invoices, payment rails, and threshold audit
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white rounded-md text-xs font-medium transition-all shadow-xs"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Manage Payment Rails</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Current MTD Burn</span>
            <DollarSign className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            $1,429.80
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>12% below projected quota</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Remaining Prepaid Balance</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            $8,570.20
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Auto-recharge trigger at &lt; $1,000
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#272b40] border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Settled Payment Rail</span>
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base font-semibold text-slate-800 dark:text-slate-100 font-mono">
            Mastercard •••• 4092
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="font-mono">Exp: 09/28</span>
            <span className="text-brand-500 font-medium cursor-pointer hover:underline">
              Replace
            </span>
          </div>
        </div>
      </div>

      {/* Invoices Table with Visible Dark Background */}
      <div className="bg-white dark:bg-[#272b40] rounded-lg border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Settlement Ledger & Invoices
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Currency: USD ($)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60 text-slate-400 border-b border-slate-200 dark:border-slate-700/80">
                <th className="py-2.5 px-4">Invoice Reference</th>
                <th className="py-2.5 px-4">Billing Window</th>
                <th className="py-2.5 px-4 text-right">Inference Ingestion</th>
                <th className="py-2.5 px-4 text-right">Net Amount</th>
                <th className="py-2.5 px-4">Payment Method</th>
                <th className="py-2.5 px-4 text-center">Settlement Status</th>
                <th className="py-2.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              {invoicesData.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono text-[11px] font-medium text-brand-500">
                    {inv.id}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 dark:text-slate-200 font-medium">
                    <div>{inv.period}</div>
                    <div className="text-[11px] text-slate-400 font-mono font-normal mt-0.5">
                      Issued: {inv.generatedDate}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-[11px] text-slate-400">
                    {inv.tokensBilled}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {inv.amount}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                    {inv.method}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(inv.id)}
                      disabled={downloadingId === inv.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-500 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 transition-all disabled:opacity-60"
                    >
                      <Download className={`w-3 h-3 ${downloadingId === inv.id ? "animate-bounce text-brand-500" : ""}`} />
                      <span>{downloadingId === inv.id ? "Saving..." : "PDF"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Enterprise SLA: Tier 1 Auto-Settlement</span>
            <span className="text-slate-600">•</span>
            <a
              href="#tax-exemption"
              className="flex items-center gap-1 hover:text-brand-500 transition-colors"
            >
              <span>Tax Exemption Certificates</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span>Showing 1 to {invoicesData.length} of 24 invoices</span>
            <div className="inline-flex items-center gap-1">
              <button
                disabled
                className="p-1 rounded border border-slate-200 dark:border-slate-700/80 disabled:opacity-40 text-slate-500"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
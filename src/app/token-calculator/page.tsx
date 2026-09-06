'use client';

import { useState, useEffect } from 'react';
import { getModelPricingRates, ModelPricing } from '@/server/actions/token-calculator';
import { 
  Calculator, 
  Cpu, 
  Coins, 
  Zap, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown,
  Info
} from 'lucide-react';

export default function TokenCalculatorPage() {
  const [models, setModels] = useState<ModelPricing[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('qwen/qwen3.6-27b');
  
  // Interactive Sliders State
  const [monthlyRequests, setMonthlyRequests] = useState<number>(100000);
  const [inputTokens, setInputTokens] = useState<number>(500);
  const [outputTokens, setOutputTokens] = useState<number>(250);

  useEffect(() => {
    getModelPricingRates().then((res) => setModels(res));
  }, []);

  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Cost Calculations
  const totalInputTokensMonthly = monthlyRequests * inputTokens;
  const totalOutputTokensMonthly = monthlyRequests * outputTokens;
  
  const inputCost = currentModel ? (totalInputTokensMonthly / 1000000) * currentModel.inputCostPer1M : 0;
  const outputCost = currentModel ? (totalOutputTokensMonthly / 1000000) * currentModel.outputCostPer1M : 0;
  const totalMonthlyCost = inputCost + outputCost;

  // Comparison baseline (e.g. legacy GPT-4 pricing baseline approx $10 / 1M)
  const legacyBaselineCost = ((totalInputTokensMonthly + totalOutputTokensMonthly) / 1000000) * 8.50;
  const estimatedSavings = Math.max(0, legacyBaselineCost - totalMonthlyCost);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <Calculator className="w-6 h-6 text-cyan-400" />
              TOKEN COMPUTE CALCULATOR
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              DYNAMIC PROJECTIONS
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Simulate monthly inference expenditures, token velocity, and architecture cost savings across Groq LPU fleets.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Parameters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-[#06182e]/80 border border-[#0d3b66] p-6 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#0d3b66] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  WORKLOAD PARAMETERS
                </h2>
              </div>
              <span className="text-xs font-mono text-cyan-400">Real-Time Simulation</span>
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-slate-400">Target Model Engine</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModelId(m.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedModelId === m.id
                        ? 'bg-cyan-500/15 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-[#030e1d] border-[#0e355c] hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold text-white truncate">{m.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-1">{m.speed}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Monthly Requests */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Monthly Inferences (Requests)</span>
                <span className="text-cyan-400 font-bold">{monthlyRequests.toLocaleString()} Calls</span>
              </div>
              <input
                type="range"
                min={10000}
                max={2000000}
                step={10000}
                value={monthlyRequests}
                onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-[#030e1d] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10k Requests</span>
                <span>2M Requests</span>
              </div>
            </div>

            {/* Slider 2: Input Tokens per Request */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Average Prompt Tokens / Request</span>
                <span className="text-cyan-400 font-bold">{inputTokens} Tokens</span>
              </div>
              <input
                type="range"
                min={50}
                max={4000}
                step={50}
                value={inputTokens}
                onChange={(e) => setInputTokens(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-[#030e1d] rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Output Tokens per Request */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Average Completion Tokens / Request</span>
                <span className="text-cyan-400 font-bold">{outputTokens} Tokens</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-[#030e1d] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Cost Projection Breakdown */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] p-6 shadow-2xl space-y-6 sticky top-28">
            <div className="flex items-center gap-2 border-b border-[#0d3b66] pb-4">
              <Coins className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  PROJECTED EXPENDITURE
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">Monthly micro-settlement forecast</p>
              </div>
            </div>

            {/* Total Cost Display */}
            <div className="p-5 rounded-2xl bg-[#030e1d] border border-[#0e355c] space-y-1 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Estimated Monthly Total</span>
              <div className="text-4xl font-black font-mono text-cyan-400 tracking-tight">
                ${totalMonthlyCost.toFixed(2)} <span className="text-xs text-slate-500 font-sans">USD</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 block pt-1">
                ● Sub-cent micro-settled
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between pb-2 border-b border-[#0e355c]/60">
                <span className="text-slate-400">Total Tokens / mo:</span>
                <span className="text-white font-bold">
                  {((totalInputTokensMonthly + totalOutputTokensMonthly) / 1000000).toFixed(2)}M Tokens
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#0e355c]/60">
                <span className="text-slate-400">Input Token Cost:</span>
                <span className="text-slate-200">${inputCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#0e355c]/60">
                <span className="text-slate-400">Output Token Cost:</span>
                <span className="text-slate-200">${outputCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Savings Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                <TrendingDown className="w-4 h-4" />
                <span>Estimated Legacy Savings</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                By routing through TechknowPointAI Groq LPU mesh, you save approximately <strong className="text-emerald-400 font-mono">${estimatedSavings.toFixed(2)}/mo</strong> compared to standard cloud baseline providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
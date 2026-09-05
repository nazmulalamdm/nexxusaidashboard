'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  Cpu, 
  Layers, 
  Zap, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  inputPer1k: number;   // Price in USD per 1K input tokens
  outputPer1k: number;  // Price in USD per 1K output tokens
  contextWindow: string;
  badgeColor: string;
}

const AI_MODELS: ModelPricing[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    inputPer1k: 0.0025,
    outputPer1k: 0.010,
    contextWindow: '128k',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPer1k: 0.003,
    outputPer1k: 0.015,
    contextWindow: '200k',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'DeepSeek',
    inputPer1k: 0.00055,
    outputPer1k: 0.00219,
    contextWindow: '64k',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  },
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B (Groq/Bedrock)',
    provider: 'Meta OSS',
    inputPer1k: 0.00079,
    outputPer1k: 0.00079,
    contextWindow: '128k',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
  }
];

export default function TokenCalculatorPage() {
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o');
  const [inputTokens, setInputTokens] = useState<number>(1500);
  const [outputTokens, setOutputTokens] = useState<number>(800);
  const [requestsPerDay, setRequestsPerDay] = useState<number>(1000);
  const [samplePrompt, setSamplePrompt] = useState<string>('');

  // Auto calculate tokens based on sample text if typed
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSamplePrompt(text);
    if (text.trim().length > 0) {
      // Rough rule of thumb: ~4 characters or 0.75 words per token
      const estimatedTokens = Math.max(1, Math.round(text.trim().split(/\s+/).length * 1.35));
      setInputTokens(estimatedTokens);
    }
  };

  const selectedModel = useMemo(
    () => AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0],
    [selectedModelId]
  );

  // Per single request cost
  const singleInputCost = (inputTokens / 1000) * selectedModel.inputPer1k;
  const singleOutputCost = (outputTokens / 1000) * selectedModel.outputPer1k;
  const costPerRequest = singleInputCost + singleOutputCost;

  // Aggregate projections
  const dailyCost = costPerRequest * requestsPerDay;
  const monthlyCost = dailyCost * 30;
  const totalMonthlyTokens = (inputTokens + outputTokens) * requestsPerDay * 30;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-6 lg:p-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Token & Cost Calculator
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Telemetry Engine
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Estimate real-time inference burn rates, LLM gateway quotas, and multi-tenant billing models.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            setInputTokens(1500);
            setOutputTokens(800);
            setRequestsPerDay(1000);
            setSamplePrompt('');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-300 hover:text-white transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Reset Assumptions
        </button>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Config & Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Select Model */}
          <div className="p-6 rounded-2xl bg-[#0D121F]/90 border border-slate-800/80 shadow-xl space-y-4">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> Select Model Target
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AI_MODELS.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500'
                        : 'border-slate-800 bg-[#0A0E17]/60 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-slate-700/80 text-slate-300 bg-slate-800/50">
                          {model.provider}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">ctx: {model.contextWindow}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-2.5">{model.name}</h3>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400 font-mono flex justify-between">
                      <span>In: ${(model.inputPer1k * 1000).toFixed(2)}/M</span>
                      <span>Out: ${(model.outputPer1k * 1000).toFixed(2)}/M</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Interactive Sliders & Prompt estimation */}
          <div className="p-6 rounded-2xl bg-[#0D121F]/90 border border-slate-800/80 shadow-xl space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Payload & Traffic Assumptions
            </h3>

            {/* Prompt Quick Tester (Optional) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Interactive Prompt Estimator (Optional)</span>
                <span className="text-slate-500">Auto-derives input tokens</span>
              </div>
              <textarea
                value={samplePrompt}
                onChange={handlePromptChange}
                placeholder="Paste your system prompt or user query here to auto-count tokens..."
                rows={2}
                className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {/* Input Tokens Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> Input Tokens / Call
                </span>
                <span className="font-mono text-white font-bold bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  {inputTokens.toLocaleString()} tokens
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="32000"
                step="50"
                value={inputTokens}
                onChange={(e) => setInputTokens(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Output Tokens Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span> Output Completion Tokens / Call
                </span>
                <span className="font-mono text-white font-bold bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  {outputTokens.toLocaleString()} tokens
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="8192"
                step="50"
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Requests / Volume Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Daily Traffic Volume (Invocations/Day)
                </span>
                <span className="font-mono text-white font-bold bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  {requestsPerDay.toLocaleString()} req/day
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Cost Projections & Metric Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Hero Card: Monthly Projection */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-[#16122E] via-[#0E1322] to-[#0B0F1A] border border-purple-500/30 shadow-[0_0_35px_rgba(147,51,234,0.12)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Monthly Projected Run Rate
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight">
                  ${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Calculated on {selectedModel.name} running ~{((requestsPerDay * 30)).toLocaleString()} queries.
              </p>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">Cost / 1,000 Req</span>
                <span className="text-base font-bold font-mono text-slate-100 mt-1 block">
                  ${(costPerRequest * 1000).toFixed(3)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">Daily Spend</span>
                <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                  ${dailyCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Monthly Token Footprint */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Monthly Throughput:</span>
                <span className="font-mono font-semibold text-white">
                  {(totalMonthlyTokens / 1_000_000).toFixed(2)}M Tokens
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Input / Prompt Tokens:</span>
                <span className="font-mono">
                  {((inputTokens * requestsPerDay * 30) / 1_000_000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Output / Generated Tokens:</span>
                <span className="font-mono">
                  {((outputTokens * requestsPerDay * 30) / 1_000_000).toFixed(2)}M
                </span>
              </div>
            </div>

            {/* CTA / Gateway Integration note */}
            <div className="pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                <Coins className="w-5 h-5 flex-shrink-0 text-purple-400" />
                <span>Zero markup applied. Direct upstream cloud provider API rates.</span>
              </div>
            </div>
          </div>

          {/* Comparative Benchmark Card */}
          <div className="p-6 rounded-2xl bg-[#0D121F]/90 border border-slate-800/80 shadow-xl space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Architecture Cost Comparison
            </h4>
            <div className="space-y-2">
              {AI_MODELS.map((m) => {
                const mCostPerReq = (inputTokens / 1000) * m.inputPer1k + (outputTokens / 1000) * m.outputPer1k;
                const mMonthly = mCostPerReq * requestsPerDay * 30;
                const isSelected = m.id === selectedModelId;
                return (
                  <div 
                    key={m.id} 
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-mono transition-colors ${
                      isSelected ? 'bg-purple-950/40 border border-purple-500/40 text-white' : 'bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <span className="truncate max-w-[140px] font-sans font-medium">{m.name}</span>
                    <span className="font-bold text-slate-200">
                      ${mMonthly.toFixed(2)} /mo
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
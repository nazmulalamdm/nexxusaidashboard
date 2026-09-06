'use client';

import { useState, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  Sparkles, 
  Zap, 
  ArrowRightLeft, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  inputPerMillion: number;
  outputPerMillion: number;
  contextWindow: string;
}

const MODEL_PRICING: ModelPricing[] = [
  {
    id: 'qwen/qwen3.6-27b',
    name: 'Qwen 3.6 (27B)',
    provider: 'Groq',
    inputPerMillion: 0.20,
    outputPerMillion: 0.60,
    contextWindow: '128k',
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 (70B) Versatile',
    provider: 'Groq',
    inputPerMillion: 0.59,
    outputPerMillion: 0.79,
    contextWindow: '128k',
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 (8B) Instant',
    provider: 'Groq',
    inputPerMillion: 0.05,
    outputPerMillion: 0.08,
    contextWindow: '128k',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini (Reference)',
    provider: 'OpenAI',
    inputPerMillion: 0.15,
    outputPerMillion: 0.60,
    contextWindow: '128k',
  },
];

export default function TokenCalculatorPage() {
  const [selectedModelId, setSelectedModelId] = useState<string>(MODEL_PRICING[0].id);
  const [inputText, setInputText] = useState<string>('');
  const [expectedOutputWords, setExpectedOutputWords] = useState<number>(350);
  const [estimatedRpm, setEstimatedRpm] = useState<number>(100);

  // সাধারণ প্রাক্কলন: ইংরেজি টেক্সটে গড়ে ১টি শব্দ ≈ ১.৩৩৩ টোকেন (বা ৪ ক্যারেক্টার ≈ ১ টোকেন)
  const estimatedInputTokens = useMemo(() => {
    if (!inputText.trim()) return 0;
    const charCount = inputText.length;
    return Math.max(1, Math.round(charCount / 4));
  }, [inputText]);

  const estimatedOutputTokens = useMemo(() => {
    return Math.round(expectedOutputWords * 1.333);
  }, [expectedOutputWords]);

  const selectedModel = useMemo(() => {
    return MODEL_PRICING.find((m) => m.id === selectedModelId) || MODEL_PRICING[0];
  }, [selectedModelId]);

  // খরচ হিসাব (১টি কলের জন্য)
  const singleCallCost = useMemo(() => {
    const inputCost = (estimatedInputTokens / 1_000_000) * selectedModel.inputPerMillion;
    const outputCost = (estimatedOutputTokens / 1_000_000) * selectedModel.outputPerMillion;
    return inputCost + outputCost;
  }, [estimatedInputTokens, estimatedOutputTokens, selectedModel]);

  // মাসিক আনুমানিক খরচ (দৈনিক রিকোয়েস্ট ধরে)
  const monthlyProjectedCost = useMemo(() => {
    const dailyCost = singleCallCost * estimatedRpm;
    return dailyCost * 30;
  }, [singleCallCost, estimatedRpm]);

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-indigo-400" />
          টোকেন ও খরচ ক্যালকুলেটর
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          প্রম্পট টেক্সট এবং আউটপুট দৈর্ঘ্যের ভিত্তিতে টোকেন সংখ্যা ও মোট খরচের সঠিক প্রাক্কলন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ইনপুট কনফিগারেশন সেকশন */}
        <div className="lg:col-span-2 space-y-6">
          {/* মডেল নির্বাচন */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              টার্গেট মডেল নির্বাচন করুন
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODEL_PRICING.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedModelId === m.id
                      ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/50'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
                      {m.provider}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400 flex justify-between font-mono">
                    <span>ইনপুট: ${m.inputPerMillion}/M</span>
                    <span>আউটপুট: ${m.outputPerMillion}/M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* প্রম্পট টেক্সট বক্স */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">ইনপুট প্রম্পট লিখুন বা পেস্ট করুন</label>
              <span className="text-xs text-zinc-500 font-mono">
                {inputText.length} অক্ষর • ≈ {estimatedInputTokens} টোকেন
              </span>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="এখানে আপনার সিস্টেম প্রম্পট বা ব্যবহারকারীর মেসেজ পেস্ট করুন..."
              className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* আউটপুট ও ভলিউম স্লাইডার */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-2">
                <span>প্রত্যাশিত অ্যাসিস্ট্যান্ট রেসপন্স (শব্দ সংখ্যা)</span>
                <span className="font-mono text-indigo-400">{expectedOutputWords} শব্দ (≈ {estimatedOutputTokens} টোকেন)</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={expectedOutputWords}
                onChange={(e) => setExpectedOutputWords(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-300 mb-2">
                <span>দৈনিক রিকোয়েস্ট ভলিউম প্রাক্কলন</span>
                <span className="font-mono text-emerald-400">{estimatedRpm.toLocaleString()} কল / দিন</span>
              </div>
              <input
                type="range"
                min={10}
                max={10000}
                step={50}
                value={estimatedRpm}
                onChange={(e) => setEstimatedRpm(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* এস্টিমেশন রেজাল্ট ও সামারি কার্ড */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-zinc-900 to-indigo-950/40 border border-indigo-900/50 space-y-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              খরচের প্রাক্কলন সারসংক্ষেপ
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">প্রতি কলে ইনপুট টোকেন:</span>
                <span className="font-mono text-zinc-200">{estimatedInputTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">প্রতি কলে আউটপুট টোকেন:</span>
                <span className="font-mono text-zinc-200">{estimatedOutputTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">মোট টোকেন (প্রতি কল):</span>
                <span className="font-mono text-indigo-300 font-semibold">
                  {(estimatedInputTokens + estimatedOutputTokens).toLocaleString()}
                </span>
              </div>
            </div>

            {/* একক কল খরচ */}
            <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
              <span className="text-[11px] text-zinc-400 block">প্রতি একক কলের খরচ (USD)</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
                ${singleCallCost.toFixed(6)}
              </span>
            </div>

            {/* মাসিক প্রজেকশন */}
            <div className="p-3.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60">
              <span className="text-[11px] text-indigo-300 block">মাসিক আনুমানিক বিল (৩০ দিন)</span>
              <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
                ${monthlyProjectedCost.toFixed(2)}
              </span>
              <span className="text-[10px] text-indigo-400 mt-1 block">
                ভিত্তি: দৈনিক {estimatedRpm.toLocaleString()} কল
              </span>
            </div>
          </div>

          {/* দ্রুত তথ্য নোট */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>টোকেন প্রাক্কলন পদ্ধতি</span>
            </div>
            <p className="leading-relaxed">
              ইংরেজি ভাষার জন্য গড় ১টি শব্দ ≈ ১.৩৩৩ টোকেন ধরা হয়েছে। বাংলা ও বিশেষ ক্যারেক্টারের ক্ষেত্রে টোকেন সংখ্যা কিছুটা বেশি হতে পারে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
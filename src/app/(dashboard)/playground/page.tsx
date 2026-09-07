'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Key, 
  SlidersHorizontal, 
  Trash2, 
  Zap, 
  Copy, 
  Check,
  ChevronDown,
  Terminal,
  Cpu,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const AVAILABLE_MODELS = [
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT-OSS (20B)',
    tag: 'Ultra-Fast',
    speed: '850 t/s',
    desc: 'Low-latency replacement for Llama 3.1 8B Instant',
  },
  {
    id: 'qwen/qwen3.6-27b',
    name: 'Qwen 3.6 (27B)',
    tag: 'High-Reasoning',
    speed: '480 t/s',
    desc: 'Advanced reasoning, agentic tool-use & coding',
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS (120B)',
    tag: 'Flagship',
    speed: '290 t/s',
    desc: 'Heavyweight reasoning replacement for Llama 3.3 70B',
  },
];

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('tkp_live_nov2WOjObhxwyJqC5mHuFCYqxMSWvZ2X');
  const [model, setModel] = useState(AVAILABLE_MODELS[0].id);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('You are an expert, concise AI engineer representing TechknowPointAI. Answer technical prompts precisely with code blocks when appropriate.');
  const [showConfig, setShowConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!apiKey.trim()) {
      alert('Please provide a valid TechknowPointAI Gateway Key.');
      return;
    }

    const userMessage: Message = { role: 'user', content: input.trim() };
    const conversationPayload = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...messages,
      userMessage,
    ];

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: conversationPayload,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${response.status}`);
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:') && trimmed !== 'data: [DONE]') {
            try {
              const json = JSON.parse(trimmed.replace('data:', '').trim());
              const token = json.choices?.[0]?.delta?.content || '';
              if (token) {
                streamedContent += token;
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = {
                    role: 'assistant',
                    content: streamedContent,
                  };
                  return copy;
                });
              }
            } catch {
              // Ignore incomplete chunks in flight
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gateway routing failure';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `[Gateway Node Exception]: ${msg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-4 pb-8 max-w-7xl mx-auto h-[calc(100vh-105px)] flex flex-col">
      {/* Top Banner Toolbar */}
      <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white font-mono tracking-wider">NEURAL PLAYGROUND</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                EDGE STREAM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Test models & prompts directly through TechknowPointAI mesh</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* API Key Token Box */}
          <div className="flex items-center gap-2 bg-[#030e1d] px-3 py-1.5 rounded-xl border border-[#0e355c] focus-within:border-cyan-500 transition-colors">
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Token..."
              className="bg-transparent text-xs font-mono text-cyan-300 outline-none w-36 sm:w-44 placeholder-slate-600"
            />
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2 bg-[#030e1d] px-3 py-1.5 rounded-xl border border-[#0e355c]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer font-mono font-medium"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#030e1d] text-white">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              showConfig 
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-[#030e1d] border-[#0e355c] text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>CONFIG</span>
          </button>

          {/* Reset Conversation */}
          <button
            onClick={() => setMessages([])}
            disabled={messages.length === 0}
            title="Reset Chat Stream"
            className="p-2 rounded-xl bg-[#08203d] hover:bg-rose-950/50 border border-[#0d3b66] text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Container with Optional Config Drawer */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Chat History Viewport */}
        <div className="flex-1 flex flex-col rounded-2xl bg-[#06182e]/60 border border-[#0d3b66] backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Scrollable Conversation Canvas */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white font-mono tracking-wide">GATEWAY SANDBOX INITIALIZED</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Send a prompt to test your parameters. Inferences stream in real-time and telemetry will log to the dashboard.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3.5 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="group relative">
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.25)]'
                          : 'bg-[#030e1d] border border-[#0e355c] text-slate-200 shadow-xl'
                      }`}
                    >
                      {msg.content || (
                        <span className="inline-flex gap-1.5 items-center text-slate-400 text-xs font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:0.4s]" />
                        </span>
                      )}
                    </div>

                    {msg.role === 'assistant' && msg.content && (
                      <button
                        onClick={() => copyMessage(msg.content, idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#08203d] text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#0a2544] border border-[#14477a] flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Prompt Box */}
          <div className="p-4 border-t border-[#0d3b66] bg-[#041224]/90">
            <form onSubmit={handleSubmit} className="flex gap-2.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your prompt to stream from Groq through TechknowPointAI..."
                disabled={isLoading}
                className="flex-1 px-5 py-3.5 bg-[#030e1d] border border-[#0e355c] rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white rounded-2xl text-sm font-semibold font-mono tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>TRANSMIT</span>
              </button>
            </form>
          </div>
        </div>

        {/* Configuration Side Panel */}
        {showConfig && (
          <div className="w-80 rounded-2xl bg-[#06182e]/90 border border-[#0d3b66] backdrop-blur-2xl p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right-4 duration-200">
            <div className="space-y-5">
              <div className="border-b border-[#0d3b66] pb-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                  INFERENCE PARAMETERS
                </h3>
                <p className="text-[11px] text-slate-400">Fine-tune model behaviour</p>
              </div>

              {/* System Prompt Context */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-400">System Instruction</label>
                <textarea
                  rows={4}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Set system persona or instructions..."
                  className="w-full p-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono resize-none"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Temperature</span>
                  <span className="text-cyan-400 font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-[#030e1d] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Exact (0.0)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* Max Tokens Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Max Completion Tokens</span>
                  <span className="text-cyan-400 font-bold">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min={256}
                  max={8192}
                  step={256}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 h-1.5 bg-[#030e1d] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#0d3b66] text-[10px] font-mono text-slate-500">
              Provider Engine: <span className="text-cyan-400">Groq LPU Accelerators</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
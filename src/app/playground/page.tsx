'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Zap, 
  Terminal, 
  Layers, 
  Cpu, 
  ArrowUpRight,
  User,
  Sliders
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  metrics?: {
    tokens: number;
    latencyMs: number;
    costUsd: number;
  };
  timestamp: string;
}

const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { id: 'llama-3-1', name: 'Llama 3.1 70B', provider: 'Meta OSS', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
];

const SUGGESTED_PROMPTS = [
  "Explain P95 latency bottleneck in inference gateways",
  "Generate a Next.js 15 route handler with OpenAI streaming",
  "How to implement multi-tenant rate limiting using Redis",
  "Compare token economics of DeepSeek R1 vs GPT-4o"
];

export default function AIPlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: "Hello! I am your **TechknowPointAI Copilot**. I can help you inspect gateway telemetry, draft edge workers, or simulate prompt token usage across multiple LLM backends. How can I assist you today?",
      model: 'gpt-4o',
      metrics: {
        tokens: 42,
        latencyMs: 140,
        costUsd: 0.0001
      },
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [temperature, setTemperature] = useState(0.7);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Realistic Telemetry Response Simulation
    setTimeout(() => {
      let responseContent = `Received telemetry request for model **${selectedModel.name}**.\n\nAnalyzing parameters:\n- Model: \`${selectedModel.id}\`\n- Temperature: \`${temperature}\`\n- Context Stream: Active\n\nOptimized routing through zero-downtime gateway cluster: 200 OK.`;
      
      if (query.toLowerCase().includes('next.js') || query.toLowerCase().includes('code')) {
        responseContent = "Here is a high-throughput edge proxy route in Next.js 15:\n\n```typescript\nimport { NextRequest, NextResponse } from 'next/server';\n\nexport async function POST(req: NextRequest) {\n  const payload = await req.json();\n  // Forward to upstream AI gateway\n  return NextResponse.json({ status: 'dispatched', telemetryLogged: true });\n}\n```\nToken stream closed with zero overhead.";
      }

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        model: selectedModel.name,
        metrics: {
          tokens: Math.floor(Math.random() * 180) + 120,
          latencyMs: Math.floor(Math.random() * 190) + 95,
          costUsd: (Math.random() * 0.002 + 0.0004)
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-[#07090E] text-slate-100 font-sans">
      
      {/* Top Header Control Bar */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-[#0A0E17]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              AI Copilot & Gateway Playground
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </h1>
            <p className="text-xs text-slate-400">Interactive multi-model prompt testbed with live telemetry capture</p>
          </div>
        </div>

        {/* Model Picker & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0D121F] border border-slate-800 rounded-xl px-3 py-1.5">
            <Cpu className="w-4 h-4 text-purple-400" />
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const found = AVAILABLE_MODELS.find(m => m.id === e.target.value);
                if (found) setSelectedModel(found);
              }}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0D121F] text-slate-200">
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Empty state suggested queries */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6 py-12">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Start an Inference Session</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a model above and prompt the gateway to analyze logs, test prompts, or estimate latency.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="p-3 rounded-xl bg-[#0D121F] border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-xs text-slate-300 transition-all flex items-start justify-between group"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 flex-shrink-0 ml-1.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Feeds */}
        {messages.map((msg) => {
          const isAi = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isAi
                    ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                    : 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                    isAi
                      ? 'bg-[#0D121F] border-slate-800 text-slate-200'
                      : 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  {/* Actions / Copy */}
                  {isAi && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[11px] font-mono text-slate-500">{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 hover:text-white transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Telemetry Metrics Footnote */}
                {isAi && msg.metrics && (
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 px-2 py-0.5">
                    <span className="flex items-center gap-1 text-purple-400">
                      <Zap className="w-3 h-3" /> {msg.metrics.latencyMs}ms
                    </span>
                    <span>•</span>
                    <span>{msg.metrics.tokens} tokens</span>
                    <span>•</span>
                    <span className="text-emerald-400">${msg.metrics.costUsd.toFixed(5)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing State */}
        {isTyping && (
          <div className="flex gap-3 max-w-xl mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0D121F] border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              Streaming inference from {selectedModel.name}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock Area */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0A0E17]/90 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex items-center gap-2 bg-[#0D121F] border border-slate-800 focus-within:border-purple-500/70 rounded-2xl p-1.5 shadow-xl transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${selectedModel.name} or prompt your AI cluster...`}
            className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white transition-all shadow-md shadow-purple-600/20 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Integrated with Mock Edge Orchestrator. Switch to real OpenAI / Anthropic API keys via Settings anytime.
        </p>
      </div>

    </div>
  );
}
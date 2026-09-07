// src/components/CopilotWidget.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  X,
  Send,
  Loader2,
  Terminal,
  ExternalLink,
  KeyRound,
  Activity,
  Calculator,
  Sparkles,
} from "lucide-react";

interface ActionData {
  action?: string;
  pageName?: string;
  path?: string;
  apiKey?: string;
  systemStatus?: string;
  averageLatency?: string;
  throughput?: string;
  estimatedCostUSD?: string;
  totalTokens?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: ActionData[];
}

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "TechknowpointAI Online. Ready to navigate the gateway mesh, test prompts, manage keys, or read node telemetry.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || loading) return;

    if (!userPrompt) setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: textToSend.trim() },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          actions: data.actions || [],
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `SIGNAL_ERROR: ${err.message || "Gateway response failed."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-mono select-none">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#041022]/90 border border-cyan-500/40 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all backdrop-blur-md"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
            AI Agent // TechknowpointAI
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[430px] h-[550px] rounded-2xl bg-[#030d1b]/95 border border-[#0d3b66] shadow-[0_0_40px_rgba(2,12,27,0.9)] backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="h-14 px-4 bg-[#06182e] border-b border-[#0e355c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                  TechknowpointAI
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px]">v2.0</span>
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono">ALL 10 MESH NODES ACTIVE</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="px-3 py-2 bg-[#041224] border-b border-[#0e355c]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
            <button
              onClick={() => handleSend("Change my password")}
              className="px-2 py-1 rounded bg-[#081e3a] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shrink-0 transition-colors"
            >
              🔑 Security & Password
            </button>
            <button
              onClick={() => handleSend("Show system telemetry")}
              className="px-2 py-1 rounded bg-[#081e3a] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shrink-0 transition-colors"
            >
              ⚡ Telemetry
            </button>
            <button
              onClick={() => handleSend("Take me to Token Calculator")}
              className="px-2 py-1 rounded bg-[#081e3a] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shrink-0 transition-colors"
            >
              🧮 Calculator
            </button>
            <button
              onClick={() => handleSend("Open Playground")}
              className="px-2 py-1 rounded bg-[#081e3a] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shrink-0 transition-colors"
            >
              🤖 Playground
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-cyan-500 text-slate-950 font-sans font-medium rounded-tr-none"
                      : "bg-[#06182e] border border-[#0e355c] text-slate-200 rounded-tl-none font-mono"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Actions Display */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#0e355c]/60 space-y-2">
                      {m.actions.map((act, aIdx) => (
                        <div key={aIdx}>
                          {/* Navigation Route Link Button */}
                          {act.action === "NAVIGATE" && act.path && (
                            <Link
                              href={act.path}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all w-full justify-between group"
                            >
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                                <span>GOTO {act.pageName?.toUpperCase()}</span>
                              </span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          {/* New API Key Emitted */}
                          {act.apiKey && (
                            <div className="p-2.5 rounded bg-black/40 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
                              <div className="flex items-center gap-1 font-bold">
                                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                                <span>NEW API KEY GENERATED:</span>
                              </div>
                              <code className="text-[10px] break-all select-all font-mono text-white bg-slate-950 p-1.5 rounded block border border-slate-800">
                                {act.apiKey}
                              </code>
                            </div>
                          )}

                          {/* Telemetry Metrics */}
                          {act.systemStatus && (
                            <div className="p-2.5 rounded bg-[#030d1b] border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                                <span>STATUS: {act.systemStatus}</span>
                              </div>
                              <span>LATENCY: {act.averageLatency}</span>
                            </div>
                          )}

                          {/* Token Calculator Estimation */}
                          {act.estimatedCostUSD && (
                            <div className="p-2.5 rounded bg-[#030d1b] border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                                <span>TOKENS: {act.totalTokens?.toLocaleString()}</span>
                              </div>
                              <span className="font-bold">{act.estimatedCostUSD}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs p-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="animate-pulse">EVALUATING GRAPH STATE...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#06182e] border-t border-[#0e355c] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type command e.g. Open prompt registry..."
              className="flex-1 bg-[#020b17] border border-[#0d3b66] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
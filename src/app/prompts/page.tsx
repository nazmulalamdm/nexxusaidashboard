'use client';

import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  GitBranch, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Plus, 
  Search, 
  History, 
  Tag, 
  Cpu, 
  Coins, 
  Layers,
  Code2,
  CheckCircle2
} from 'lucide-react';

interface PromptVersion {
  version: string;
  template: string;
  tokens: number;
  avgLatency: string;
  createdAt: string;
  notes: string;
}

interface PromptItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  targetModel: string;
  activeVersion: string;
  versions: PromptVersion[];
  variables: string[];
}

const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'p-1',
    name: 'Customer Ticket Triage & Sentiment',
    slug: 'ticket-triage',
    category: 'Support AI',
    targetModel: 'gpt-4o',
    activeVersion: 'v2.1',
    variables: ['customer_query', 'account_tier'],
    versions: [
      {
        version: 'v2.1',
        template: `You are a Tier-3 Support Gateway. Analyze the following inbound user inquiry:\nCustomer Query: "{{customer_query}}"\nAccount Level: "{{account_tier}}"\n\nTask:\n1. Extract sentiment (Positive, Neutral, Urgent).\n2. Classify intent and return recommended JSON triage schema.`,
        tokens: 68,
        avgLatency: '240ms',
        createdAt: '2 hours ago',
        notes: 'Strict JSON schema formatting added'
      },
      {
        version: 'v2.0',
        template: `Classify the following customer ticket and tell if they are angry:\n"{{customer_query}}"`,
        tokens: 34,
        avgLatency: '180ms',
        createdAt: '3 days ago',
        notes: 'Basic sentiment extraction without JSON enforcement'
      }
    ]
  },
  {
    id: 'p-2',
    name: 'SQL Query & Schema Synthesizer',
    slug: 'sql-generator',
    category: 'Code Generation',
    targetModel: 'claude-3-5-sonnet',
    activeVersion: 'v1.3',
    variables: ['user_intent', 'table_schema', 'dialect'],
    versions: [
      {
        version: 'v1.3',
        template: `Target Dialect: {{dialect}}\nContext Schema:\n{{table_schema}}\n\nGenerate an optimized, index-aware SQL query for this request:\nRequest: "{{user_intent}}"\n\nOnly return executable SQL enclosed in markdown without explanations.`,
        tokens: 58,
        avgLatency: '320ms',
        createdAt: 'Yesterday',
        notes: 'Optimized for PostgreSQL and Snowflake index awareness'
      }
    ]
  },
  {
    id: 'p-3',
    name: 'RAG Context Re-Ranker & Summarizer',
    slug: 'rag-reranker',
    category: 'Observability',
    targetModel: 'deepseek-r1',
    activeVersion: 'v1.0',
    variables: ['retrieved_chunks', 'user_question'],
    versions: [
      {
        version: 'v1.0',
        template: `Given the retrieved document chunks below:\n{{retrieved_chunks}}\n\nAnswer user question: "{{user_question}}".\nProvide citations for every claim. If answer is not present, respond "NOT_FOUND".`,
        tokens: 52,
        avgLatency: '410ms',
        createdAt: '5 days ago',
        notes: 'Initial production baseline for knowledge base'
      }
    ]
  }
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('p-1');
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Variable test inputs
  const [variableValues, setVariableValues] = useState<Record<string, string>>({
    customer_query: "The payment gateway is throwing 504 errors on checkout!",
    account_tier: "Enterprise (SLA: 1 hour)",
    user_intent: "Find top 5 spending customers who joined after Jan 2026",
    table_schema: "users (id, name, created_at); transactions (id, user_id, amount, status)",
    dialect: "PostgreSQL 16",
    retrieved_chunks: "Doc 1: Latency caps at 200ms.\nDoc 2: Rate limit threshold is 500 RPM.",
    user_question: "What is our current rate limit?"
  });

  const selectedPrompt = useMemo(() => {
    return prompts.find(p => p.id === selectedPromptId) || prompts[0];
  }, [prompts, selectedPromptId]);

  const currentVersion = selectedPrompt.versions[activeVersionIndex] || selectedPrompt.versions[0];

  // Dynamic variable replacement simulation
  const renderedPrompt = useMemo(() => {
    let text = currentVersion.template;
    selectedPrompt.variables.forEach(v => {
      const val = variableValues[v] || `{{${v}}}`;
      text = text.replaceAll(`{{${v}}}`, val);
    });
    return text;
  }, [currentVersion, selectedPrompt, variableValues]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredPrompts = prompts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#07090E] text-slate-100 p-6 lg:p-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Prompt Registry & Versioning
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  CI/CD Orchestration
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Centrally manage, test dynamic variables, and track token velocity across deployment revisions.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => alert("Creating new prompt template...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> New Prompt Schema
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Prompt Navigation List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search prompts or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D121F] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="space-y-2.5">
            {filteredPrompts.map((p) => {
              const isSelected = p.id === selectedPromptId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPromptId(p.id);
                    setActiveVersionIndex(0);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.12)] ring-1 ring-purple-500'
                      : 'border-slate-800 bg-[#0D121F]/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-700/60 bg-slate-800/40 text-slate-300">
                      {p.category}
                    </span>
                    <span className="text-[11px] font-mono text-purple-400 font-medium">
                      {p.activeVersion}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2.5 truncate">{p.name}</h3>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Cpu className="w-3.5 h-3.5 text-slate-500" /> {p.targetModel}
                    </span>
                    <span>{p.versions.length} versions</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Prompt Detail, Versions & Variable Live Sandbox (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Info & Version Picker */}
          <div className="p-6 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{selectedPrompt.name}</h2>
                  <span className="text-xs font-mono text-slate-500">#{selectedPrompt.slug}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>Target: <strong className="text-slate-200">{selectedPrompt.targetModel}</strong></span>
                  <span>•</span>
                  <span>Variables: <strong className="text-purple-400">{selectedPrompt.variables.length} bound</strong></span>
                </p>
              </div>

              {/* Version Selector Tabs */}
              <div className="flex items-center gap-1 bg-[#080B12] p-1 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 px-2 flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" /> Revisions:
                </span>
                {selectedPrompt.versions.map((ver, idx) => (
                  <button
                    key={ver.version}
                    onClick={() => setActiveVersionIndex(idx)}
                    className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                      idx === activeVersionIndex
                        ? 'bg-purple-600 text-white font-semibold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ver.version}
                  </button>
                ))}
              </div>
            </div>

            {/* Version Meta Bar */}
            <div className="p-3 rounded-xl bg-[#080B12]/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-300">
                <span>Tokens: <strong className="text-white">{currentVersion.tokens}</strong></span>
                <span>Avg Latency: <strong className="text-purple-400">{currentVersion.avgLatency}</strong></span>
                <span className="text-slate-500">{currentVersion.createdAt}</span>
              </div>
              <span className="text-slate-400 italic text-[11px]">{currentVersion.notes}</span>
            </div>
          </div>

          {/* Template Editor / Preview & Variables */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Raw Template with syntax (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-purple-400" /> Template Definition ({currentVersion.version})
                  </span>
                  <button
                    onClick={() => handleCopy(currentVersion.template)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                
                <div className="p-4 rounded-xl bg-[#07090E] border border-slate-800/80 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {currentVersion.template}
                </div>
              </div>

              {/* Rendered Dynamic Live Output */}
              <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-xl space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Live Interpolated Payload (Ready for LLM)
                </span>
                <div className="p-4 rounded-xl bg-[#07090E] border border-emerald-500/20 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {renderedPrompt}
                </div>
              </div>
            </div>

            {/* Variable Bindings Sandbox (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 shadow-xl space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-purple-400" /> Variable Bindings
                </span>
                <p className="text-xs text-slate-500">
                  Update dummy values to see how the prompt hydrates in runtime:
                </p>

                <div className="space-y-3">
                  {selectedPrompt.variables.map((v) => (
                    <div key={v} className="space-y-1">
                      <label className="text-[11px] font-mono text-purple-300 block">
                        {`{{${v}}}`}
                      </label>
                      <textarea
                        rows={2}
                        value={variableValues[v] || ''}
                        onChange={(e) => setVariableValues({
                          ...variableValues,
                          [v]: e.target.value
                        })}
                        className="w-full bg-[#07090E] border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <button 
                    onClick={() => alert("Simulation request dispatched to AI gateway!")}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Run Test Inference
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
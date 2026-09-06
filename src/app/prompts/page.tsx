'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Terminal, 
  Plus, 
  Copy, 
  Check, 
  Search, 
  Trash2, 
  Sparkles, 
  Cpu, 
  Play, 
  Layers, 
  X,
  Code2,
  Tag
} from 'lucide-react';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  model: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
}

const INITIAL_PROMPTS: PromptTemplate[] = [
  {
    id: 'pr-01',
    title: 'Code Security & Vulnerability Auditor',
    description: 'Deep AST security review detecting memory leaks, SQL injection, and logic flaws.',
    category: 'Engineering',
    model: 'qwen/qwen3.6-27b',
    systemPrompt: 'You are a principal security engineer. Review the provided source code for CVEs, AST vulnerabilities, and memory leaks. Provide actionable diff patches in markdown code blocks.',
    userPromptTemplate: 'Review the following {{language}} module for critical vulnerabilities:\n\n```{{code}}```',
    variables: ['language', 'code'],
  },
  {
    id: 'pr-02',
    title: 'Customer Ticket Intent & Priority Triage',
    description: 'Zero-shot classification categorizing inbound issues into urgent, billing, or tech.',
    category: 'Operations',
    model: 'llama-3.1-8b-instant',
    systemPrompt: 'You are an automated support triage parser. Output strict JSON with keys: "priority" (P1-P4), "department", and "resolution_hint". Do not output conversational preamble.',
    userPromptTemplate: 'Analyze customer message:\n"{{customer_message}}"',
    variables: ['customer_message'],
  },
  {
    id: 'pr-03',
    title: 'PostgreSQL Query Planner & Schema Architect',
    description: 'Translates natural language specifications into indexed relational schema & SQL.',
    category: 'Data Architecture',
    model: 'llama-3.3-70b-versatile',
    systemPrompt: 'You are an ultra-fast PostgreSQL optimizer. Write ANSI SQL with appropriate index hints, execution plan cost estimation, and transaction boundaries.',
    userPromptTemplate: 'Database Schema:\n{{schema}}\n\nObjective: {{query_goal}}',
    variables: ['schema', 'query_goal'],
  },
];

export default function PromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<PromptTemplate[]>(INITIAL_PROMPTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [model, setModel] = useState('qwen/qwen3.6-27b');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPromptTemplate, setUserPromptTemplate] = useState('');

  const categories = ['All', 'Engineering', 'Operations', 'Data Architecture'];

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this prompt template from registry?')) {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const varMatches = userPromptTemplate.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
    const extractedVars = Array.from(new Set(varMatches.map((v) => v.replace(/[{}]/g, ''))));

    const newPrompt: PromptTemplate = {
      id: `pr-${Date.now().toString().slice(-4)}`,
      title,
      description,
      category,
      model,
      systemPrompt,
      userPromptTemplate,
      variables: extractedVars,
    };

    setPrompts([newPrompt, ...prompts]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setSystemPrompt('');
    setUserPromptTemplate('');
  };

  const handleLaunchPlayground = () => {
    router.push('/playground');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0e2a47] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2.5">
              <Terminal className="w-6 h-6 text-cyan-400" />
              PROMPT REGISTRY
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              VERSION CONTROLLED
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Curate, parameterize, and deploy production system prompts across TechknowPointAI gateway proxies.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 self-start md:self-auto font-mono"
        >
          <Plus className="w-4 h-4" />
          CREATE PROMPT
        </button>
      </div>

      {/* Filter & Omni Search Bar */}
      <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 w-full sm:w-80 px-3.5 py-2 rounded-xl bg-[#030e1d] border border-[#0e355c] focus-within:border-cyan-500 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates or keywords..."
            className="bg-transparent text-xs text-slate-200 outline-none w-full placeholder-slate-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#08203d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="rounded-2xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] hover:border-cyan-500/50 transition-all duration-300 p-5 shadow-2xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Category & Model Target Tag */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#030e1d] text-cyan-400 border border-[#0e355c]">
                  {prompt.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  {prompt.model}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                  {prompt.description}
                </p>
              </div>

              {/* System Instruction Surface */}
              <div className="p-3 rounded-xl bg-[#030e1d] border border-[#0e355c]/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-purple-400 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> System Context
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Immutable</span>
                </div>
                <p className="text-xs font-mono text-slate-300 line-clamp-3 leading-relaxed">
                  {prompt.systemPrompt}
                </p>
              </div>

              {/* Variable Parameters */}
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">
                  Parameters ({prompt.variables.length})
                </span>
                <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                  {prompt.variables.length > 0 ? (
                    prompt.variables.map((v) => (
                      <span
                        key={v}
                        className="px-2 py-0.5 rounded-md bg-[#08203d] border border-[#0d3b66] text-[10px] font-mono text-cyan-300"
                      >
                        &#123;&#123;{v}&#125;&#125;
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600">Static payload (no variables)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-5 border-t border-[#0e355c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(prompt.systemPrompt, prompt.id)}
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {copiedId === prompt.id ? (
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === prompt.id ? 'COPIED' : 'COPY'}</span>
                </button>

                <button
                  onClick={handleLaunchPlayground}
                  title="Test in AI Sandbox"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>TEST</span>
                </button>
              </div>

              <button 
                onClick={() => handleDelete(prompt.id)}
                title="Delete Prompt"
                className="p-1.5 rounded-lg bg-[#08203d] hover:bg-rose-950/60 border border-[#0d3b66] text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredPrompts.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 font-mono text-xs">
            No templates matching the query &quot;{searchQuery}&quot; found.
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#051427] border border-[#0e355c] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#0d3b66] pb-3">
              <div>
                <h2 className="text-base font-bold text-white font-mono">NEW PROMPT TEMPLATE</h2>
                <p className="text-[11px] text-slate-400">Save optimized instructions to registry</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#08203d] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">TEMPLATE TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Legal Contract Entity Extractor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Data Architecture">Data Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">RECOMMENDED MODEL</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="qwen/qwen3.6-27b">Qwen 3.6 (27B)</option>
                    <option value="llama-3.3-70b-versatile">Llama 3.3 (70B)</option>
                    <option value="llama-3.1-8b-instant">Llama 3.1 (8B)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of expected use cases"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">SYSTEM INSTRUCTION</label>
                <textarea
                  rows={3}
                  required
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are an expert AI..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">USER PROMPT (USE &#123;&#123;variable&#125;&#125;)</label>
                <textarea
                  rows={3}
                  required
                  value={userPromptTemplate}
                  onChange={(e) => setUserPromptTemplate(e.target.value)}
                  placeholder="Process payload: {{input_text}}"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white focus:outline-none focus:border-cyan-500 resize-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                >
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
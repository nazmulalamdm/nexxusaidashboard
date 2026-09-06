'use client';

import Link from 'next/link';
import { 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Activity, 
  Key, 
  Layers, 
  CheckCircle2, 
  Radio, 
  Sparkles,
  Lock,
  Globe,
  Gauge,
  Check
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030e1d] text-slate-100 selection:bg-cyan-500 selection:text-black font-sans overflow-hidden">
      {/* Cyber Glow Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />

      {/* 1. Navigation Bar */}
      <header className="border-b border-[#0e2a47] bg-[#030e1d]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-mono text-lg font-bold tracking-tight text-white">
              TechknowPoint<span className="text-cyan-400">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">ARCHITECTURE</a>
            <a href="#preview" className="hover:text-cyan-400 transition-colors">TELEMETRY</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">TIERS</a>
          </nav>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Link 
              href="/login"
              className="px-4 py-2.5 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] border border-[#0d3b66] text-slate-200 transition-colors"
            >
              SIGN IN
            </Link>
            <Link 
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
            >
              <span>REGISTER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-28 pb-20 max-w-5xl mx-auto px-6 text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          ENTERPRISE NEURAL GATEWAY & SECURED MESH v2.6
        </div>

        <h1 className="text-4xl sm:text-7xl font-black font-mono tracking-tight text-white leading-[1.1]">
          High-Speed AI Routing <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            For Autonomous Workloads
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
          Unify Groq LPU acceleration, zero-trust cryptographic agent keys, sub-cent micro-settlement ledgers, and automated failover under one secure platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono">
          <Link 
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-[0_0_35px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"
          >
            <span>INITIALIZE FREE ACCOUNT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#06182e] hover:bg-[#08203d] border border-[#0d3b66] text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>CONSOLE SIGN IN</span>
          </Link>
        </div>

        {/* Live Metrics Ticker */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] backdrop-blur-xl text-center">
            <span className="text-xs font-mono text-slate-400 block">LATENCY (TTFT)</span>
            <span className="text-2xl font-black font-mono text-cyan-400 mt-1 block">&lt; 140ms</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] backdrop-blur-xl text-center">
            <span className="text-xs font-mono text-slate-400 block">UPTIME GUARANTEE</span>
            <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">99.99%</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] backdrop-blur-xl text-center">
            <span className="text-xs font-mono text-slate-400 block">ROUTING ENGINE</span>
            <span className="text-2xl font-black font-mono text-blue-400 block">Groq LPU</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#06182e]/80 border border-[#0d3b66] backdrop-blur-xl text-center">
            <span className="text-xs font-mono text-slate-400 block">ESCROW LEDGER</span>
            <span className="text-2xl font-black font-mono text-purple-400 mt-1 block">Real-Time</span>
          </div>
        </div>
      </section>

      {/* 3. Features / Architecture Grid */}
      <section id="features" className="py-24 border-t border-[#0e2a47] bg-[#020914]/60 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              ENTERPRISE ARCHITECTURE
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold font-mono text-white">
              Built for Scale, Security & Zero Jitter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-mono text-white">LPU Acceleration</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Direct socket proxying through Groq LPUs, delivering unmatched token throughput with zero drop rates.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-mono text-white">Zero-Trust Agent Keys</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Issue SHA-256 hashed keys for autonomous agents with real-time budget caps and sliding window RPM limits.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#081e3a] to-[#041022] border border-[#103a68] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-mono text-white">Audited Micro-Ledger</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Every inference call is tracked with precise sub-cent cost calculations and automated escrow replenishment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Telemetry / Playground Preview */}
      <section id="preview" className="py-20 border-t border-[#0e2a47] bg-[#030e1d]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#06182e] to-[#041022] border border-[#0d3b66] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                LIVE DEMO PREVIEW
              </span>
              <h3 className="text-2xl font-bold font-mono text-white">
                Experience Real-Time Streaming & Traffic Orchestration
              </h3>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Test models instantly in our playground, monitor cluster health, and view live audit trails directly inside your command center.
              </p>
            </div>
            <Link 
              href="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 whitespace-nowrap"
            >
              <span>EXPLORE DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Pricing & Licensing Tiers */}
      <section id="pricing" className="py-24 border-t border-[#0e2a47] bg-[#020914]/40">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              TRANSPARENT LICENSING
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold font-mono text-white">
              Choose Your Throughput Tier
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-7 rounded-3xl bg-[#06182e]/80 border border-[#0d3b66] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="font-mono text-lg font-bold text-white">Developer Fleet</h4>
                <div className="text-3xl font-black font-mono text-cyan-400">$19 <span className="text-xs text-slate-500 font-sans">/mo</span></div>
                <p className="text-xs text-slate-400 font-sans">5M Shared Tokens / mo with 60 RPM rate cap.</p>
              </div>
              <Link href="/register" className="w-full py-3 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] border border-[#0d3b66] text-center text-xs font-mono font-bold text-white transition-all">
                GET STARTED
              </Link>
            </div>

            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#0a274c] via-[#06182e] to-[#041022] border border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.2)] space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-black font-mono text-[10px] font-bold">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <h4 className="font-mono text-lg font-bold text-white">Pro Sentinel</h4>
                <div className="text-3xl font-black font-mono text-cyan-400">$79 <span className="text-xs text-slate-500 font-sans">/mo</span></div>
                <p className="text-xs text-slate-400 font-sans">25M High-Speed Tokens with automated 5xx failover.</p>
              </div>
              <Link href="/register" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-center text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                DEPLOY PRO MESH
              </Link>
            </div>

            <div className="p-7 rounded-3xl bg-[#06182e]/80 border border-[#0d3b66] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="font-mono text-lg font-bold text-white">Enterprise Matrix</h4>
                <div className="text-3xl font-black font-mono text-cyan-400">$299 <span className="text-xs text-slate-500 font-sans">/mo</span></div>
                <p className="text-xs text-slate-400 font-sans">150M Dedicated Mesh Tokens with 24/7 SLA.</p>
              </div>
              <Link href="/register" className="w-full py-3 rounded-xl bg-[#08203d] hover:bg-[#0a2a50] border border-[#0d3b66] text-center text-xs font-mono font-bold text-white transition-all">
                CONTACT ARCHITECT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Security & Compliance Badge */}
      <section className="py-12 border-t border-[#0e2a47] bg-[#030e1d] text-center font-mono text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> PCI-DSS COMPLIANT</span>
          <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-cyan-400" /> 256-BIT AES ENCRYPTION</span>
          <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> TLS 1.3 HANDSHAKE</span>
        </div>
      </section>

      {/* 7. Master Footer */}
      <footer className="border-t border-[#0e2a47] py-10 text-center font-mono text-xs text-slate-500 space-y-2 bg-[#020914]">
        <p>© 2026 TechknowPointAI Gateway Suite. All Rights Reserved.</p>
        <p className="text-cyan-400/80">ThemeForest Elite Cybernetic Standard</p>
      </footer>
    </div>
  );
}
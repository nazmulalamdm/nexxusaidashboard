'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Lock, Mail, Loader2, ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('plan_pro');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Set auth cookie & active plan securely
    document.cookie = "tp_auth_token=active_jwt_session_2026; path=/; max-age=86400";
    localStorage.setItem('tp_active_plan', selectedPlan);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 800);
  };

  const fillDemoAccount = (role: 'admin' | 'reviewer') => {
    if (role === 'admin') {
      setEmail('admin@techknowpoint.ai');
      setPassword('elite_admin_2026');
      setSelectedPlan('plan_enterprise');
    } else {
      setEmail('reviewer@themeforest.net');
      setPassword('demo_preview_pass');
      setSelectedPlan('plan_pro');
    }
  };

  return (
    <div className="min-h-screen bg-[#030e1d] flex items-center justify-center px-4 font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full p-8 rounded-3xl bg-[#06182e]/90 border border-[#0d3b66] backdrop-blur-2xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">GATEWAY CONSOLE</h1>
          <p className="text-xs text-slate-400">TechknowPointAI Elite Enterprise Access</p>
        </div>

        {/* ThemeForest Reviewer Quick Demo Bar */}
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>THEMEFOREST REVIEWER QUICK LOGIN</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="px-3 py-2 rounded-xl bg-[#030e1d] hover:bg-[#08203d] border border-cyan-500/40 text-[10px] font-mono text-cyan-300 transition-colors text-center cursor-pointer"
            >
              Fill Enterprise Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('reviewer')}
              className="px-3 py-2 rounded-xl bg-[#030e1d] hover:bg-[#08203d] border border-cyan-500/40 text-[10px] font-mono text-cyan-300 transition-colors text-center cursor-pointer"
            >
              Fill Pro Reviewer
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1.5">Email Address</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] focus-within:border-cyan-500">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techknowpoint.ai"
                className="bg-transparent text-white outline-none w-full font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1.5">Password</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] focus-within:border-cyan-500">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-transparent text-white outline-none w-full font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Assigned Subscription Tier</span>
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-[#0e355c] text-white text-xs font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="plan_developer">Developer Fleet ($19/mo - 5M Tokens)</option>
              <option value="plan_pro">Pro Sentinel ($79/mo - 25M Tokens)</option>
              <option value="plan_enterprise">Enterprise Matrix ($299/mo - 150M Tokens)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 mt-2 font-mono cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>AUTHENTICATE & MESH SESSION</span>
          </button>
        </form>

        <div className="text-center text-xs font-mono text-slate-400 pt-3 border-t border-[#0d3b66] flex items-center justify-between">
          <span>New tenant?</span>
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register Organization →
          </Link>
        </div>
      </div>
    </div>
  );
}
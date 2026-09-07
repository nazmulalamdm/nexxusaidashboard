'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Lock, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginAction } from '@/server/actions/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';
  const callbackUrl = searchParams.get('callbackUrl') || '/overview';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const res = await loginAction(formData);

      if (res?.error) {
        throw new Error(res.error);
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Terminal className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
          Access Terminal
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-sans">
          Authenticate to manage telemetry proxies and billing
        </p>
      </div>

      <div className="bg-[#051527]/90 border border-[#0e3a68] backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
        {isRegistered && !error && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Account provisioned! Please authenticate below.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@network.io"
                required
                className="w-full bg-[#030d1a] border border-[#0d3b66] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#030d1a] border border-[#0d3b66] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                INITIALIZE SESSION
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#0e3a68]/60 text-center">
          <p className="text-xs text-slate-400">
            Need gateway credentials?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-mono underline underline-offset-4">
              Register Platform
            </Link>
          </p>
          <div className="flex items-center justify-center mb-1 mt-3">
            <Link
              href="/forgot-password"
              className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020b14] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <Suspense
        fallback={
          <div className="text-cyan-400 font-mono text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            LOADING SECURE NODE...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from '@/server/actions/auth';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await forgotPasswordAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Connection interrupted. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020b17] font-mono select-none">
      {/* Background Neon Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl bg-[#041022]/90 border border-[#0e355c] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase">RECOVER ACCESS</h1>
          <p className="text-xs text-slate-400 font-sans">
            Enter your node identifier email to receive an authorization link.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
              <div className="flex justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="font-semibold uppercase tracking-wider">Verification Link Dispatched</p>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Check your inbox. If the account exists on our network, a recovery sequence link has been delivered.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#081e3a] hover:bg-[#0e2c54] text-xs font-bold text-cyan-300 border border-cyan-500/30 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO LOGIN</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Operator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="operator@gateway.mesh"
                  className="w-full bg-[#06182e] border border-[#0d3b66] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>TRANSMITTING LINK...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>SEND RECOVERY LINK</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to authentication</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
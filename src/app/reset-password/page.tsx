'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPasswordAction } from '@/server/actions/auth';
import { Lock, KeyRound, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch {
      setError('An unexpected error occurred during password overwrite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020b17] font-mono select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl bg-[#041022]/90 border border-[#0e355c] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-wider uppercase">CONFIGURE NEW KEY</h1>
          <p className="text-xs text-slate-400 font-sans">
            Overwrite node security credentials with a strong password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center space-y-2">
            <div className="flex justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="font-semibold uppercase tracking-wider">Password Updated</p>
            <p className="text-slate-300 font-sans">
              Node authorization credentials reset. Redirecting to access terminal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-[#06182e] border border-[#0d3b66] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Minimum 6 characters.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-[#06182e] border border-[#0d3b66] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
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
                  <span>OVERWRITING KEY...</span>
                </>
              ) : (
                <span>SAVE NEW PASSWORD</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
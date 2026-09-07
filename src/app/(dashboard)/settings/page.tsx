'use client';

import React, { useState } from 'react';
import { changePasswordAction } from '@/server/actions/auth';
import { Shield, Lock, CheckCircle, AlertCircle, Loader2, Key } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      const res = await changePasswordAction(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono text-slate-200">
      <div className="border-b border-[#0e355c] pb-4">
        <div className="flex items-center gap-2 text-cyan-400 mb-1">
          <Shield className="w-5 h-5" />
          <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white">ACCOUNT SETTINGS & SECURITY</h1>
        </div>
        <p className="text-xs text-slate-400 font-sans">
          Manage your credentials, node security keys, and access passwords.
        </p>
      </div>

      <div className="rounded-2xl bg-[#041022]/90 border border-[#0e355c] shadow-xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-wide text-white uppercase">Update Password</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Password updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              NEW PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="newPassword"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-[#06182e] border border-[#0d3b66] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Minimum 6 characters.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              CONFIRM NEW PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-[#06182e] border border-[#0d3b66] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
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
                <span>UPDATING CREDENTIALS...</span>
              </>
            ) : (
              <span>SAVE NEW PASSWORD</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
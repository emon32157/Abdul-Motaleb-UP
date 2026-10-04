import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../seo/SEOHead';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Flame
} from 'lucide-react';

interface AdminLoginProps {
  onSuccess?: () => void;
  onBackToSite?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const { login, resetPassword, error, clearError, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  // If already authenticated as admin, redirect to target or admin dashboard
  useEffect(() => {
    if (isAdmin) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAdmin, navigate, onSuccess, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const success = await login(email.trim(), password);
      if (success) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(from, { replace: true });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToSite = () => {
    if (onBackToSite) {
      onBackToSite();
    } else {
      navigate('/');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetError('');
    setResetSuccess(false);

    const ok = await resetPassword(resetEmail.trim());
    if (ok) {
      setResetSuccess(true);
    } else {
      setResetError('পাসওয়ার্ড পুনরুদ্ধার লিঙ্ক পাঠাতে ব্যর্থ হয়েছে। ইমেইলটি যাচাই করুন।');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050811] text-white p-4 relative overflow-hidden font-sans">
      <SEOHead
        title="Admin Security Portal - Login"
        description="Restricted authentication portal for verified administrators."
        canonicalUrl="/login"
      />

      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-2xl border border-cyan-500/30 bg-[#091022]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(0,242,254,0.15)] p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Admin Portal
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>FIREBASE AUTHENTICATION ONLY</span>
            </div>
            <p className="text-xs font-mono text-slate-400 pt-1">
              শুধুমাত্র অনুমোদিত এডমিন একাউন্ট প্রবেশ করতে পারবে
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Administrator Email (এডমিন ইমেইল)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#060b18] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Password (পাসওয়ার্ড)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#060b18] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-black font-bold text-sm hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'Verifying with Firebase...' : 'Sign In via Firebase Auth'}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#060b18]/80 text-center space-y-1.5">
            <p className="text-[11px] font-mono text-cyan-300 font-semibold">
              🔒 সুরক্ষিত এডমিন পোর্টাল • STRICT FIREBASE AUTH
            </p>
            <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
              নতুন এডমিন অ্যাকাউন্ট তৈরি করার সুবিধা বন্ধ রয়েছে। শুধুমাত্র Firebase Authentication-এ পূর্ব-অনুমোদিত এডমিন অ্যাকাউন্ট দিয়ে লগইন করা সম্ভব।
            </p>
          </div>

          {/* Back to site */}
          <div className="text-center pt-1">
            <button
              onClick={handleBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Reset Admin Password</h3>
            <p className="text-xs text-slate-300">
              Enter your registered Firebase administrator email to receive a password recovery link.
            </p>

            {resetSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Password recovery instructions dispatched via Firebase Auth!</span>
              </div>
            )}

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your-email@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-cyan-500/30 bg-[#060b18] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs cursor-pointer hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

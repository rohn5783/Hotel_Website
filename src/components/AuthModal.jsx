import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import GoogleChooserModal from './GoogleChooserModal';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login', triggerReason = 'booking' }) {
  const { login, signup, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          if (res.notFound) {
            setInfoMsg(res.message);
            setMode('signup'); // Switch directly to signup!
          } else {
            setErrorMsg(res.message);
          }
          setLoading(false);
          return;
        }
      } else {
        // Sign Up
        const res = await signup(email, password, fullName);
        if (!res.success) {
          setErrorMsg(res.message);
          setLoading(false);
          return;
        }
      }

      // Success
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    if (isSupabaseConfigured) {
      // Direct real OAuth redirect via Supabase
      setLoading(true);
      const res = await loginWithGoogle();
      setLoading(false);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg(res.message || 'Google Sign-In failed');
      }
    } else {
      // Open Google Account Chooser so user can use their actual Gmail & Name!
      setIsGoogleChooserOpen(true);
    }
  };

  // Demo Quick-Fill Helpers
  const fillDemoAccount = (accEmail, accPass, accName = '') => {
    setEmail(accEmail);
    setPassword(accPass);
    if (accName) setFullName(accName);
    setErrorMsg('');
    setInfoMsg('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gold-500/30 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="bg-royal-950 text-white p-6 pb-5 border-b border-gold-500/20 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-gold-500/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{triggerReason === 'booking' ? 'Login Required to Book' : 'Welcome to The Royal Grand Palace'}</span>
            </div>

            <h3 className="text-2xl font-bold font-serif text-white">
              {mode === 'login' ? 'Sign In to Your Account' : 'Create a New Account'}
            </h3>

            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
              {triggerReason === 'booking'
                ? 'Kripya room reservation confirm karne ke liye sign in karein.'
                : 'Direct booking privileges aur royal hospitality ka anand lein.'}
            </p>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 bg-royal-900/80 p-1 rounded-xl mt-5 border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setInfoMsg('');
                }}
                className={`py-2 rounded-lg transition ${
                  mode === 'login' ? 'bg-gold-500 text-royal-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setInfoMsg('');
                }}
                className={`py-2 rounded-lg transition ${
                  mode === 'signup' ? 'bg-gold-500 text-royal-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Modal Form Body */}
          <div className="p-6">
            {/* Notification / Auto-switch Notice */}
            {infoMsg && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2 animate-bounce-short">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Account nahi mila!</span>
                  {infoMsg}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Real / Chooser Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm flex items-center justify-center gap-3 transition mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.93 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Or with email</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-royal-950 font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo Quick-Fill Helper Pills */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-2 text-center">
                ⚡ Demo Quick Logins (One-Click Test)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    fillDemoAccount('owner@royalgrand.com', 'owner');
                  }}
                  className="py-1.5 px-2 bg-gold-50 hover:bg-gold-100 text-gold-900 rounded-lg border border-gold-200 font-semibold text-center transition"
                >
                  🏨 Hotel Owner Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    fillDemoAccount('superadmin@agency.com', 'admin');
                  }}
                  className="py-1.5 px-2 bg-royal-900 hover:bg-royal-950 text-gold-300 rounded-lg border border-gold-500/30 font-semibold text-center transition"
                >
                  👑 SuperAdmin (Agency)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Realistic Google Sign-In Chooser Popup */}
      <GoogleChooserModal
        isOpen={isGoogleChooserOpen}
        onClose={() => setIsGoogleChooserOpen(false)}
        onSuccess={() => {
          setIsGoogleChooserOpen(false);
          if (onSuccess) onSuccess();
          onClose();
        }}
      />
    </>
  );
}

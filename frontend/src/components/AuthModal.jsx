import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login', triggerReason = 'booking' }) {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [loginRole, setLoginRole] = useState(triggerReason === 'admin_unlock' ? 'admin' : 'user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password, loginRole);
        if (!res.success) {
          setErrorMsg(res.message);
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
              <span>{triggerReason === 'booking' ? 'Login Required to Book' : 'Welcome to Lake Inn'}</span>
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
                  setLoginRole('user');
                  setErrorMsg('');
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
            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'login' && (
                <div>
                  <label htmlFor="login-role" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sign in as
                  </label>
                  <select
                    id="login-role"
                    value={loginRole}
                    onChange={(event) => setLoginRole(event.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Your account role is verified securely when you sign in.
                  </p>
                </div>
              )}

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

          </div>
        </div>
      </div>

    </>
  );
}

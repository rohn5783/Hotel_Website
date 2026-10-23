import React, { useState } from 'react';
import { X, User, Mail, ShieldCheck, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';

export default function GoogleChooserModal({ isOpen, onClose, onSuccess }) {
  const { loginWithGoogle } = useAuth();
  const { hotelData } = useHotel();

  // Remembered accounts or prefill
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_google_accounts') || '[]');
    } catch {
      return [];
    }
  });

  const [isAddingNew, setIsAddingNew] = useState(savedAccounts.length === 0);
  const [actualName, setActualName] = useState('');
  const [actualEmail, setActualEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = async (acc) => {
    await loginWithGoogle(acc.email, acc.name);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleAddNewAccount = async (e) => {
    e.preventDefault();
    const cleanEmail = actualEmail.trim().toLowerCase();
    const cleanName = actualName.trim();

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid Gmail address');
      return;
    }

    if (!cleanName) {
      setErrorMsg('Please enter your actual name');
      return;
    }

    // Save for quick selection next time
    const newAcc = { name: cleanName, email: cleanEmail };
    const updated = [newAcc, ...savedAccounts.filter((a) => a.email !== cleanEmail)];
    localStorage.setItem('saved_google_accounts', JSON.stringify(updated));

    await loginWithGoogle(cleanEmail, cleanName);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative">
        {/* Top Google header */}
        <div className="p-6 pb-4 text-center border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Official Google G Logo */}
          <div className="flex justify-center mb-3">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
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
          </div>

          <h3 className="text-lg font-bold text-slate-900">Sign in with Google</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            to continue to <strong className="text-slate-800">{hotelData.name}</strong>
          </p>
        </div>

        {/* Content */}
        <div className="p-5">
          {errorMsg && (
            <div className="p-2.5 mb-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* List of previously used Google accounts */}
          {!isAddingNew && savedAccounts.length > 0 && (
            <div className="space-y-2 mb-4">
              {savedAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectAccount(acc)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-slate-200 cursor-pointer transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition">
                    {acc.name ? acc.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold text-slate-900 truncate">{acc.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Use another Google account</span>
              </button>
            </div>
          )}

          {/* Enter Real Google Account Form */}
          {isAddingNew && (
            <form onSubmit={handleAddNewAccount} className="space-y-3.5">
              <div className="text-left">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={actualName}
                    onChange={(e) => setActualName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Google / Gmail Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={actualEmail}
                    onChange={(e) => setActualEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                {savedAccounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <span>Sign In with Google</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Google OAuth 2.0 Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
}

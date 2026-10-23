import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Power,
  UserPlus,
  KeyRound,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function SuperAdminModal({ isOpen, onClose }) {
  const { killSwitch, toggleKillSwitch } = useHotel();
  const { createAdminAccount } = useAuth();

  const [isKilled, setIsKilled] = useState(killSwitch.isKilled);
  const [killMessage, setKillMessage] = useState(killSwitch.reason);
  const [killNotice, setKillNotice] = useState('');

  // New Owner form
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPass, setOwnerPass] = useState('hotel2026');
  const [generatedCreds, setGeneratedCreds] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Toggle kill switch
  const handleToggleKill = async () => {
    const nextState = !isKilled;
    setIsKilled(nextState);
    await toggleKillSwitch(nextState, killMessage);
    setKillNotice(
      nextState
        ? '⚠️ KILL SWITCH ACTIVATED! Website is now suspended for regular visitors.'
        : '✅ Website RESTORED! Website is now fully live.'
    );
    setTimeout(() => setKillNotice(''), 4000);
  };

  // Create owner
  const handleCreateOwner = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setGeneratedCreds(null);

    const res = await createAdminAccount(ownerEmail, ownerPass, ownerName);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setGeneratedCreds({
      name: ownerName,
      email: ownerEmail,
      pass: ownerPass,
      date: new Date().toLocaleDateString(),
    });
    setOwnerName('');
    setOwnerEmail('');
  };

  const copyCredsToClipboard = () => {
    if (!generatedCreds) return;
    const text = `🏨 *Hotel Admin Portal Credentials*\n\nWebsite: ${window.location.origin}\nUsername/Email: ${generatedCreds.email}\nTemporary Password: ${generatedCreds.pass}\n\n*Next Steps:* Please log in and go to "Account Security" to link your personal Google Account and update your password.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-red-500/40 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-royal-950 to-royal-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif text-white">
                  Agency SuperAdmin Command Center
                </h3>
                <span className="text-[10px] bg-red-500/30 text-red-300 border border-red-500/50 px-2 py-0.5 rounded-full font-bold">
                  Confidential
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Master controls for Client Kill Switch & Hotel Admin credential generation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50 text-xs">
          {/* Notification */}
          {killNotice && (
            <div
              className={`p-3.5 rounded-xl border font-semibold flex items-center gap-2 ${
                isKilled
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
            >
              <span>{killNotice}</span>
            </div>
          )}

          {/* 1. KILL SWITCH SECTION */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all ${
              isKilled
                ? 'bg-red-50/80 border-red-500 shadow-md'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Power
                    className={`w-5 h-5 ${isKilled ? 'text-red-600' : 'text-emerald-600'}`}
                  />
                  <h4 className="text-base font-bold text-slate-900">
                    Client Kill Switch (Payment Protection)
                  </h4>
                </div>
                <p className="text-slate-500 mt-1">
                  Agar client website ke pese na de ya natak kare, to aap is button se poori website ko instant suspend kar sakte hain.
                </p>
              </div>

              {/* Big Toggle Button */}
              <button
                type="button"
                onClick={handleToggleKill}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition ${
                  isKilled
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{isKilled ? 'KILL SWITCH: ACTIVE (SUSPENDED)' : 'KILL SWITCH: INACTIVE (LIVE)'}</span>
              </button>
            </div>

            {/* Custom Suspension Message Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Suspension Message shown to visitors when killed:
              </label>
              <textarea
                rows="2"
                value={killMessage}
                onChange={(e) => setKillMessage(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* 2. CREATE HOTEL OWNER CREDENTIALS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <UserPlus className="w-4 h-4 text-gold-600" />
              <h4 className="text-base font-bold">Generate Hotel Owner Credentials</h4>
            </div>
            <p className="text-slate-500">
              Create an Admin account for the hotel client. Once you hand them this username/password, they can log in, edit hotel details, and link their own Google account.
            </p>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateOwner} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahipal Singh"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  placeholder="owner@hotel.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="text"
                  required
                  value={ownerPass}
                  onChange={(e) => setOwnerPass(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-3 pt-1">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-royal-950 hover:bg-black text-gold-400 font-bold rounded-xl transition flex items-center gap-2 shadow"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Generate Admin Account</span>
                </button>
              </div>
            </form>

            {/* Generated Credentials Result Box */}
            {generatedCreds && (
              <div className="p-4 bg-gold-50 border border-gold-300 rounded-2xl space-y-3 animate-fade-in mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gold-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Credentials Ready to Send to Client!</span>
                  </span>
                  <button
                    onClick={copyCredsToClipboard}
                    className="py-1 px-3 bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold rounded-lg flex items-center gap-1 transition text-[11px]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy to WhatsApp / Clipboard'}</span>
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gold-200 font-mono text-[11px] text-slate-800 space-y-1">
                  <div><strong>Portal:</strong> {window.location.origin}</div>
                  <div><strong>Username:</strong> {generatedCreds.email}</div>
                  <div><strong>Password:</strong> {generatedCreds.pass}</div>
                  <div><strong>Role:</strong> Hotel Admin (Full Access to CMS & Bookings)</div>
                </div>
              </div>
            )}
          </div>

          {/* 3. CLOUD DATABASE (SUPABASE) STATUS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Supabase Backend Status: {isSupabaseConfigured ? '🟢 Connected (Cloud Postgres)' : '🟡 Local Dual-Mode Demo'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isSupabaseConfigured
                    ? 'All edits and kill switch are synced globally across all devices.'
                    : 'Running in LocalStorage mock mode. Paste Supabase keys into .env for live cloud sync.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

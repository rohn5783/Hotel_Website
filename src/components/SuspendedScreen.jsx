import React from 'react';
import { ShieldAlert, AlertTriangle, KeyRound, Phone, Mail } from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

export default function SuspendedScreen({ onOpenSuperAdminLogin }) {
  const { killSwitch } = useHotel();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center p-6 text-center selection:bg-red-500 selection:text-white">
      <div className="w-full max-w-xl my-auto py-12 px-8 bg-slate-900/90 rounded-3xl border border-red-500/30 shadow-2xl backdrop-blur-xl animate-fade-in">
        {/* Red Alert Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3">
          Website Access Temporarily Suspended
        </h1>

        <div className="h-1 w-20 bg-red-500 mx-auto rounded-full mb-6"></div>

        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          {killSwitch.reason}
        </p>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 text-xs text-slate-400 space-y-2 mb-8">
          <div className="font-semibold text-slate-200">
            For reactivation, please contact the website administrator or digital agency.
          </div>
          <div>Reference: CLIENT-SUSPEND-2026-LOCKED</div>
        </div>

        {/* Agency Unlock / Secret SuperAdmin Trigger */}
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={onOpenSuperAdminLogin}
            className="text-xs text-slate-500 hover:text-gold-400 transition flex items-center justify-center gap-1.5 mx-auto"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Agency SuperAdmin Unlock Portal</span>
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-600 pb-2">
        Powered by Digital Agency Platform • Security Lock Engine
      </div>
    </div>
  );
}

import React from 'react';
import { CalendarDays, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';

export default function OwnerApp() {
  const { currentUser, logout } = useAuth();
  const { hotelData, ownerSummary, loading } = useHotel();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="flex items-center justify-between bg-royal-950 px-6 py-5 text-white">
        <div>
          <h1 className="font-serif text-xl font-bold">{hotelData.name}</h1>
          <p className="mt-1 text-xs text-slate-300">Owner overview · {currentUser?.email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </header>

      <section className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
        <div>
          <h2 className="text-2xl font-bold font-serif">Booking & revenue overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            This account can view totals only. Guest names, contact details, and booking records are restricted to admins.
          </p>
        </div>
        {loading ? (
          <p role="status">Loading hotel information…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-royal-900">
                <CalendarDays className="h-6 w-6" />
                <h3 className="font-semibold">Total bookings</h3>
              </div>
              <p className="mt-4 text-4xl font-bold">{ownerSummary.totalBookings}</p>
              <p className="mt-2 text-sm text-slate-500">
                {ownerSummary.confirmedBookings} confirmed
              </p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-800">
                <TrendingUp className="h-6 w-6" />
                <h3 className="font-semibold">Total booking value</h3>
              </div>
              <p className="mt-4 text-4xl font-bold">
                {hotelData.currency}{ownerSummary.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="mt-2 text-sm text-slate-500">Across all bookings</p>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}

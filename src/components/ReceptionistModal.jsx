import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, Calendar, Phone, Mail, Trash2, CheckCircle2, BedDouble, RefreshCw } from 'lucide-react';
import { hotelConfig } from '../data/hotelData';

export default function ReceptionistModal({ isOpen, onClose }) {
  const [bookings, setBookings] = useState([]);

  const loadBookings = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('hotel_demo_bookings') || '[]');
      if (stored.length === 0) {
        // Pre-load two realistic demo bookings so client sees how it looks initially!
        const initialDemos = [
          {
            id: 'RGH-JP-48201',
            bookingDate: 'Today, 11:30 AM',
            roomName: 'Executive Room',
            roomId: 'executive-room',
            checkIn: new Date().toISOString().split('T')[0],
            checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            nights: 2,
            guestsCount: 2,
            roomsCount: 1,
            guestName: 'Vikramaditya Rathore',
            guestPhone: '+91 98290 87654',
            guestEmail: 'vikram.rathore@example.com',
            specialRequest: 'Late check-in requested (8 PM)',
            arrivalTime: '08:00 PM',
            subtotal: 4000,
            taxes: 480,
            grandTotal: 4480,
            status: 'Confirmed (Pay at Hotel)',
            paymentMode: 'UPI / Cash at Reception'
          },
          {
            id: 'RGH-JP-39145',
            bookingDate: 'Yesterday, 04:15 PM',
            roomName: 'Premium Room',
            roomId: 'premium-room',
            checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            checkOut: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
            nights: 3,
            guestsCount: 3,
            roomsCount: 1,
            guestName: 'Ananya Singhania',
            guestPhone: '+91 99102 33445',
            guestEmail: 'ananya.s@singhania.in',
            specialRequest: 'Palace view balcony room preferred',
            arrivalTime: '02:00 PM',
            subtotal: 9000,
            taxes: 1080,
            grandTotal: 10080,
            status: 'Confirmed (Pay at Hotel)',
            paymentMode: 'Card at Reception'
          }
        ];
        localStorage.setItem('hotel_demo_bookings', JSON.stringify(initialDemos));
        setBookings(initialDemos);
      } else {
        setBookings(stored);
      }
    } catch {
      setBookings([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen]);

  const handleDelete = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('hotel_demo_bookings', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all demo bookings?')) {
      localStorage.removeItem('hotel_demo_bookings');
      setBookings([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-gold-500/40 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-royal-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-gold-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif text-white">
                  Hotel Reception / Front Desk Portal
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Client Demo View
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live list of guests who booked directly through {hotelConfig.name}'s website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadBookings}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              title="Refresh Bookings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Total Direct Bookings</span>
            <span className="text-xl font-bold text-slate-900">{bookings.length}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Expected Revenue</span>
            <span className="text-xl font-bold text-emerald-700 font-serif">
              {hotelConfig.currency}
              {bookings.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Pending Check-in</span>
            <span className="text-xl font-bold text-amber-600">{bookings.length} Guests</span>
          </div>
          <div>
            <span className="text-slate-500 block">Payment Mode</span>
            <span className="text-xs font-semibold text-slate-700">100% Direct at Hotel</span>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-base font-semibold text-slate-700">No bookings found yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Make a demo booking on the website to see it appear right here!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Ref ID</th>
                    <th className="py-3 px-3">Guest Information</th>
                    <th className="py-3 px-3">Room Booked</th>
                    <th className="py-3 px-3">Dates & Nights</th>
                    <th className="py-3 px-3">Amount to Collect</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gold-50/40 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-royal-950">
                        {b.id}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">{b.bookingDate}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 text-sm">{b.guestName}</div>
                        <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gold-600" />
                          <span>{b.guestPhone}</span>
                        </div>
                        <div className="text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{b.guestEmail}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                          {b.roomName}
                        </span>
                        <div className="text-slate-500 text-[11px] mt-1">
                          {b.guestsCount} Guests • {b.roomsCount || 1} Room
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800">{b.checkIn} to {b.checkOut}</div>
                        <div className="text-slate-500 text-[11px]">{b.nights} Night(s)</div>
                        {b.specialRequest && b.specialRequest !== 'None' && (
                          <div className="text-[10px] text-amber-700 italic mt-0.5">
                            Req: "{b.specialRequest}"
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-sm font-bold font-serif text-slate-900">
                          {hotelConfig.currency}{b.grandTotal?.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500">Includes 12% GST</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Pay at Hotel</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Remove booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs text-slate-500">
          <div>
            💡 <span className="font-semibold text-slate-700">Demo Tip:</span> Show this to your client to demonstrate how simple it is to view all customer bookings!
          </div>
          {bookings.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Clear Demo Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

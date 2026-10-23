import React, { useState, useRef } from 'react';
import { Calendar, ChevronRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export default function Hero({ onOpenBooking }) {
  const { hotelData } = useHotel();

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [roomType, setRoomType] = useState('executive-room');
  const [guests, setGuests] = useState('2');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    onOpenBooking({
      checkIn,
      checkOut,
      roomId: roomType,
      guests: Number(guests),
    });
  };

  const openCheckInPicker = () => {
    try {
      checkInRef.current?.showPicker?.();
    } catch {
      checkInRef.current?.focus();
    }
  };

  const openCheckOutPicker = () => {
    try {
      checkOutRef.current?.showPicker?.();
    } catch {
      checkOutRef.current?.focus();
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between bg-royal-950 text-white overflow-hidden">
      {/* Background with Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={hotelData.heroImage}
          alt={hotelData.name}
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.4] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-royal-950/80 via-transparent to-royal-950/80"></div>
      </div>

      {/* Decorative Traditional Border Ornament */}
      <div className="relative z-10 w-full pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center text-center">
        {/* Heritage Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>{hotelData.city}'s Premier Heritage Destination</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl leading-tight">
          Live Like Royalty at <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
            {hotelData.name}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8">
          {hotelData.subTagline || hotelData.tagline}
        </p>

        {/* Key Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gold-200/90 mb-10">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-gold-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Free Royal Breakfast</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-gold-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Free High-Speed Wi-Fi</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-gold-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Rooftop Sky Lounge</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-gold-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Royal Swimming Pool</span>
          </div>
        </div>

        {/* Quick Booking Widget Card */}
        <div className="w-full max-w-5xl bg-royal-900/90 border border-gold-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3 text-left">
            <div className="flex items-center gap-2 text-gold-400 text-sm font-semibold">
              <Calendar className="w-4 h-4" />
              <span>Instant Online Room Booking (Zero Advance Payment)</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Confirmation • Pay at Hotel</span>
            </div>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Check-In Date (Only ONE clean calendar icon inside the date input) */}
            <div
              onClick={openCheckInPicker}
              className="text-left bg-royal-950/90 border border-gold-500/30 hover:border-gold-400 rounded-xl p-3 cursor-pointer transition group"
            >
              <label className="block text-[11px] font-bold text-gold-400 uppercase tracking-wider mb-1 cursor-pointer">
                Check-In Date
              </label>
              <input
                ref={checkInRef}
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
                required
              />
            </div>

            {/* Check-Out Date (Only ONE clean calendar icon inside the date input) */}
            <div
              onClick={openCheckOutPicker}
              className="text-left bg-royal-950/90 border border-gold-500/30 hover:border-gold-400 rounded-xl p-3 cursor-pointer transition group"
            >
              <label className="block text-[11px] font-bold text-gold-400 uppercase tracking-wider mb-1 cursor-pointer">
                Check-Out Date
              </label>
              <input
                ref={checkOutRef}
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
                required
              />
            </div>

            {/* Room Type */}
            <div className="text-left bg-royal-950/90 border border-gold-500/30 hover:border-gold-400 rounded-xl p-3">
              <label className="block text-[11px] font-bold text-gold-400 uppercase tracking-wider mb-1">
                Select Room
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
              >
                {hotelData.rooms.map((room) => (
                  <option key={room.id} value={room.id} className="bg-royal-900 text-white">
                    {room.name} ({hotelData.currency}{room.price.toLocaleString('en-IN')}/day)
                  </option>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div className="text-left bg-royal-950/90 border border-gold-500/30 hover:border-gold-400 rounded-xl p-3">
              <label className="block text-[11px] font-bold text-gold-400 uppercase tracking-wider mb-1">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
              >
                <option value="1" className="bg-royal-900 text-white">1 Adult</option>
                <option value="2" className="bg-royal-900 text-white">2 Adults</option>
                <option value="3" className="bg-royal-900 text-white">3 Guests</option>
                <option value="4" className="bg-royal-900 text-white">4 Guests (Family)</option>
              </select>
            </div>

            {/* Submit / Book Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-royal-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-gold-500/30 transition flex items-center justify-center gap-2 group"
              >
                <span>Reserve Room</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </form>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>⚡ Best online rate guarantee</span>
            <span className="text-gold-300">
              {hotelData.rooms[0]?.name}: {hotelData.currency}{hotelData.rooms[0]?.price.toLocaleString('en-IN')}/day • {hotelData.rooms[1]?.name}: {hotelData.currency}{hotelData.rooms[1]?.price.toLocaleString('en-IN')}/day
            </span>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="h-10 bg-gradient-to-b from-transparent to-[#faf8f5] relative z-10"></div>
    </div>
  );
}

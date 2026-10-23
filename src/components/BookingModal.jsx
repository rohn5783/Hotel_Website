import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Printer,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({
  isOpen,
  onClose,
  initialData,
  onRequireAuth,
}) {
  const { hotelData, addBooking } = useHotel();
  const { currentUser } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [step, setStep] = useState(1); // 1: Room & Dates, 2: Guest Info, 3: Confirmation
  const [roomId, setRoomId] = useState(initialData?.roomId || 'executive-room');
  const [checkIn, setCheckIn] = useState(initialData?.checkIn || today);
  const [checkOut, setCheckOut] = useState(initialData?.checkOut || tomorrow);
  const [guestsCount, setGuestsCount] = useState(initialData?.guests || 2);
  const [roomsCount, setRoomsCount] = useState(1);

  // Guest details form state
  const [guestName, setGuestName] = useState(currentUser?.fullName || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [specialRequest, setSpecialRequest] = useState('');
  const [arrivalTime, setArrivalTime] = useState('02:00 PM');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Update if initialData or currentUser changes
  useEffect(() => {
    if (initialData?.roomId) setRoomId(initialData.roomId);
    if (initialData?.checkIn) setCheckIn(initialData.checkIn);
    if (initialData?.checkOut) setCheckOut(initialData.checkOut);
    if (initialData?.guests) setGuestsCount(initialData.guests);
  }, [initialData]);

  useEffect(() => {
    if (currentUser) {
      if (!guestName && currentUser.fullName) setGuestName(currentUser.fullName);
      if (!guestEmail && currentUser.email) setGuestEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Selected Room
  const selectedRoom =
    hotelData.rooms.find((r) => r.id === roomId) || hotelData.rooms[0];

  // Calculate nights
  const calculateNights = () => {
    try {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diffTime = outDate.getTime() - inDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();
  const roomSubtotal = selectedRoom.price * nights * roomsCount;
  const taxes = Math.round(roomSubtotal * 0.12); // 12% GST
  const grandTotal = roomSubtotal + taxes;

  const handleDatesNext = (e) => {
    e.preventDefault();
    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date!');
      return;
    }

    // AUTH CHECK: User MUST be logged in to proceed!
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setStep(2);
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();

    // Generate random booking ID
    const bookingId = `RGH-JP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking = {
      id: bookingId,
      bookingDate: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      roomName: selectedRoom.name,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      nights,
      guestsCount,
      roomsCount,
      guestName,
      guestPhone,
      guestEmail,
      specialRequest: specialRequest || 'None',
      arrivalTime,
      subtotal: roomSubtotal,
      taxes,
      grandTotal,
      status: 'Confirmed (Pay at Hotel)',
      paymentMode: 'Cash / UPI / Card at Reception',
    };

    // Save to HotelContext & Supabase / LocalStorage
    setBookingError('');
    try {
      await addBooking(newBooking);
    } catch (error) {
      console.error('Booking could not be saved:', error);
      setBookingError('Booking could not be saved. Please check your connection and try again.');
      return;
    }

    setConfirmedBooking(newBooking);
    setStep(3);

    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gold-500/30 flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-royal-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-gold-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Online Hotel Reservation</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              {hotelData.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="bg-royal-900/95 px-6 py-2.5 flex items-center justify-between text-xs text-slate-300 border-b border-white/5">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-gold-400 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
            <span>Room & Dates</span>
          </div>
          <span className="text-slate-600">➔</span>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-gold-400 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
            <span>Guest Details</span>
          </div>
          <span className="text-slate-600">➔</span>
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-400 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
            <span>Instant Confirmation</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: Room & Dates */}
          {step === 1 && (
            <form onSubmit={handleDatesNext} className="space-y-6">
              {/* Room Choice Radio Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Room Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hotelData.rooms.map((room) => {
                    const isSelected = roomId === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setRoomId(room.id)}
                        className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 relative ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50/50 shadow-md ring-1 ring-gold-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-sm text-slate-900 font-serif">
                            {room.name}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-royal-950 text-gold-300">
                            {room.badge}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-3">{room.view} • {room.capacity}</div>
                        <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
                          <span className="text-xs text-slate-400">Rate:</span>
                          <span className="text-base font-bold font-serif text-slate-900">
                            {hotelData.currency}{room.price.toLocaleString('en-IN')}{' '}
                            <span className="text-[11px] font-normal text-slate-500">/day</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests (Family)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Number of Rooms
                  </label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  >
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                </div>
              </div>

              {/* Price Calculation Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-sm space-y-2">
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>
                    {selectedRoom.name} ({hotelData.currency}{selectedRoom.price.toLocaleString('en-IN')} × {nights} {nights === 1 ? 'day/night' : 'days/nights'} × {roomsCount} room)
                  </span>
                  <span className="font-semibold text-slate-900">
                    {hotelData.currency}{roomSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Taxes & GST (12%)</span>
                  <span className="font-semibold text-slate-900">
                    {hotelData.currency}{taxes.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline font-bold">
                  <span className="text-slate-800">Total Payable at Hotel:</span>
                  <span className="text-xl font-serif text-royal-950">
                    {hotelData.currency}{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Free Cancellation & Zero advance payment needed right now!</span>
                </div>
              </div>

              {/* Step 1 Actions */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-royal-950 font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>{currentUser ? 'Continue to Guest Details' : 'Sign In & Continue Booking'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Guest Information */}
          {step === 2 && (
            <form onSubmit={handleGuestSubmit} className="space-y-5">
              {bookingError && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {bookingError}
                </div>
              )}
              <div className="bg-gold-50 rounded-2xl p-3 border border-gold-200 text-xs text-gold-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">{selectedRoom.name}</span> • {nights} night(s) ({checkIn} to {checkOut})
                </div>
                <span className="font-bold text-sm">
                  {hotelData.currency}{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expected Arrival Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    >
                      <option value="12:00 PM">12:00 PM (Early Check-in)</option>
                      <option value="02:00 PM">02:00 PM (Standard)</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="08:00 PM">08:00 PM (Late Evening)</option>
                      <option value="After 10:00 PM">Night (After 10:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Higher floor, airport taxi, twin beds"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode Note */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm text-emerald-950 mb-0.5">
                    Pay at Hotel • No Credit Card Required
                  </span>
                  Your booking will be reserved instantly. You only pay during your stay at the hotel reception (Cash, UPI, or Cards accepted).
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-royal-950 font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Confirm Reservation Now</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Instant Booking Confirmation Voucher */}
          {step === 3 && confirmedBooking && (
            <div className="text-center space-y-6">
              {/* Success Badge */}
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 mb-1">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-serif text-slate-900">
                  Booking Confirmed!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Thank you, <span className="font-semibold text-slate-900">{confirmedBooking.guestName}</span>. Your royal stay is reserved.
                </p>
              </div>

              {/* Booking Reference Card */}
              <div className="bg-royal-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div>
                  <div className="text-[11px] text-gold-400 font-semibold uppercase tracking-wider">Booking Reference ID</div>
                  <div className="text-2xl font-mono font-bold tracking-widest text-white">
                    {confirmedBooking.id}
                  </div>
                </div>
                <div className="bg-gold-500/20 text-gold-300 text-xs px-3 py-1.5 rounded-full border border-gold-500/30 font-semibold">
                  Status: {confirmedBooking.status}
                </div>
              </div>

              {/* Printable Voucher Details */}
              <div id="booking-voucher" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{hotelData.name}</span>
                    <p className="text-slate-500 text-[11px]">{hotelData.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[11px]">Booking Time</span>
                    <p className="font-medium text-slate-800">{confirmedBooking.bookingDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Check-In</span>
                    <span className="font-semibold text-slate-800 text-xs">{confirmedBooking.checkIn}</span>
                    <span className="text-slate-500 text-[10px] block">From 2:00 PM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Check-Out</span>
                    <span className="font-semibold text-slate-800 text-xs">{confirmedBooking.checkOut}</span>
                    <span className="text-slate-500 text-[10px] block">Till 11:00 AM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                    <span className="font-semibold text-slate-800 text-xs">{confirmedBooking.nights} Night(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Room & Guests</span>
                    <span className="font-semibold text-slate-800 text-xs">{confirmedBooking.roomName}</span>
                    <span className="text-slate-500 text-[10px] block">{confirmedBooking.guestsCount} Guests</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Guest Contact</span>
                    <span className="font-medium text-slate-800">{confirmedBooking.guestPhone} • {confirmedBooking.guestEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                    <span className="font-medium text-emerald-700">Pay at Hotel ({confirmedBooking.paymentMode})</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 text-sm font-bold">
                  <span className="text-slate-800">Total Amount to Pay on Check-in:</span>
                  <span className="text-xl font-serif text-royal-950">
                    {hotelData.currency}{confirmedBooking.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="sm:w-1/2 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Voucher</span>
                </button>

                <a
                  href={`https://wa.me/${hotelData.whatsapp ? hotelData.whatsapp.replace(/[^0-9]/g, '') : ''}?text=Hello%20${encodeURIComponent(hotelData.name)},%20I%20have%20booked%20${encodeURIComponent(confirmedBooking.roomName)}%20(Ref:%20${confirmedBooking.id})%20for%20${confirmedBooking.checkIn}%20to%20${confirmedBooking.checkOut}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="sm:w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Share on WhatsApp Reception</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

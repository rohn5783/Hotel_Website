import React, { useState } from 'react';
import { Hotel, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export default function Footer({ onOpenBooking }) {
  const { hotelData } = useHotel();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquiry = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 4000);
  };

  return (
    <footer id="contact" className="bg-royal-950 text-white border-t border-gold-500/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400 p-1 flex items-center justify-center">
                <Hotel className="w-5 h-5 text-gold-400" />
              </div>
              <span className="text-xl font-bold font-serif text-white">
                {hotelData.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {hotelData.tagline}. Discover luxury accommodations in the heart of {hotelData.city} with rooftop dining and traditional Rajputana hospitality.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>{hotelData.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`tel:${hotelData.phone}`} className="hover:text-gold-300 transition">
                  {hotelData.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`mailto:${hotelData.email}`} className="hover:text-gold-300 transition">
                  {hotelData.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-serif text-gold-400 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {hotelData.rooms.map((room) => (
                <li key={room.id}>
                  <a href="#rooms" className="hover:text-gold-400 transition">
                    {room.name} ({hotelData.currency}{room.price.toLocaleString('en-IN')}/day)
                  </a>
                </li>
              ))}
              <li>
                <a href="#amenities" className="hover:text-gold-400 transition">
                  Complimentary Breakfast & Pool
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-gold-400 transition">
                  Rooftop Sky Lounge
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gold-400 transition">
                  Sightseeing & Monuments Guide
                </a>
              </li>
              <li>
                <button onClick={() => onOpenBooking(null)} className="text-gold-400 hover:underline">
                  Direct Online Reservation
                </button>
              </li>
            </ul>
          </div>

          {/* Hotel Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-serif text-gold-400 uppercase tracking-wider">
              Hotel Information
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p><strong className="text-slate-300">Check-in:</strong> {hotelData.checkInTime || '02:00 PM'}</p>
              <p><strong className="text-slate-300">Check-out:</strong> {hotelData.checkOutTime || '11:00 AM'}</p>
              <p><strong className="text-slate-300">Taxes:</strong> 12% GST applicable</p>
              <p><strong className="text-slate-300">Payment:</strong> Pay at Hotel (Cash, Cards, UPI)</p>
              <p><strong className="text-slate-300">Cancellation:</strong> Free cancellation up to 24 hrs</p>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-serif text-gold-400 uppercase tracking-wider">
              Send Quick Message
            </h4>
            {inquirySent ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Thank you! Your inquiry has been sent to our royal concierge.</span>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="Your Phone / WhatsApp"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
                />
                <textarea
                  rows="2"
                  required
                  placeholder="Your question or request..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-400 resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {hotelData.name}, {hotelData.city}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${hotelData.whatsapp ? hotelData.whatsapp.replace(/[^0-9]/g, '') : ''}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>WhatsApp Reception</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

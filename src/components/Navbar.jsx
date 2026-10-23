import React, { useState, useEffect } from 'react';
import {
  Phone,
  Calendar,
  Menu,
  X,
  Hotel,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  onOpenBooking,
  onOpenAuth,
  onReturnToDashboard,
}) {
  const { hotelData } = useHotel();
  const { currentUser, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOwnerOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-royal-950 text-gold-300 text-xs py-2 px-4 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>⭐ Book Direct: Zero advance payment required • Pay on Check-in at Hotel</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`tel:${hotelData.phone}`} className="flex items-center gap-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>{hotelData.phone}</span>
            </a>
            <span className="hidden sm:inline text-gold-500/40">|</span>
            <span className="hidden sm:inline text-slate-300">📍 {hotelData.city}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-royal-950/95 backdrop-blur-md shadow-xl py-3 border-b border-gold-500/20'
            : 'bg-royal-900/90 backdrop-blur-sm py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <div className="w-full h-full bg-royal-950 rounded-full flex items-center justify-center">
                <Hotel className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-serif tracking-wider text-white">
                {hotelData.name}
              </div>
              <div className="text-[10px] tracking-widest uppercase text-gold-400 font-medium">
                {hotelData.city} • Heritage & Luxury
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-200">
            <a href="#rooms" className="hover:text-gold-400 transition">Our Rooms</a>
            <a href="#amenities" className="hover:text-gold-400 transition">Amenities</a>
            <a href="#gallery" className="hover:text-gold-400 transition">Gallery</a>
            <a href="#about" className="hover:text-gold-400 transition">About Hotel</a>
            <a href="#contact" className="hover:text-gold-400 transition">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* If owner is currently previewing live site, show button to return to Owner Dashboard */}
            {isOwnerOrAdmin && onReturnToDashboard && (
              <button
                onClick={onReturnToDashboard}
                className="bg-gold-500 hover:bg-gold-400 text-royal-950 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to Owner Dashboard</span>
              </button>
            )}

            {/* Single Unified Sign In / Sign Up Button */}
            {!currentUser ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs px-4 py-2.5 rounded-xl bg-royal-800 text-gold-300 border border-gold-500/30 hover:bg-gold-500/20 transition flex items-center gap-2 font-semibold"
              >
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>Sign In / Sign Up</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="text-xs px-3.5 py-2 rounded-xl bg-royal-800 text-gold-300 border border-gold-500/40 hover:bg-royal-700 transition flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gold-500 text-royal-950 font-bold flex items-center justify-center text-[11px]">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold max-w-[120px] truncate text-white">
                    {currentUser.fullName || currentUser.email}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    {isOwnerOrAdmin && onReturnToDashboard && (
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          onReturnToDashboard();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gold-50 text-gold-950 font-semibold flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gold-600" />
                        <span>Owner Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Direct Book Now Button */}
            <button
              onClick={() => onOpenBooking(null)}
              className="bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-royal-950 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-gold-500/20 transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Online</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-royal-950 border-t border-gold-500/20 px-4 pt-3 pb-6 space-y-3">
            <a
              href="#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-gold-400 py-1.5 text-base"
            >
              Our Rooms
            </a>
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-gold-400 py-1.5 text-base"
            >
              Amenities
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-gold-400 py-1.5 text-base"
            >
              Gallery
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-gold-400 py-1.5 text-base"
            >
              About Hotel
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-gold-400 py-1.5 text-base"
            >
              Contact
            </a>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              {isOwnerOrAdmin && onReturnToDashboard && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReturnToDashboard();
                  }}
                  className="w-full text-center text-sm py-2.5 rounded-xl bg-gold-500 text-royal-950 font-bold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Return to Owner Dashboard</span>
                </button>
              )}

              {!currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full text-center text-sm py-2 rounded-xl bg-royal-800 text-gold-300 border border-gold-500/30 flex items-center justify-center gap-2 font-semibold"
                >
                  <User className="w-4 h-4 text-gold-400" />
                  <span>Sign In / Sign Up</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center text-xs py-2 text-slate-400 hover:text-white"
                >
                  Log Out ({currentUser.fullName})
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking(null);
                }}
                className="w-full text-center bg-gradient-to-r from-gold-500 to-amber-500 text-royal-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 mt-1"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Room Now</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

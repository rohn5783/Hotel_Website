import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HotelProvider, useHotel } from './context/HotelContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoomsSection from './components/RoomsSection';
import AmenitiesSection from './components/AmenitiesSection';
import GallerySection from './components/GallerySection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import OwnerApp from './components/OwnerApp';
import AdminDashboard from './components/AdminDashboard';
import HotelRobot from './components/HotelRobot';
import SuspendedScreen from './components/SuspendedScreen';
import { Calendar, LayoutDashboard } from 'lucide-react';

function HotelAppContent() {
  const { hotelData, killSwitch } = useHotel();
  const { currentUser, logout } = useAuth();

  // If Owner or SuperAdmin is currently previewing the public site
  const [isPreviewingLive, setIsPreviewingLive] = useState(false);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialData, setBookingInitialData] = useState(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authTriggerReason, setAuthTriggerReason] = useState('manual'); // 'manual' or 'booking'

  // Open booking flow
  const handleOpenBooking = (data = null) => {
    setBookingInitialData(data);
    setIsBookingOpen(true);
  };

  const handleSelectRoom = (roomId) => {
    setBookingInitialData({ roomId });
    setIsBookingOpen(true);
  };

  // Open Auth modal (Single unified login)
  const handleOpenAuth = (mode = 'login', reason = 'manual') => {
    setAuthMode(mode);
    setAuthTriggerReason(reason);
    setIsAuthOpen(true);
  };

  // Callback when Booking form requires login first
  const handleRequireAuthForBooking = () => {
    handleOpenAuth('login', 'booking');
  };

  // When Auth succeeds
  const handleAuthSuccess = () => {
    if (authTriggerReason === 'booking') {
      setIsBookingOpen(true);
    }
  };

  // KILL SWITCH ACTIVE CHECK
  if (killSwitch?.isKilled && currentUser?.role !== 'admin') {
    return (
      <>
        <SuspendedScreen
          onOpenSuperAdminLogin={() => handleOpenAuth('login', 'admin_unlock')}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => setIsAuthOpen(false)}
          initialMode="login"
          triggerReason="admin_unlock"
        />
      </>
    );
  }

  // =========================================================================
  // Owners see only aggregate revenue and booking counts.
  // =========================================================================
  if (currentUser?.role === 'owner') {
    return <OwnerApp />;
  }
  if (currentUser?.role === 'admin') {
    return <AdminDashboard isOpen onClose={logout} />;
  }

  // =========================================================================
  // 2. PUBLIC WEBSITE (For Guests, Visitors & Owner Preview Mode):
  // Clean, luxury hotel design with zero clutter and 1 single Sign In / Sign Up!
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col selection:bg-gold-500 selection:text-white">
      {/* If Owner is previewing the live website, show top sticky banner to return */}
      {currentUser?.role === 'admin' && isPreviewingLive && (
        <div className="bg-royal-950 text-gold-300 text-xs px-4 py-2 border-b border-gold-500/30 flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>👁️ <strong>Live Preview Mode:</strong> This is how your guests see the website.</span>
          </div>
          <button
            onClick={() => setIsPreviewingLive(false)}
            className="bg-gold-500 hover:bg-gold-400 text-royal-950 font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 transition text-[11px]"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Return to Owner Dashboard</span>
          </button>
        </div>
      )}

      {/* Navigation (Single unified Sign In / Sign Up) */}
      <Navbar
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAuth={(mode) => handleOpenAuth(mode, 'manual')}
        onReturnToDashboard={() => setIsPreviewingLive(false)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* Highlights Bar */}
        <section className="bg-white border-b border-slate-200 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-center text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">☕</span>
              <span className="font-semibold text-slate-800">Complimentary Royal Breakfast</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏊</span>
              <span className="font-semibold text-slate-800">Sparkling Swimming Pool</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌅</span>
              <span className="font-semibold text-slate-800">Sunset Rooftop Sky Lounge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📶</span>
              <span className="font-semibold text-slate-800">200 Mbps High-Speed Wi-Fi</span>
            </div>
          </div>
        </section>

        {/* Rooms Section */}
        <RoomsSection onSelectRoom={handleSelectRoom} />

        {/* Amenities Section */}
        <AmenitiesSection />

        {/* Gallery Tour */}
        <GallerySection />

        {/* About & Nearby Attractions */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Interactive Hotel AI Concierge Robot */}
      <HotelRobot onOpenBooking={handleOpenBooking} />

      {/* Direct Booking Modal (Gated with Auth) */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={bookingInitialData}
        onRequireAuth={handleRequireAuthForBooking}
      />

      {/* Single Unified Authentication Modal (Login / Signup + Google) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
        triggerReason={authTriggerReason}
      />

      {/* Mobile Sticky Booking Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-royal-950/95 backdrop-blur-md border-t border-gold-500/30 p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="text-left">
          <div className="text-[10px] text-gold-400 font-semibold uppercase">Direct Booking</div>
          <div className="text-sm font-bold text-white font-serif">
            From {hotelData.currency}{hotelData.rooms[0]?.price.toLocaleString('en-IN')} / day
          </div>
        </div>
        <button
          onClick={() => handleOpenBooking(null)}
          className="bg-gradient-to-r from-gold-500 to-amber-500 text-royal-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HotelProvider>
        <HotelAppContent />
      </HotelProvider>
    </AuthProvider>
  );
}

import React, { useState } from 'react';
import { Bed, Users, Maximize2, Check, Sparkles, ArrowRight, Info } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export default function RoomsSection({ onSelectRoom }) {
  const { hotelData } = useHotel();
  const [selectedDetailRoom, setSelectedDetailRoom] = useState(null);

  return (
    <section id="rooms" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Luxury Accommodations</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 mb-4 tracking-tight">
          Handcrafted Rooms & Suites
        </h2>
        <p className="text-slate-600 text-base sm:text-lg">
          Designed for pure comfort, royal luxury, and modern convenience. Every stay includes complimentary royal breakfast, pool access, and high-speed Wi-Fi.
        </p>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {hotelData.rooms.map((room) => {
          const isPremium = room.id === 'premium-room';

          return (
            <div
              key={room.id}
              className={`bg-white rounded-3xl overflow-hidden shadow-xl border transition-all duration-300 hover:shadow-2xl flex flex-col justify-between ${
                isPremium
                  ? 'border-gold-400 ring-2 ring-gold-400/20'
                  : 'border-slate-200 hover:border-gold-300'
              }`}
            >
              {/* Room Image Container */}
              <div className="relative h-72 sm:h-80 overflow-hidden group">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-full shadow-md ${
                      isPremium
                        ? 'bg-gradient-to-r from-amber-500 to-gold-500 text-royal-950 font-extrabold'
                        : 'bg-royal-950/80 text-gold-300 border border-gold-500/30 backdrop-blur-md'
                    }`}
                  >
                    {room.badge}
                  </span>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 right-4 bg-royal-950/90 backdrop-blur-md border border-gold-500/30 text-white px-4 py-2 rounded-2xl shadow-lg">
                  <div className="text-xs text-gold-400 font-medium">Starting from</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-serif text-white">
                      {hotelData.currency}{room.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-300">/ day</span>
                  </div>
                </div>

                {/* Room Name on Image */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold font-serif">{room.name}</h3>
                  <p className="text-xs text-slate-200">{room.view}</p>
                </div>
              </div>

              {/* Room Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* Quick Specs Pill */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-gold-600" />
                      <span className="font-medium text-slate-800">{room.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-gold-600" />
                      <span className="font-medium text-slate-800">{room.bed ? room.bed.split(' ')[0] : 'King'} Bed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gold-600" />
                      <span className="font-medium text-slate-800">{room.capacity ? room.capacity.split(' ')[0] : '2'} Guests</span>
                    </div>
                  </div>

                  {/* Room Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {room.description}
                  </p>

                  {/* Key Highlights list */}
                  <div className="space-y-2.5 mb-8">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Included with this room:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {room.features?.slice(0, 6).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedDetailRoom(room)}
                    className="sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => onSelectRoom(room.id)}
                    className={`sm:w-2/3 py-3 px-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group ${
                      isPremium
                        ? 'bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-royal-950'
                        : 'bg-royal-900 hover:bg-royal-950 text-white'
                    }`}
                  >
                    <span>Book {room.name} Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Details Modal */}
      {selectedDetailRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
                  {selectedDetailRoom.badge}
                </span>
                <h3 className="text-2xl font-bold font-serif text-slate-900">
                  {selectedDetailRoom.name}
                </h3>
                <p className="text-sm text-slate-500">{selectedDetailRoom.view}</p>
              </div>
              <button
                onClick={() => setSelectedDetailRoom(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedDetailRoom.image}
              alt={selectedDetailRoom.name}
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />

            <div className="grid grid-cols-3 gap-3 p-3 bg-gold-50 rounded-2xl mb-6 text-center text-xs">
              <div>
                <span className="text-slate-500 block">Room Size</span>
                <span className="font-bold text-slate-800">{selectedDetailRoom.size}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Bed Type</span>
                <span className="font-bold text-slate-800">{selectedDetailRoom.bed}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Capacity</span>
                <span className="font-bold text-slate-800">{selectedDetailRoom.capacity}</span>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {selectedDetailRoom.description}
            </p>

            <h4 className="font-bold text-sm text-slate-900 mb-3">All In-Room Amenities & Privileges:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {selectedDetailRoom.features?.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <div className="text-xs text-slate-500">Rate per day</div>
                <div className="text-2xl font-bold font-serif text-slate-900">
                  {hotelData.currency}{selectedDetailRoom.price.toLocaleString('en-IN')}
                </div>
              </div>
              <button
                onClick={() => {
                  const rId = selectedDetailRoom.id;
                  setSelectedDetailRoom(null);
                  onSelectRoom(rId);
                }}
                className="bg-gold-500 hover:bg-gold-600 text-royal-950 font-bold px-6 py-3 rounded-xl shadow-lg transition"
              >
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

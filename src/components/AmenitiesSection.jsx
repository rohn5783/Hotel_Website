import React from 'react';
import { Coffee, UtensilsCrossed, Wifi, Waves, Car, BellRing, Sparkles, CheckCircle2 } from 'lucide-react';
import { hotelConfig } from '../data/hotelData';

const iconMap = {
  Coffee: Coffee,
  UtensilsCrossed: UtensilsCrossed,
  Wifi: Wifi,
  Waves: Waves,
  Car: Car,
  BellRing: BellRing
};

export default function AmenitiesSection() {
  return (
    <section id="amenities" className="py-20 bg-gradient-to-b from-white to-gold-50/50 border-y border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Inclusive Luxury Privileges</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 mb-4 tracking-tight">
            Crafted for Unmatched Comfort
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            From sunrise breakfast spreads to sunset dining atop our rooftop terrace, enjoy world-class amenities designed for your memorable Jaipur getaway.
          </p>
        </div>

        {/* 6 Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotelConfig.amenities.map((item) => {
            const IconComponent = iconMap[item.icon] || Sparkles;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-7 border border-gold-200/60 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gold-100/80 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300 flex items-center justify-center text-gold-700">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-royal-950 text-gold-300">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif group-hover:text-gold-700 transition">
                  {item.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Special Highlight Banner: Rooftop & Swimming Pool */}
        <div className="mt-16 rounded-3xl bg-royal-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-gold-500/30">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Guest Exclusive Highlight</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold font-serif text-white mb-4">
                Sunset Rooftop Lounge & Azure Pool
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                Unwind by our tranquil royal pool during the sunny afternoons, and head up to the rooftop terrace for an unforgettable evening with candlelit dining, signature mocktails, and live Rajasthani folk music overlooking the Jaipur skyline.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-gold-300">
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">🌅 Sunset Views</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">🏊 Pool Towels Provided</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">🎵 Live Music Evenings</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src={hotelConfig.gallery[1].image}
                alt="Rooftop"
                className="w-full h-48 sm:h-56 object-cover rounded-2xl border border-gold-500/20 shadow-lg transform -rotate-1 hover:rotate-0 transition duration-300"
              />
              <img
                src={hotelConfig.gallery[0].image}
                alt="Pool"
                className="w-full h-48 sm:h-56 object-cover rounded-2xl border border-gold-500/20 shadow-lg transform rotate-1 hover:rotate-0 transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { MapPin, Navigation, Compass } from "lucide-react";
import { useHotel } from "../context/HotelContext";

export default function AboutSection() {
  const { hotelData } = useHotel();

  return (
    <section
      id="about"
      className="py-20 bg-slate-900 text-white relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-gold-500/30">
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span>Heritage Meets Hospitality</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mb-6 leading-tight">
              A Royal Haven in the Heart of {hotelData.city}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6 font-light">
              Nestled in the prime cultural corridor of {hotelData.city},{" "}
              <span className="text-gold-400 font-semibold">
                {hotelData.name}
              </span>{" "}
              offers an authentic taste of princely Rajasthan. Designed with
              delicate jharokha arches, stone jaali craftsmanship, and marble
              courtyards, our property transports you into an era of maharajas
              without compromising on modern luxuries.
            </p>

            <div className="grid grid-cols-2 gap-6 my-8">
              <div className="border-l-2 border-gold-500 pl-4">
                <span className="text-2xl sm:text-3xl font-bold font-serif text-gold-400 block">
                  4.9 / 5
                </span>
                <span className="text-xs text-slate-400">
                  Guest Satisfaction Rating
                </span>
              </div>
              <div className="border-l-2 border-gold-500 pl-4">
                <span className="text-2xl sm:text-3xl font-bold font-serif text-gold-400 block">
                  100% Direct
                </span>
                <span className="text-xs text-slate-400">
                  Zero Commission Booking
                </span>
              </div>
            </div>

            <div className="bg-royal-950/70 p-4 rounded-2xl border border-gold-500/20 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-gold-400 flex-shrink-0" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white block text-sm">
                  Strategic Location
                </span>
                {hotelData.address}
              </div>
            </div>
          </div>

          {/* Right: Nearby Tourist Spots */}
          <div>
            <div className="bg-royal-950/90 rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl">
              <h3 className="text-xl font-bold font-serif text-white mb-2 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-gold-400" />
                <span>Minutes from Iconic Landmarks</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Our central location lets you explore the greatest monuments
                effortlessly.
              </p>

              <div className="space-y-4">
                {hotelData.nearbyAttractions?.map((spot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/40 transition group"
                  >
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition">
                        {spot.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Iconic heritage site
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        {spot.distance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

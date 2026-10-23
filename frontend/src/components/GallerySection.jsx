import React from 'react';
import { Sparkles, Camera } from 'lucide-react';
import { hotelConfig } from '../data/hotelData';

export default function GallerySection() {
  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Camera className="w-3.5 h-3.5 text-gold-600" />
          <span>Visual Tour</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 mb-4 tracking-tight">
          Glimpses of Grandeur
        </h2>
        <p className="text-slate-600 text-base sm:text-lg">
          Immerse yourself in centuries of Rajputana elegance blended with contemporary luxury.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotelConfig.gallery.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-3xl overflow-hidden shadow-lg h-80 sm:h-96 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block mb-1">
                {hotelConfig.name}
              </span>
              <h3 className="text-lg font-bold font-serif text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

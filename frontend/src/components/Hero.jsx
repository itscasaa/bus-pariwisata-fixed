import React, { useState } from 'react';
import siteData from '../data/siteData';

const Hero = () => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-24 pb-32"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(29,110,197,0.75), rgba(96,165,250,0.6)), url(${siteData.hero.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Subtle Overlay Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto w-full">
        {/* Trust Badges */}
        <div className="inline-flex flex-wrap justify-center gap-3 mb-6 animate-fade-in">
          <span className="bg-[var(--color-primary)/20] backdrop-blur-md text-white border border-[var(--color-primary)]/30 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <i className="fas fa-shield-alt text-blue-400"></i> Armada Terawat & Aman
          </span>
          <span className="bg-blue-500/20 backdrop-blur-md text-white border border-blue-400/30 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <i className="fas fa-user-tie text-blue-400"></i> Supir Profesional
          </span>
          <span className="bg-blue-500/20 backdrop-blur-md text-white border border-blue-400/30 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <i className="fas fa-dollar-sign text-blue-400"></i> Harga Kompetitif
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight tracking-tight text-white drop-shadow-sm">
          Perjalanan Aman, Wisata <span className="text-white">Menyenangkan</span>
        </h1>
        
        <p className="text-base md:text-lg lg:text-xl text-white mb-10 max-w-3xl mx-auto font-medium">
          Sewa bus pariwisata premium & paket tour eksklusif bersama Surya Tour Trans. Nikmati perjalanan dengan kenyamanan bintang lima.
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-7 border border-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
              {/* Destination */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  <i className="fas fa-map-marker-alt text-[#1d6ec5] mr-1"></i> Destinasi Wisata
                </label>
                <div className="relative">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full border border-gray-200 hover:border-blue-300 rounded-xl px-4 py-3.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]/30 focus:border-[#1d6ec5] appearance-none cursor-pointer font-medium transition-all"
                  >
                    <option value="">Pilih Destinasi</option>
                    {siteData.hero.destinations.map((dest) => (
                      <option key={dest.value} value={dest.value}>
                        {dest.label}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              {/* Duration */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  <i className="fas fa-clock text-[#1d6ec5] mr-1"></i> Durasi Tour
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-gray-200 hover:border-blue-300 rounded-xl px-4 py-3.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]/30 focus:border-[#1d6ec5] appearance-none cursor-pointer font-medium transition-all"
                  >
                    <option value="">Pilih Durasi</option>
                    {siteData.hero.durations.map((dur) => (
                      <option key={dur.value} value={dur.value}>
                        {dur.label}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              {/* Search Button */}
              <div>
                <button
                  onClick={() => alert(`Mencari: ${destination || 'Semua'} - ${duration || 'Semua'}`)}
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-lg"
                >
                  <i className="fas fa-search mr-2"></i> Cari Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
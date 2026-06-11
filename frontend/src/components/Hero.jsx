import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

const Hero = () => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration]       = useState('');
  const [passengers, setPassengers]   = useState('');
  const [date, setDate]               = useState('');
  const [paketList, setPaketList]     = useState([]);
  const navigate = useNavigate();

  // Fetch semua paket untuk isi dropdown
  useEffect(() => {
    fetch(`${API_BASE}/paket_wisata.php`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') setPaketList(data.data || []);
      })
      .catch(() => {});
  }, []);

  // Destinasi unik dari judul paket
  const destinasiOptions = [...new Set(paketList.map(p => p.judul))];

  // Kategori paket untuk durasi
  const durasiOptions = [...new Set(paketList.map(p => p.kategori).filter(Boolean))];

  const handleConsult = (e) => {
    e.preventDefault();
    const text = `Halo Mafina Trans, saya ingin konsultasi sewa bus.
Tujuan: ${destination || '-'}
Durasi: ${duration || '-'}
Jumlah Penumpang: ${passengers || '-'}
Tanggal: ${date || '-'}`;
    
    const waUrl = `https://wa.me/6285199802536?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const heroImage = '/images/bannerv2.webp';
  const waLink = `https://wa.me/6285199802536?text=${encodeURIComponent('Halo Mafina Trans, saya ingin bertanya tentang sewa bus pariwisata.')}`;

  return (
    <section className="relative min-h-[800px] lg:min-h-[850px] flex items-center pt-28 pb-36 text-white overflow-hidden bg-[#062D5F]">
      
      {/* Background Image Layer - Desktop */}
      <img 
        src="/images/bannerv2.webp"
        alt="Mafina Trans Bus Background"
        className="hidden md:block absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          objectPosition: '55% center',
          zIndex: 1
        }}
      />

      {/* Background Image Layer - Mobile */}
      <img 
        src="/images/bannermobile.webp"
        alt="Mafina Trans Bus Background Mobile"
        className="block md:hidden absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          objectPosition: '55% center',
          zIndex: 1
        }}
      />

      {/* Dark blue overlay on the left for text contrast, and bottom white gradient fade overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, transparent 88%, rgba(255, 255, 255, 0.6) 94%, #FFFFFF 100%),
            linear-gradient(90deg, #073B78 0%, rgba(7, 59, 120, 0.95) 25%, rgba(7, 59, 120, 0.7) 45%, rgba(7, 59, 120, 0.3) 60%, transparent 80%)
          `,
          zIndex: 2
        }}
      ></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full">
        {/* Bounded Column for Hero copy text and actions to stay inside the blue circle */}
        <div className="max-w-full md:max-w-[50%] lg:max-w-[45%] xl:max-w-[40%] space-y-6 text-left">
          
          {/* Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Sewa Bus Pariwisata Terpercaya untuk Perjalanan Nyaman Anda
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-white/90 leading-relaxed">
            Armada lengkap, paket wisata menarik, dan layanan profesional untuk perjalanan keluarga, sekolah, perusahaan, hingga rombongan wisata.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              Pesan via WhatsApp
            </a>
            <Link
              to="/bus-wisata"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3.5 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center gap-2"
            >
              <i className="fas fa-bus"></i>
              Lihat Armada
            </Link>
          </div>
        </div>

        {/* Booking / Search Form - Glassmorphism container */}
        <div className="pt-8 max-w-full md:max-w-[50%] lg:max-w-[45%] xl:max-w-[40%]">
          <div 
            className="rounded-3xl p-6 md:p-8 shadow-2xl text-gray-900 border border-[#DDEAF6]/20"
            style={{
              background: 'rgba(6, 45, 95, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <h2 className="text-white font-extrabold text-lg md:text-xl mb-5 flex items-center gap-2">
              <i className="fas fa-calendar-check text-[#FFD23F]"></i>
              Form Pemesanan Bus Pariwisata
            </h2>
            
            <form onSubmit={handleConsult} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              {/* Destinasi */}
              <div className="text-left font-sans">
                <label htmlFor="destination-select" className="block text-[10px] font-bold text-white/80 mb-2 uppercase tracking-wider">
                  <i className="fas fa-map-marker-alt text-[#FFD23F] mr-1"></i> Destinasi / Tujuan
                </label>
                <div className="relative">
                  <select
                    id="destination-select"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full border border-white/20 hover:border-[#FFD23F] rounded-xl px-3.5 py-3 text-white bg-[#062D5F]/85 focus:outline-none focus:ring-2 focus:ring-[#FFD23F]/30 focus:border-[#FFD23F] appearance-none cursor-pointer text-xs font-semibold transition-all"
                    required
                  >
                    <option value="" className="text-gray-900 bg-white">Pilih Tujuan</option>
                    {destinasiOptions.map((judul) => (
                      <option key={judul} value={judul} className="text-gray-900 bg-white">{judul}</option>
                    ))}
                    <option value="Lainnya / Custom" className="text-gray-900 bg-white">Lainnya (Tulis detail di WA)</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-xs"></i>
                </div>
              </div>

              {/* Durasi */}
              <div className="text-left font-sans">
                <label htmlFor="duration-select" className="block text-[10px] font-bold text-white/80 mb-2 uppercase tracking-wider">
                  <i className="fas fa-clock text-[#FFD23F] mr-1"></i> Durasi
                </label>
                <div className="relative">
                  <select
                    id="duration-select"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-white/20 hover:border-[#FFD23F] rounded-xl px-3.5 py-3 text-white bg-[#062D5F]/85 focus:outline-none focus:ring-2 focus:ring-[#FFD23F]/30 focus:border-[#FFD23F] appearance-none cursor-pointer text-xs font-semibold transition-all"
                    required
                  >
                    <option value="" className="text-gray-900 bg-white">Pilih Durasi</option>
                    {durasiOptions.length > 0 ? (
                      durasiOptions.map((kat) => (
                        <option key={kat} value={kat} className="text-gray-900 bg-white">{kat}</option>
                      ))
                    ) : (
                      <>
                        <option value="1 Hari (One Day Tour)" className="text-gray-900 bg-white">1 Hari (One Day Tour)</option>
                        <option value="2 Hari 1 Malam" className="text-gray-900 bg-white">2 Hari 1 Malam</option>
                        <option value="3 Hari 2 Malam" className="text-gray-900 bg-white">3 Hari 2 Malam</option>
                        <option value="4+ Hari" className="text-gray-900 bg-white">4+ Hari</option>
                      </>
                    )}
                  </select>
                  <i className="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-xs"></i>
                </div>
              </div>

              {/* Jumlah Penumpang */}
              <div className="text-left font-sans">
                <label htmlFor="passengers-input" className="block text-[10px] font-bold text-white/80 mb-2 uppercase tracking-wider">
                  <i className="fas fa-users text-[#FFD23F] mr-1"></i> Jumlah Penumpang
                </label>
                <input
                  id="passengers-input"
                  type="text"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  placeholder="Contoh: 40 Orang"
                  className="w-full border border-white/20 hover:border-[#FFD23F] rounded-xl px-3.5 py-3.5 text-white bg-[#062D5F]/85 focus:outline-none focus:ring-2 focus:ring-[#FFD23F]/30 focus:border-[#FFD23F] text-xs font-semibold transition-all placeholder-white/45"
                  required
                />
              </div>

              {/* Tanggal */}
              <div className="text-left font-sans">
                <label htmlFor="date-input" className="block text-[10px] font-bold text-white/80 mb-2 uppercase tracking-wider">
                  <i className="fas fa-calendar-alt text-[#FFD23F] mr-1"></i> Tanggal Berangkat
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-white/20 hover:border-[#FFD23F] rounded-xl px-3.5 py-3 text-white bg-[#062D5F]/85 focus:outline-none focus:ring-2 focus:ring-[#FFD23F]/30 focus:border-[#FFD23F] text-xs font-semibold transition-all cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>

              {/* Button */}
              <div className="col-span-1 sm:col-span-2 mt-2">
                <button
                  type="submit"
                  className="w-full bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] text-xs uppercase tracking-wider"
                >
                  <i className="fas fa-search"></i> Cari / Konsultasi Paket
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

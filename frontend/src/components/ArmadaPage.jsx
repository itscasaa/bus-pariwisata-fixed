import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import API_BASE from '../config/api';
import siteData from '../data/siteData';
import BusCard from './BusCard';

const formatTypeLabel = (type) => {
  if (type === 'all') return 'Semua Armada';
  if (type === 'hiace') return 'HiAce';
  if (type === 'elf') return 'Elf';
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const ArmadaPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollToCategory = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const swiperProps = {
    modules: [Navigation],
    spaceBetween: 24,
    slidesPerView: 1,
    navigation: true,
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
    className: "pb-8 pt-2 px-1",
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/buses.php`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setBuses(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || 'Gagal memuat data armada.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ===== HERO BANNER ===== */}
      <div className="relative text-white py-28 md:py-36 overflow-hidden text-center bg-[#062D5F]">
        {/* Background Image */}
        <img 
          src="/images/bannerarmada.webp" 
          alt="Armada Banner" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: 'center', zIndex: 1 }}
        />
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: 'linear-gradient(180deg, rgba(6, 45, 95, 0.82) 0%, rgba(4, 30, 66, 0.92) 100%)',
            zIndex: 2
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,210,63,0.1),transparent)] pointer-events-none" style={{ zIndex: 3 }}></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Armada Bus Pariwisata
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Pilih armada terbaik untuk kebutuhan perjalanan Anda. Tersedia berbagai kapasitas dengan fasilitas premium, supir profesional, dan BBM gratis.
          </p>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-[#F3FAFF] border-b border-[#DDEAF6]">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs justify-center" style={{ color: '#10233F' }}>
          <span><i className="fas fa-check-circle text-[#128C7E] mr-1"></i>Harga sudah termasuk: sewa bus, BBM, driver, helper &amp; asuransi jiwa</span>
          <span><i className="fas fa-times-circle text-red-500 mr-1"></i>Belum termasuk: toll, parkir, tips, tiket wisata &amp; kapal ferry</span>
        </div>
      </div>

      {/* ===== MAIN GRID ===== */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#0B5CA8', borderTopColor: 'transparent' }}></div>
              <p className="font-semibold text-[#64748B]">Memuat daftar armada...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20 bg-white border border-[#DDEAF6] rounded-3xl max-w-lg mx-auto px-6 shadow-md">
              <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
              <h3 className="text-xl font-bold mb-2 text-[#10233F]">Koneksi Gagal</h3>
              <p className="text-sm mb-6 text-[#64748B]">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#10233F] font-bold px-6 py-2.5 rounded-xl transition hover:opacity-90"
                style={{ background: '#FFD23F' }}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && buses.length === 0 && (
            <div className="text-center py-20 bg-white border border-[#DDEAF6] rounded-3xl max-w-lg mx-auto px-6 shadow-md">
              <i className="fas fa-bus text-5xl mb-4 text-[#DDEAF6]"></i>
              <p className="font-semibold text-[#64748B]">Belum ada armada bus yang tersedia saat ini.</p>
            </div>
          )}

          {!loading && !error && buses.length > 0 && (() => {
            // Group buses by type
            const categorizedBuses = {};
            buses.forEach(bus => {
              const cat = bus.tipe || 'other';
              if (!categorizedBuses[cat]) {
                categorizedBuses[cat] = [];
              }
              categorizedBuses[cat].push(bus);
            });

            // Sort categories by preferred order
            const categoryOrder = ['big_bus', 'medium_bus', 'elf', 'hiace'];
            const sortedCategories = Object.keys(categorizedBuses).sort((a, b) => {
              const indexA = categoryOrder.indexOf(a);
              const indexB = categoryOrder.indexOf(b);
              if (indexA === -1 && indexB === -1) return a.localeCompare(b);
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });

            return (
              <>
                {/* Quick Navigation Scroll Buttons */}
                <div className="flex flex-wrap justify-center gap-2.5 mb-12 shrink-0">
                  {sortedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => scrollToCategory(cat)}
                      className="px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer bg-[#F3FAFF] text-[#0B5CA8] border-[#DDEAF6] hover:bg-[#EAF6FF] hover:border-[#0B5CA8]/30 shadow-sm"
                    >
                      {formatTypeLabel(cat)} ({categorizedBuses[cat].length})
                    </button>
                  ))}
                </div>

                {/* Stacked Category Carousels */}
                <div className="space-y-16">
                  {sortedCategories.map((cat) => {
                    const busesInCat = categorizedBuses[cat];
                    return (
                      <div key={cat} id={cat} className="scroll-mt-24">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6 border-b border-[#DDEAF6] pb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-6 bg-[#0B5CA8] rounded-full"></span>
                            <h2 className="text-lg md:text-xl font-extrabold text-[#10233F]">
                              {formatTypeLabel(cat)}
                            </h2>
                            <span className="bg-[#EAF6FF] text-[#0B5CA8] text-xs font-bold px-2.5 py-1 rounded-full">
                              {busesInCat.length} Unit
                            </span>
                          </div>
                        </div>

                        {/* Swiper Carousel */}
                        <Swiper {...swiperProps}>
                          {busesInCat.map((bus) => (
                            <SwiperSlide key={bus.id} className="h-auto">
                              <BusCard bus={bus} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}

        </div>
      </section>
    </div>
  );
};

export default ArmadaPage;

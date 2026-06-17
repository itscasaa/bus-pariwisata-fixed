import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import API_BASE from '../config/api';
import siteData from '../data/siteData';

const getFacilityIcon = (facility) => {
  const facLower = facility.toLowerCase();
  if (facLower.includes('ac')) return 'fa-snowflake';
  if (facLower.includes('seat') || facLower.includes('kursi')) return 'fa-chair';
  if (facLower.includes('audio') || facLower.includes('sound')) return 'fa-volume-up';
  if (facLower.includes('bagasi')) return 'fa-suitcase';
  if (facLower.includes('bantal') || facLower.includes('selimut')) return 'fa-bed';
  if (facLower.includes('tv') || facLower.includes('monitor')) return 'fa-tv';
  if (facLower.includes('dispenser')) return 'fa-tint';
  return 'fa-check-circle';
};

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
                              <div className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full">
                                {/* Image */}
                                <div className="aspect-[4/3] overflow-hidden relative bg-[#F3FAFF]">
                                  <img
                                    src={bus.gambar_utama || bus.gambar}
                                    alt={bus.nama_bus}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.src = '/images/default-bus.jpg'; }}
                                  />
                                  {bus.diskon && (
                                    <div className="absolute top-4 right-4 bg-[#ba1a1a] text-white text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                                      Diskon {bus.diskon}
                                    </div>
                                  )}
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="bg-[#EAF6FF] text-[#0B5CA8] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                      {bus.tipe ? bus.tipe.replace('_', ' ') : 'Bus'}
                                    </span>
                                    <span className="text-[#64748B] text-xs flex items-center gap-1">
                                      <i className="fas fa-users text-[#0B5CA8]"></i> {bus.kapasitas} Kursi
                                    </span>
                                  </div>

                                  <h3 className="font-extrabold text-[#10233F] text-base md:text-lg hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-1 mb-1">
                                    {bus.nama_bus}
                                  </h3>

                                  <p className="text-[#0B5CA8] font-black text-base mt-2 mb-4">
                                    Rp {new Intl.NumberFormat('id-ID').format(bus.harga_sewa)} <span className="text-xs text-[#64748B] font-normal">/ Hari</span>
                                  </p>

                                  {bus.fasilitas && bus.fasilitas.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                      {bus.fasilitas.slice(0, 3).map((fac, i) => (
                                        <span
                                          key={i}
                                          className="text-[11px] font-medium px-2 py-0.5 rounded-lg flex items-center gap-1 bg-[#F3FAFF] text-[#64748B] border border-[#DDEAF6]"
                                        >
                                          <i className={`fas ${getFacilityIcon(fac)}`}></i>
                                          {fac}
                                        </span>
                                      ))}
                                      {bus.fasilitas.length > 3 && (
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#EAF6FF] text-[#0B5CA8]">
                                          +{bus.fasilitas.length - 3}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-[#DDEAF6]">
                                    <Link
                                      to={`/bus/${bus.id}`}
                                      className="font-bold text-xs py-2.5 rounded-xl text-center transition-all bg-[#F3FAFF] text-[#073B78] hover:bg-[#EAF6FF]"
                                    >
                                      Lihat Detail
                                    </Link>
                                    <a
                                      href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20menanyakan%20harga%20sewa%20untuk%2520armada%2520${encodeURIComponent(bus.nama_bus)}%20kapasitas%20${bus.kapasitas}%20kursi${bus.diskon ? `%20dengan%20promo%20${encodeURIComponent(bus.diskon)}` : ''}.`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                                    >
                                      <i className="fab fa-whatsapp text-base"></i>
                                      Pesan Bus
                                    </a>
                                  </div>
                                </div>
                              </div>
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

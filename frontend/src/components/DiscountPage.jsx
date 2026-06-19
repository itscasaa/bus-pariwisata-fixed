import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="glass-card rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[16/10]" style={{ background: 'var(--color-bg)' }} />
    <div className="p-5 space-y-3">
      <div className="h-4 rounded w-3/4" style={{ background: 'var(--color-border)' }} />
      <div className="h-3 rounded w-full" style={{ background: 'var(--color-border)' }} />
      <div className="h-3 rounded w-2/3" style={{ background: 'var(--color-border)' }} />
      <div className="h-10 rounded mt-4" style={{ background: 'var(--color-border)' }} />
    </div>
  </div>
);

// ─── Empty / Error State ──────────────────────────────────────────────────────
const EmptyState = ({ error }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-bg)' }}>
      <i className={`fas ${error ? 'fa-exclamation-circle text-red-400' : 'fa-percent'} text-4xl`} style={!error ? { color: 'var(--color-border)' } : {}}></i>
    </div>
    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>
      {error ? 'Gagal Memuat Data' : 'Belum Ada Promo'}
    </h3>
    <p className="text-sm max-w-sm" style={{ color: 'var(--color-muted)' }}>
      {error
        ? 'Tidak dapat terhubung ke server. Silakan coba beberapa saat lagi.'
        : 'Saat ini belum ada promo atau diskon aktif yang tersedia.'}
    </p>
    {error && (
      <button
        onClick={() => window.location.reload()}
        className="mt-5 px-6 py-2.5 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-colors"
        style={{ background: 'var(--color-blue)' }}
      >
        <i className="fas fa-redo mr-2"></i>Coba Lagi
      </button>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (promo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedPromo(null);
    setIsModalOpen(false);
  };

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

  // Fetch diskon dari database
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/discount.php`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (d.status === 'success' && Array.isArray(d.data)) {
          setDiscounts(d.data);
        } else {
          throw new Error(d.message || 'Data tidak tersedia');
        }
      })
      .catch(err => {
        setError(err.message);
        setDiscounts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ===== HERO ===== */}
      <div className="relative text-white py-28 md:py-36 overflow-hidden text-center bg-[#062D5F]">
        {/* Background Image */}
        <img 
          src="/images/bannerpaketwisata.webp" 
          alt="Promo Banner" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: 'center', zIndex: 1 }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: 'linear-gradient(180deg, rgba(6, 45, 95, 0.85) 0%, rgba(4, 30, 66, 0.95) 100%)',
            zIndex: 2
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,210,63,0.1),transparent)] pointer-events-none" style={{ zIndex: 3 }}></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Paket Wisata
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Temukan pilihan paket perjalanan menarik bersama Mafina Trans. Nikmati perjalanan wisata yang nyaman dengan armada premium, driver berpengalaman, dan harga terbaik.
          </p>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-[#F3FAFF] border-b border-[#DDEAF6]">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs justify-center" style={{ color: '#10233F' }}>
          <span><i className="fas fa-check-circle text-green-500 mr-1"></i>Klaim promo mudah lewat WhatsApp</span>
          <span><i className="fas fa-tag text-[#FFD23F] mr-1"></i>Potongan harga spesial rombongan</span>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <section className="py-12 md:py-16 bg-white min-h-[60vh]">
        <div className="container mx-auto px-4">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error / Empty */}
          {!loading && (error || discounts.length === 0) && (
            <div className="grid grid-cols-1">
              <EmptyState error={error} />
            </div>
          )}

          {/* Cards dari DB */}
          {!loading && !error && discounts.length > 0 && (() => {
            const formatCategoryLabel = (kategori) => {
              if (!kategori || kategori.trim() === '') return 'Lainnya';
              if (kategori.toLowerCase().startsWith('paket')) return kategori;
              return `Paket ${kategori}`;
            };

            const categorized = {};
            discounts.forEach(item => {
              const cat = formatCategoryLabel(item.kategori);
              if (!categorized[cat]) {
                categorized[cat] = [];
              }
              categorized[cat].push(item);
            });

            const categoryOrder = [
              'Paket 1 Hari',
              'Paket 2 Hari',
              'Paket 3 Hari',
              'Paket 4 Hari',
              'Paket 5 Hari',
              'Paket 10 Hari',
              'Lainnya'
            ];

            const sortedCategories = categoryOrder.filter(cat => categorized[cat] && categorized[cat].length > 0);

            // Also add any dynamic categories not listed in order
            Object.keys(categorized).forEach(cat => {
              if (!sortedCategories.includes(cat) && categorized[cat].length > 0) {
                sortedCategories.push(cat);
              }
            });

            return (
              <>
                {/* Quick Navigation Scroll Buttons */}
                <div className="flex flex-wrap justify-center gap-2.5 mb-12 shrink-0">
                  {sortedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => scrollToCategory(cat.replace(/\s+/g, '-').toLowerCase())}
                      className="px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer bg-[#F3FAFF] text-[#0B5CA8] border-[#DDEAF6] hover:bg-[#EAF6FF] hover:border-[#0B5CA8]/30 shadow-sm"
                    >
                      {cat} ({categorized[cat].length})
                    </button>
                  ))}
                </div>

                {/* Stacked Category Carousels */}
                <div className="space-y-16">
                  {sortedCategories.map((cat) => {
                    const itemsInCat = categorized[cat];
                    return (
                      <div key={cat} id={cat.replace(/\s+/g, '-').toLowerCase()} className="scroll-mt-24">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6 border-b border-[#DDEAF6] pb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-6 bg-[#0B5CA8] rounded-full"></span>
                            <h2 className="text-lg md:text-xl font-extrabold text-[#10233F]">
                              {cat}
                            </h2>
                            <span className="bg-[#EAF6FF] text-[#0B5CA8] text-xs font-bold px-2.5 py-1 rounded-full">
                              {itemsInCat.length} Paket
                            </span>
                          </div>
                        </div>

                        {/* Swiper Carousel */}
                        <Swiper {...swiperProps}>
                          {itemsInCat.map((item) => (
                            <SwiperSlide key={item.id} className="h-auto">
                              <div className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full">
                                {/* Gambar */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-[#F3FAFF]">
                                  <img
                                    src={item.gambar}
                                    alt={item.judul}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={e => {
                                      e.target.onerror = null;
                                      e.target.src = '/images/bus4/bus4.webp';
                                    }}
                                  />
                                  {/* Badge */}
                                  {item.badge && (
                                    <div
                                      className="absolute top-3 left-3 text-[#10233F] text-[11px] font-black px-3.5 py-1.5 bg-[#FFD23F] rounded-full shadow-md uppercase tracking-wider"
                                    >
                                      {item.badge}
                                    </div>
                                  )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                  <h3 className="font-extrabold text-base mb-2.5 transition-colors duration-300 line-clamp-2 text-[#10233F] group-hover:text-[#0B5CA8]">
                                    {item.judul}
                                  </h3>
                                  <p className="text-xs text-[#64748B] mb-5 flex-1 line-clamp-4 leading-relaxed">
                                    {item.deskripsi}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2.5 mt-auto pt-4 border-t border-[#DDEAF6]">
                                    <button
                                      onClick={() => handleOpenDetail(item)}
                                      className="font-bold text-[11px] py-2.5 rounded-xl text-center transition-all bg-[#F3FAFF] text-[#073B78] hover:bg-[#EAF6FF] cursor-pointer"
                                    >
                                      Lihat Detail
                                    </button>
                                    <a
                                      href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(item.judul)}%20(${encodeURIComponent(item.badge || '')}).%20Bagaimana%20cara%20klaimnya%3F`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-[11px] py-2.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all"
                                    >
                                      <i className="fab fa-whatsapp"></i>
                                      <span>Pesan via WA</span>
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

      {/* ===== CTA ===== */}
      <section 
        className="py-16 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #073B78 0%, #062D5F 50%, #0B5CA8 100%)' }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Butuh Penawaran Sewa Bus Khusus?</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Kami siap memberikan estimasi tarif sewa bus pariwisata yang hemat sesuai rute dan durasi perjalanan rombongan Anda. Hubungi kami sekarang!
          </p>
          <a
            href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20tanya%20estimasi%20harga%20sewa%20bus`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-bold rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
          >
            <i className="fab fa-whatsapp text-xl"></i>
            Tanya Tarif via WhatsApp
          </a>
        </div>
      </section>

      {/* ===== DETAIL MODAL ===== */}
      {isModalOpen && selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden border border-[#DDEAF6] flex flex-col max-h-[90vh] animate-fade-in text-left">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#062D5F] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-extrabold text-base md:text-lg">Detail Paket Wisata</h3>
                <p className="text-[11px] md:text-xs text-white/70">
                  Informasi lengkap destinasi &amp; itinerary perjalanan
                </p>
              </div>
              <button 
                onClick={handleCloseDetail}
                className="text-white/85 hover:text-white text-lg p-1 focus:outline-none transition-colors cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1">
              {/* Cover Image */}
              <div className="relative aspect-[16/9] bg-[#F3FAFF] w-full shrink-0">
                <img
                  src={selectedPromo.gambar}
                  alt={selectedPromo.judul}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/images/bus4/bus4.webp';
                  }}
                />
                {selectedPromo.badge && (
                  <div className="absolute top-4 left-4 bg-[#FFD23F] text-[#10233F] text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                    {selectedPromo.badge}
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#EAF6FF] text-[#0B5CA8] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedPromo.kategori ? (selectedPromo.kategori.toLowerCase().startsWith('paket') ? selectedPromo.kategori : `Paket ${selectedPromo.kategori}`) : 'Paket Wisata'}
                  </span>
                </div>

                <h4 className="font-black text-[#10233F] text-lg md:text-xl leading-snug">
                  {selectedPromo.judul}
                </h4>

                <div className="border-t border-[#DDEAF6] pt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-[#64748B] mb-2">Deskripsi &amp; Fasilitas Paket</p>
                  <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                    {selectedPromo.deskripsi}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 bg-[#F9FBFF] border-t border-[#DDEAF6] flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleCloseDetail}
                className="px-4 py-2.5 rounded-xl border border-[#DDEAF6] hover:bg-slate-100 text-[#64748B] font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20tertarik%20dengan%20paket%20wisata%20${encodeURIComponent(selectedPromo.judul)}%20(${encodeURIComponent(selectedPromo.badge || '')}).%20Boleh%20tanya%20detail%20selengkapnya%3F`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer flex-1 text-center"
              >
                <i className="fab fa-whatsapp text-sm"></i>
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountPage;

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import API_BASE from '../config/api';
import siteData from '../data/siteData';
import PriceListTerms from './PriceListTerms';

const PriceListPage = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArmada, setSelectedArmada] = useState('Big Bus');
  const [bookingDate, setBookingDate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

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
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: true,
    breakpoints: {
      500: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
    className: "pb-8 pt-2 px-1",
  };

  const handleOpenModal = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
    setSelectedArmada('Big Bus');
    setBookingDate('');
    setAdditionalNotes('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoute(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedRoute) return;

    let text = `Halo Mafina Trans, saya ingin menanyakan sewa bus pariwisata dengan rincian berikut:\n\n`;
    text += `📍 Rute: ${selectedRoute.nama_destinasi}\n`;
    text += `⏱️ Durasi: ${selectedRoute.durasi}\n`;
    text += `🚌 Jenis Armada: ${selectedArmada}\n`;
    if (bookingDate) {
      const parts = bookingDate.split('-');
      const formattedDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : bookingDate;
      text += `📅 Keberangkatan: ${formattedDate}\n`;
    }
    if (additionalNotes.trim()) {
      text += `📝 Catatan: ${additionalNotes}\n`;
    }

    const waUrl = `https://wa.me/${siteData.whatsapp.number}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    handleCloseModal();
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = searchTerm
      ? `${API_BASE}/price_list.php?keyword=${encodeURIComponent(searchTerm)}`
      : `${API_BASE}/price_list.php`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        let data;
        try { data = JSON.parse(text); } catch { throw new Error('Response bukan JSON valid.'); }
        if (data.status === 'success') {
          setPrices(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || 'Gagal memuat data harga.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(keyword.trim());
  };

  const formatRupiah = (num) => {
    if (!num || num === 0) return 'Hubungi Kami';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="min-h-screen bg-white pt-16">

      {/* Hero */}
      <div className="relative text-white py-16 md:py-24 overflow-hidden text-center bg-[#062D5F]">
        {/* Background Image */}
        <img 
          src="/images/bannerpricelist.webp" 
          alt="Price List Banner" 
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
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Price List
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            Lihat estimasi harga sewa bus dan layanan perjalanan. Harga transparan, hemat, dan dapat disesuaikan dengan kebutuhan rute Anda.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex rounded-xl overflow-hidden shadow-xl border border-white/10 bg-white p-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari tujuan wisata..."
                className="flex-1 px-5 py-3 text-sm focus:outline-none text-[#10233F] rounded-lg"
              />
              <button type="submit"
                className="px-6 py-3 bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-bold text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <i className="fas fa-search"></i> Cari
              </button>
            </div>
          </form>

          {searchTerm && (
            <p className="mt-4 text-sm text-[#FFD23F]">
              Hasil pencarian: <span className="text-white font-bold">"{searchTerm}"</span>
              <button onClick={() => { setSearchTerm(''); setKeyword(''); }}
                className="ml-3 underline text-xs text-white/70 hover:text-white"
              >
                Reset
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Info Strip - Keterangan Harga */}
      <div className="border-b border-[#DDEAF6] bg-[#F3FAFF]">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-3">
          <div className="flex items-start gap-2.5 flex-1 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
            <i className="fas fa-check-circle text-[#128C7E] text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs text-green-800 leading-relaxed">
              <strong className="block text-green-750 mb-0.5">Harga Sudah Termasuk:</strong>
              Sewa Bus, BBM, Driver, Helper &amp; Asuransi Jiwa
            </p>
          </div>
          <div className="flex items-start gap-2.5 flex-1 bg-red-50 border border-red-255 rounded-2xl px-4 py-3">
            <i className="fas fa-times-circle text-red-500 text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs text-red-800 leading-relaxed">
              <strong className="block text-red-700 mb-0.5">Harga Belum Termasuk:</strong>
              Toll, Parkir, Tips, Penyeberangan (Kapal Ferry), Retribusi Daerah &amp; Tiket Masuk Wisata
            </p>
          </div>
        </div>
      </div>

      {/* Syarat & Ketentuan Sewa Bus (Moved to the top) */}
      <PriceListTerms />

      {/* Tabel */}
      <div className="container mx-auto px-4 py-10 bg-white">

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin mb-3" style={{ borderColor: '#0B5CA8', borderTopColor: 'transparent' }}></div>
            <p className="text-sm text-[#64748B]">Memuat daftar harga...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <i className="fas fa-exclamation-circle text-5xl text-red-400 mb-4"></i>
            <p className="font-semibold text-red-500">Gagal memuat data.</p>
            <p className="text-sm mt-1 text-[#64748B]">{error}</p>
            <button onClick={() => setSearchTerm('')}
              className="mt-5 px-6 py-2.5 text-[#10233F] rounded-xl font-bold hover:opacity-90 transition text-sm bg-[#FFD23F]"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && prices.length === 0 && (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl mb-4 text-[#DDEAF6]"></i>
            <p className="font-semibold text-[#64748B]">
              {searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : 'Belum ada data harga.'}
            </p>
          </div>
        )}

        {!loading && !error && prices.length > 0 && (() => {
          // Group by category duration
          const getCategoryLabel = (durasi) => {
            const durLower = durasi.toLowerCase();
            if (durLower.includes('jam')) return 'Paket 1 Hari';
            if (durLower.includes('2 hari')) return 'Paket 2 Hari';
            if (durLower.includes('3 hari')) return 'Paket 3 Hari';
            if (durLower.includes('4 hari')) return 'Paket 4 Hari';
            if (durLower.includes('5 hari')) return 'Paket 5 Hari';
            return 'Paket 7+ Hari';
          };

          const categorizedPrices = {};
          prices.forEach(item => {
            const cat = getCategoryLabel(item.durasi);
            if (!categorizedPrices[cat]) {
              categorizedPrices[cat] = [];
            }
            categorizedPrices[cat].push(item);
          });

          const categoryOrder = [
            'Paket 1 Hari',
            'Paket 2 Hari',
            'Paket 3 Hari',
            'Paket 4 Hari',
            'Paket 5 Hari',
            'Paket 7+ Hari'
          ];

          const sortedCategories = categoryOrder.filter(cat => categorizedPrices[cat] && categorizedPrices[cat].length > 0);

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
                    {cat} ({categorizedPrices[cat].length})
                  </button>
                ))}
              </div>

              {/* Stacked Category Carousels */}
              <div className="space-y-16">
                {sortedCategories.map((cat) => {
                  const itemsInCat = categorizedPrices[cat];
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
                            {itemsInCat.length} Rute
                          </span>
                        </div>
                      </div>

                      {/* Swiper Carousel */}
                      <Swiper {...swiperProps}>
                        {itemsInCat.map((item) => (
                          <SwiperSlide key={item.id} className="h-auto">
                            <div className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full p-6">
                              {/* Top Info */}
                              <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#F3FAFF] text-[#073B78] flex items-center justify-center text-lg">
                                  <i className="fas fa-route"></i>
                                </div>
                                <span className="flex items-center gap-1 bg-red-50 text-[#BA1A1A] text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                                  <i className="far fa-clock text-[9px]"></i> {item.durasi}
                                </span>
                              </div>

                              {/* Destination Title */}
                              <h3 className="font-extrabold text-[#10233F] text-base md:text-lg hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-2 mb-4 min-h-[48px] leading-snug">
                                {item.nama_destinasi}
                              </h3>

                              <div className="border-t border-[#DDEAF6] pt-4 mb-5 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-wider text-[#64748B] mb-2">Armada Tersedia</p>
                                <div className="grid grid-cols-2 gap-2 text-xs text-[#10233F]">
                                  <div className="flex items-center gap-1.5">
                                    <i className="fas fa-check-circle text-green-500 text-[10px]"></i>
                                    <span>HiAce (15s)</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <i className="fas fa-check-circle text-green-500 text-[10px]"></i>
                                    <span>Elf (19s)</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <i className="fas fa-check-circle text-green-500 text-[10px]"></i>
                                    <span>Medium (31s)</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <i className="fas fa-check-circle text-green-500 text-[10px]"></i>
                                    <span>Big Bus (59s)</span>
                                  </div>
                                </div>
                              </div>

                              {/* Booking Button */}
                              <button
                                  onClick={() => handleOpenModal(item)}
                                  className="w-full py-3 bg-[#BA1A1A] hover:bg-[#A61313] text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all duration-300 hover:scale-[1.01] cursor-pointer text-center"
                              >
                                Pesan Rute
                              </button>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  );
                })}
              </div>

              {/* Price Terms & Info Box at Bottom */}
              <div className="mt-16 bg-white border border-[#DDEAF6] rounded-3xl overflow-hidden shadow-sm">
                <div className="flex items-start gap-3 px-6 py-3.5 bg-green-50/50 border-b border-[#DDEAF6]">
                  <i className="fas fa-check-circle text-[#128C7E] text-base mt-0.5 shrink-0"></i>
                  <p className="text-xs text-green-800 leading-relaxed">
                    <strong>Harga sewa sudah termasuk:</strong> Driver &amp; BBM
                  </p>
                </div>
                <div className="flex items-start gap-3 px-6 py-3.5 bg-red-50/50 border-b border-[#DDEAF6]">
                  <i className="fas fa-times-circle text-red-500 text-base mt-0.5 shrink-0"></i>
                  <p className="text-xs text-red-850 leading-relaxed">
                    <strong>Belum termasuk:</strong> Toll, Parkir, Tips, Penyeberangan (Kapal Ferry), Retribusi Daerah &amp; Tiket Masuk Wisata
                  </p>
                </div>
                <div className="flex items-start gap-3 px-6 py-3.5 bg-amber-50/40">
                  <i className="fas fa-exclamation-triangle text-amber-600 text-base mt-0.5 shrink-0"></i>
                  <p className="text-xs text-amber-850 leading-relaxed">
                    <strong>Catatan:</strong> Penggunaan bus menginap mulai jam <strong>05.00 WIB</strong> s/d <strong>24.00 WIB</strong> di hari terakhir.
                    Harga dapat berubah sewaktu-waktu, konfirmasi via WhatsApp untuk harga terkini.
                  </p>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Modal */}
      {isModalOpen && selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-[#DDEAF6] flex flex-col max-h-[90vh] animate-fade-in">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#062D5F] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-extrabold text-base md:text-lg">Detail Pemesanan Rute</h3>
                <p className="text-[11px] md:text-xs text-white/70">Lengkapi detail perjalanan Anda sebelum dikirim</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-white/85 hover:text-white text-lg p-1 focus:outline-none transition-colors cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Route Summary Box */}
              <div className="p-4 bg-[#F3FAFF] border border-[#DDEAF6] rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0B5CA8] bg-[#EAF6FF] px-2.5 py-1 rounded-full">Rute Tujuan</span>
                    <h4 className="font-black text-[#10233F] text-base md:text-lg mt-1 leading-snug">{selectedRoute.nama_destinasi}</h4>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#DDEAF6]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#BA1A1A] bg-red-50 px-2.5 py-1 rounded-full">Durasi</span>
                    <p className="font-extrabold text-[#10233F] text-sm flex items-center gap-1.5"><i className="far fa-clock"></i> {selectedRoute.durasi}</p>
                  </div>
                </div>
              </div>

              {/* Step 1: Choose Armada */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#10233F]">Pilih Jenis Armada</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { name: 'Big Bus', capacity: '59 Kursi', icon: 'fa-bus' },
                    { name: 'Medium Bus', capacity: '31 Kursi', icon: 'fa-bus-alt' },
                    { name: 'Elf', capacity: '19 Kursi', icon: 'fa-car-side' },
                    { name: 'HiAce', capacity: '15 Kursi', icon: 'fa-shuttle-van' }
                  ].map((armada) => {
                    const isSelected = selectedArmada === armada.name;
                    return (
                      <button
                        key={armada.name}
                        type="button"
                        onClick={() => setSelectedArmada(armada.name)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'border-[#0B5CA8] bg-[#F3FAFF] shadow-sm shadow-[#0B5CA8]/5 scale-[1.01]' 
                            : 'border-[#DDEAF6] hover:border-[#0B5CA8]/40 bg-white hover:bg-[#F9FBFF]'
                        }`}
                      >
                        <i className={`fas ${armada.icon} text-base mb-1 ${isSelected ? 'text-[#0B5CA8]' : 'text-[#64748B]'}`}></i>
                        <span className={`text-xs font-black ${isSelected ? 'text-[#0B5CA8]' : 'text-[#10233F]'}`}>{armada.name}</span>
                        <span className="text-[9px] text-[#64748B] mt-0.5">{armada.capacity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Departure Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-[#10233F]">Tanggal Keberangkatan (Opsional)</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DDEAF6] text-sm text-[#10233F] focus:outline-none focus:border-[#0B5CA8] transition-all bg-white"
                />
              </div>

              {/* Step 3: Additional Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-[#10233F]">Catatan Tambahan (Opsional)</label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Contoh: titik penjemputan, rute detail, dll."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DDEAF6] text-sm text-[#10233F] focus:outline-none focus:border-[#0B5CA8] transition-all bg-white resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 bg-[#F9FBFF] border-t border-[#DDEAF6] flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2.5 rounded-xl border border-[#DDEAF6] hover:bg-slate-100 text-[#64748B] font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer flex-1 sm:flex-initial"
              >
                <i className="fab fa-whatsapp text-sm"></i>
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceListPage;

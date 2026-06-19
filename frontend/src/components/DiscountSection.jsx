import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

const DiscountSection = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading,  setLoading]   = useState(true);
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

  // Fetch 4 diskon terbaru dari database
  useEffect(() => {
    fetch(`${API_BASE}/discount.php`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success' && Array.isArray(d.data)) {
          setDiscounts(d.data.slice(0, 4)); // tampilkan maksimal 4 di homepage
        }
      })
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  }, []);

  // Jika loading atau tidak ada data, tidak tampilkan section
  if (loading) return null;
  if (discounts.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-[#F3FAFF]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[#0B5CA8] font-bold text-xs uppercase tracking-widest bg-[#EAF6FF] px-4 py-2 rounded-full">
              Paket Perjalanan
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10233F] mt-4">
              Pilihan Paket Wisata
            </h2>
            <div className="w-16 h-1 bg-[#FFD23F] mt-3 rounded-full"></div>
          </div>
          <Link
            to="/paket-wisata"
            className="text-[#0B5CA8] hover:text-[#073B78] font-bold text-sm flex items-center gap-1.5 transition-colors duration-200"
          >
            Lihat Semua Paket <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {discounts.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={e => { e.target.onerror = null; e.target.src = '/images/bus4/bus4.webp'; }}
                />
                {item.badge && (
                  <div className="absolute top-3 left-3 bg-[#FFD23F] text-[#10233F] text-[11px] font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-extrabold text-[#10233F] text-base lg:text-lg mb-2.5 group-hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-1">
                  {item.judul}
                </h3>
                <p className="text-[#64748B] text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                  {item.deskripsi}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[#DDEAF6]">
                  <button
                    onClick={() => handleOpenDetail(item)}
                    className="font-bold text-[10px] py-2.5 rounded-xl text-center transition-all bg-[#F3FAFF] text-[#073B78] hover:bg-[#EAF6FF] cursor-pointer"
                  >
                    Detail Paket
                  </button>
                  <a
                    href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(item.judul)}%20(${encodeURIComponent(item.badge || '')}).%20Bagaimana%20cara%20klaimnya%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-[10px] py-2.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all"
                  >
                    <i className="fab fa-whatsapp"></i>
                    Pesan via WA
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
};

export default DiscountSection;

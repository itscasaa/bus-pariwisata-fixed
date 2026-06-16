import React, { useState, useEffect } from 'react';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/news.php`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setNews(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || 'Gagal memuat berita.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* ===== HERO BANNER ===== */}
      <div className="relative text-white py-28 md:py-36 overflow-hidden text-center bg-[#062D5F]">
        {/* Background Image */}
        <img 
          src="/images/news.webp" 
          alt="News & Info Banner" 
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
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">News &amp; Info</h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            Dapatkan informasi terbaru seputar promo wisata, tips perjalanan, dan berita terkini dari Mafina Trans
          </p>

          <div className="inline-flex flex-wrap justify-center gap-4 md:gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <i className="fas fa-tag text-[#FFD23F]"></i>
              <span className="text-white/95">Promo &amp; Diskon</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <i className="fas fa-lightbulb text-[#FFD23F]"></i>
              <span className="text-white/95">Tips Perjalanan</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <i className="fas fa-bullhorn text-[#FFD23F]"></i>
              <span className="text-white/95">Info Armada Baru</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <i className="fas fa-calendar-alt text-[#FFD23F]"></i>
              <span className="text-white/95">Update Rutin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="border-b border-[#DDEAF6] bg-[#F3FAFF]">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#073B78]">
          <span><i className="fas fa-bell text-[#F6B800] mr-1.5"></i>Pantau terus halaman ini untuk mendapatkan promo &amp; info terbaru dari kami</span>
          <span><i className="fab fa-whatsapp text-[#0b655b] mr-1.5"></i>Atau hubungi WhatsApp kami untuk info langsung</span>
        </div>
      </div>

      {/* ===== NEWS LIST ===== */}
      <section className="py-16 md:py-20 bg-transparent min-h-[60vh]">
        <div className="container mx-auto px-4 lg:px-8">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin mb-3" style={{ borderColor: '#0B5CA8', borderTopColor: 'transparent' }}></div>
              <p className="text-sm text-[#64748B]">Memuat berita terbaru...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12 bg-white border border-[#DDEAF6] rounded-3xl max-w-lg mx-auto px-6 shadow-sm">
              <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
              <h3 className="text-lg font-extrabold text-[#10233F] mb-2">Gagal Memuat Berita</h3>
              <p className="text-sm text-[#64748B] mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#10233F] font-bold px-6 py-2.5 bg-[#FFD23F] hover:bg-[#F6B800] rounded-xl transition shadow-sm text-sm"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            /* === EMPTY STATE === */
            <div className="max-w-md mx-auto text-center py-10">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#EAF6FF] text-[#0B5CA8] flex items-center justify-center text-3xl mb-6 shadow-sm">
                <i className="fas fa-newspaper"></i>
              </div>
              <h2 className="text-2xl font-extrabold text-[#10233F] mb-3">
                Belum Ada Berita Terbaru
              </h2>
              <p className="text-sm leading-relaxed text-[#64748B] mb-6">
                Saat ini belum ada berita atau informasi terbaru yang tersedia.
                Silakan kunjungi kembali halaman ini untuk mendapatkan update
                seputar promo dan perjalanan wisata terbaru dari kami.
              </p>
              <div className="w-16 h-1 mx-auto rounded-full mb-6 bg-[#0B5CA8]"></div>
              <a
                href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20tahu%20info%20promo%20terbaru`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-extrabold px-6 py-3 rounded-2xl transition-all duration-200 shadow-md"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                Tanya Info Promo via WA
              </a>
            </div>
          )}

          {!loading && !error && news.length > 0 && (
            /* === NEWS GRID === */
            <>
              <div className="text-sm mb-6 text-[#64748B]">
                Menampilkan <span className="font-bold text-[#10233F]">{news.length}</span> berita &amp; informasi
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-[#DDEAF6] rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#F3FAFF] relative">
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.onerror = null; e.target.src = '/images/bus4.jpeg'; }}
                      />
                      <div className="absolute top-4 left-4 bg-[#0B5CA8]/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        Info Trans
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs mb-2.5 flex items-center gap-1.5 text-[#64748B] font-semibold">
                        <i className="far fa-calendar-alt text-[#0B5CA8]"></i>
                        {formatDate(item.created_at)}
                      </p>
                      <h3 className="font-extrabold text-base mb-2.5 text-[#10233F] group-hover:text-[#0B5CA8] transition-colors duration-250 line-clamp-2 leading-snug">
                        {item.judul}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#64748B] line-clamp-3 mb-4">
                        {item.ringkas}
                      </p>
                      <div className="mt-auto pt-4 border-t border-[#F3FAFF]">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5CA8] group-hover:gap-2 transition-all">
                          Baca Selengkapnya <i className="fas fa-arrow-right text-[10px]"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;

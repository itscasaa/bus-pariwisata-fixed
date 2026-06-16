import React, { useState, useEffect } from 'react';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

// ─── Format harga ─────────────────────────────────────────────────────────────
const formatRp = (n) =>
  n ? 'Rp. ' + new Intl.NumberFormat('id-ID').format(n) : '-';

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="glass-card rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[4/3]" style={{ background: 'var(--color-bg)' }} />
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
      <i className={`fas ${error ? 'fa-exclamation-circle text-red-400' : 'fa-map-marked-alt'} text-4xl`} style={!error ? { color: 'var(--color-border)' } : {}}></i>
    </div>
    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>
      {error ? 'Gagal Memuat Data' : 'Belum Ada Paket'}
    </h3>
    <p className="text-sm max-w-sm" style={{ color: 'var(--color-muted)' }}>
      {error
        ? 'Tidak dapat terhubung ke server. Pastikan XAMPP sudah berjalan.'
        : 'Belum ada paket wisata yang tersedia untuk kategori ini.'}
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
const PaketWisataPage = () => {
  const [packages,     setPackages]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');

  // Fetch HANYA dari database — tidak ada fallback
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/paket_wisata.php`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (d.status === 'success' && Array.isArray(d.data)) {
          setPackages(d.data);
        } else {
          throw new Error(d.message || 'Data tidak tersedia');
        }
      })
      .catch(err => {
        setError(err.message);
        setPackages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Semua', ...new Set(packages.map(p => p.kategori))];

  const filtered = activeFilter === 'Semua'
    ? packages
    : packages.filter(p => p.kategori === activeFilter);

  return (
    <>
      {/* ===== HERO ===== */}
      <div className="relative text-white py-28 md:py-36 overflow-hidden text-center bg-[#062D5F]">
        {/* Background Image */}
        <img 
          src="/images/bannerpaketwisata.webp" 
          alt="Paket Wisata Banner" 
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
          <span><i className="fas fa-check-circle text-green-500 mr-1"></i>Tersedia paket custom sesuai kebutuhan rombongan Anda</span>
          <span><i className="fas fa-tag text-[#FFD23F] mr-1"></i>Diskon spesial untuk pemesanan grup &amp; repeat order</span>
        </div>
      </div>

      {/* ===== FILTER ===== */}
      {!loading && !error && packages.length > 0 && (
        <section className="py-6 sticky top-0 z-20 shadow-sm bg-white/90 backdrop-blur-md border-b border-[#DDEAF6]">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === cat
                      ? 'text-[#10233F] shadow-md'
                      : 'hover:opacity-85'
                  }`}
                  style={activeFilter === cat
                    ? { background: '#FFD23F', boxShadow: '0 4px 14px rgba(255, 210, 63, 0.25)' }
                    : { background: '#F3FAFF', color: '#64748B' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== GRID ===== */}
      <section className="py-12 md:py-16 bg-white min-h-[60vh]">
        <div className="container mx-auto px-4">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error / Empty */}
          {!loading && (error || filtered.length === 0) && (
            <div className="grid grid-cols-1">
              <EmptyState error={error} />
            </div>
          )}

          {/* Cards dari DB */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[#64748B]">
                  Menampilkan <span className="font-semibold text-[#10233F]">{filtered.length}</span> paket wisata
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Gambar */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F3FAFF]">
                      <img
                        src={pkg.gambar}
                        alt={pkg.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = '/images/bus4.jpeg';
                        }}
                      />
                      {/* Badge */}
                      <div
                        className="absolute top-3 left-3 text-[#10233F] text-[10px] font-bold px-3 py-1.5 bg-[#FFD23F] rounded-full shadow-md uppercase tracking-wider"
                      >
                        {pkg.badge}
                      </div>
                      {/* Durasi */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <i className="far fa-clock text-[#FFD23F]"></i>
                        <span>{pkg.durasi}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-extrabold text-base mb-1.5 transition-colors duration-300 line-clamp-2 text-[#10233F] group-hover:text-[#0B5CA8]">
                        {pkg.judul}
                      </h3>
                      {/* Harga */}
                      <p className="font-black text-sm mb-3 text-[#0B5CA8]">
                        {pkg.harga_fmt || formatRp(pkg.harga)}
                      </p>
                      <p className="text-xs text-[#64748B] mb-4 flex-1 line-clamp-3 leading-relaxed">
                        {pkg.deskripsi}
                      </p>
                      <div className="pt-4 mt-auto border-t border-[#DDEAF6]">
                        <a
                          href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20pesan%20paket%20${encodeURIComponent(pkg.judul)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#128C7E] hover:bg-[#0b655b] text-white text-xs py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold"
                        >
                          <i className="fab fa-whatsapp text-sm"></i>
                          <span>Pesan via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section 
        className="py-16 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #073B78 0%, #062D5F 50%, #0B5CA8 100%)' }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Ingin Paket Wisata Custom?</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Kami siap membantu Anda merancang paket perjalanan sesuai keinginan, rute, dan budget khusus rombongan Anda. Hubungi tim kami sekarang!
          </p>
          <a
            href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20konsultasi%20paket%20wisata%20custom`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-bold rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
          >
            <i className="fab fa-whatsapp text-xl"></i>
            Konsultasi Gratis
          </a>
        </div>
      </section>
    </>
  );
};

export default PaketWisataPage;

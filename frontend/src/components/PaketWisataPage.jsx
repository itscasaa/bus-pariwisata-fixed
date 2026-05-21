import React, { useState } from 'react';
import siteData from '../data/siteData';

const PaketWisataPage = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const packages = siteData.tourPackages;

  const categories = ['Semua', ...new Set(packages.map((p) => p.category))];

  const filtered =
    activeFilter === 'Semua'
      ? packages
      : packages.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <div className="bg-gradient-to-br from-[#0d4a8a] to-[#1d6ec5] pt-16 lg:pt-20 pb-14 text-white relative overflow-hidden">
        {/* Dot pattern dekoratif */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        ></div>
        {/* Lingkaran dekoratif */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Label kecil */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <i className="fas fa-map-marked-alt text-yellow-300"></i>
            Wisata Bersama Surya Tour Trans
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold mb-3 tracking-tight">
            Paket Wisata
          </h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-2xl mx-auto mb-8">
            Nikmati perjalanan wisata yang nyaman dengan berbagai pilihan paket menarik. Harga terbaik, armada premium, dan driver berpengalaman
          </p>

          {/* Stats bar */}
          <div className="inline-flex flex-wrap justify-center gap-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center font-bold text-xs">{packages.length}</span>
              <span className="text-blue-100">Paket Tersedia</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-clock text-yellow-300"></i>
              <span className="text-blue-100">1 Hari s/d 10 Hari</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-map-marker-alt text-yellow-300"></i>
              <span className="text-blue-100">100+ Destinasi Wisata</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-headset text-yellow-300"></i>
              <span className="text-blue-100">Support 24 Jam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-blue-800">
          <span><i className="fas fa-check-circle text-green-500 mr-1"></i>Tersedia paket custom sesuai kebutuhan rombongan Anda</span>
          <span><i className="fas fa-tag text-yellow-500 mr-1"></i>Diskon spesial untuk pemesanan grup &amp; repeat order</span>
        </div>
      </div>

      {/* ===== FILTER BUTTONS ===== */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-[#1d6ec5] text-white shadow-md shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PACKAGES GRID ===== */}
      <section className="py-12 md:py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-20">Tidak ada paket untuk kategori ini.</p>
          ) : (
            <>
              <div className="text-sm text-gray-500 mb-6">
                Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> paket wisata
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((pkg, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#1d6ec5] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        {pkg.badge}
                      </div>
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <i className="fas fa-tag"></i>
                        <span>Diskon 10%</span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <i className="far fa-clock"></i>
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-[#1d6ec5] transition-colors duration-300 line-clamp-2">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3">
                        {pkg.description}
                      </p>
                      <div className="pt-4 mt-auto">
                        <a
                          href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Surya%20Tour%20Trans%2C%20saya%20ingin%20pesan%20paket%20${encodeURIComponent(pkg.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-semibold"
                        >
                          <i className="fab fa-whatsapp text-base"></i>
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

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 bg-[#1d6ec5]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ingin Paket Wisata Custom?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Kami siap membantu Anda merancang paket perjalanan sesuai keinginan. Hubungi tim kami sekarang!
          </p>
          <a
            href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Surya%20Tour%20Trans%2C%20saya%20ingin%20konsultasi%20paket%20wisata%20custom`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#1d6ec5] font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors duration-200 shadow-lg"
          >
            <i className="fab fa-whatsapp text-green-500 text-xl"></i>
            Konsultasi Gratis
          </a>
        </div>
      </section>
    </>
  );
};

export default PaketWisataPage;

import React from 'react';
import siteData from '../data/siteData';

const NewsPage = () => {
  const news = siteData.news;

  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <div className="bg-gradient-to-br from-[#0d4a8a] to-[#1d6ec5] pt-16 lg:pt-20 pb-14 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        ></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <i className="fas fa-newspaper text-yellow-300"></i>
            Informasi &amp; Berita Terkini
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold mb-3 tracking-tight">
            News &amp; Info
          </h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-2xl mx-auto mb-8">
            Dapatkan informasi terbaru seputar promo wisata, tips perjalanan, dan berita terkini dari Surya Tour Trans
          </p>

          <div className="inline-flex flex-wrap justify-center gap-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-tag text-yellow-300"></i>
              <span className="text-blue-100">Promo &amp; Diskon</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-lightbulb text-yellow-300"></i>
              <span className="text-blue-100">Tips Perjalanan</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-bullhorn text-yellow-300"></i>
              <span className="text-blue-100">Info Armada Baru</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-calendar-alt text-yellow-300"></i>
              <span className="text-blue-100">Update Rutin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-blue-800">
          <span><i className="fas fa-bell text-yellow-500 mr-1"></i>Pantau terus halaman ini untuk mendapatkan promo &amp; info terbaru dari kami</span>
          <span><i className="fab fa-whatsapp text-green-500 mr-1"></i>Atau hubungi WhatsApp kami untuk info langsung</span>
        </div>
      </div>

      {/* ===== NEWS LIST ===== */}
      <section className="py-16 md:py-20 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto px-4">
          {news.length === 0 ? (
            /* === EMPTY STATE === */
            <div className="max-w-md mx-auto text-center py-10">
              <img
                src="/images/searchnotfound.png"
                alt="Belum ada berita"
                className="w-64 h-64 object-contain mx-auto mb-6 drop-shadow-md"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Belum Ada Berita Terbaru
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Saat ini belum ada berita atau informasi terbaru yang tersedia.
                Silakan kunjungi kembali halaman ini untuk mendapatkan update
                seputar promo dan perjalanan wisata terbaru dari kami.
              </p>
              <div className="w-16 h-1 bg-[#1d6ec5] mx-auto rounded-full mb-6"></div>
              <a
                href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Surya%20Tour%20Trans%2C%20saya%20ingin%20tahu%20info%20promo%20terbaru`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-colors duration-200 shadow-md"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                Tanya Info Promo via WA
              </a>
            </div>
          ) : (
            /* === NEWS GRID === */
            <>
              <div className="text-sm text-gray-500 mb-6">
                Menampilkan <span className="font-semibold text-gray-700">{news.length}</span> berita &amp; informasi
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {news.map((item, i) => (
                  <div
                    key={i}
                    className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                        <i className="far fa-calendar-alt"></i>
                        {item.date}
                      </p>
                      <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#1d6ec5] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default NewsPage;

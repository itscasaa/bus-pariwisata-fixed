import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/news.php`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setNews(Array.isArray(data.data) ? data.data.slice(0, 3) : []);
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
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[#0B5CA8] font-bold text-xs uppercase tracking-widest bg-[#EAF6FF] px-4 py-2 rounded-full">
              Informasi Terbaru
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10233F] mt-4">
              News &amp; Info
            </h2>
            <div className="w-16 h-1 bg-[#FFD23F] mt-3 rounded-full"></div>
          </div>
          <Link
            to="/news"
            className="text-[#0B5CA8] hover:text-[#073B78] font-bold text-sm flex items-center gap-1.5 transition-colors duration-200"
          >
            Lihat Semua <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-[#0B5CA8] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-[#64748B]">Memuat berita terbaru...</p>
          </div>
        )}

        {/* Empty State / Error state */}
        {!loading && (error || news.length === 0) && (
          <div className="bg-white border border-[#DDEAF6] max-w-xl mx-auto text-center p-8 lg:p-10 rounded-3xl shadow-lg relative overflow-hidden">
            {/* Glowing decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EAF6FF] rounded-full blur-xl pointer-events-none"></div>

            <i className="far fa-newspaper text-5xl text-[#0B5CA8]/60 mb-4 inline-block"></i>
            <h3 className="text-xl lg:text-2xl font-extrabold text-[#10233F] mb-3">
              Belum Ada Berita Terbaru
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-6">
              Saat ini belum ada berita atau informasi terbaru yang tersedia. Silakan kunjungi kembali halaman ini untuk mendapatkan update seputar promo dan perjalanan wisata terbaru dari kami.
            </p>
            <div className="w-16 h-1 bg-[#FFD23F] mx-auto rounded-full mb-6"></div>
            <a
              href={`https://wa.me/${siteData.whatsapp.number}?text=${encodeURIComponent('Halo Mafina Trans, saya ingin tahu info promo terbaru.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:scale-105"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              Tanya Info Promo via WA
            </a>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-[#DDEAF6] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.onerror = null; e.target.src = '/images/bus4.jpeg'; }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#64748B] text-xs mb-2 flex items-center gap-1.5">
                    <i className="far fa-calendar-alt text-[#0B5CA8]"></i>
                    {formatDate(item.created_at)}
                  </p>
                  <h3 className="font-extrabold text-[#10233F] text-lg mb-2 group-hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3">
                    {item.ringkas}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
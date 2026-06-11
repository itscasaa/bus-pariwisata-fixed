import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Fetch 4 paket terbaru dari database — tidak ada fallback
  useEffect(() => {
    fetch(`${API_BASE}/paket_wisata.php`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success' && Array.isArray(d.data)) {
          setPackages(d.data.slice(0, 4)); // tampilkan 4 di homepage
        }
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  // Jika loading atau tidak ada data, tidak tampilkan section
  if (loading) return null;
  if (packages.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-[#F3FAFF]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[#0B5CA8] font-bold text-xs uppercase tracking-widest bg-[#EAF6FF] px-4 py-2 rounded-full">
              Pilihan Paket
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10233F] mt-4">
              Paket Wisata Populer
            </h2>
            <div className="w-16 h-1 bg-[#FFD23F] mt-3 rounded-full"></div>
          </div>
          <Link
            to="/paket-wisata"
            className="text-[#0B5CA8] hover:text-[#073B78] font-bold text-sm flex items-center gap-1.5 transition-colors duration-200"
          >
            Lihat Semua <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={pkg.gambar}
                  alt={pkg.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={e => { e.target.onerror = null; e.target.src = '/images/bus4/bus4.webp'; }}
                />
                {pkg.badge && (
                  <div className="absolute top-3 left-3 bg-[#FFD23F] text-[#10233F] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {pkg.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                  <i className="far fa-clock"></i>
                  <span>{pkg.durasi}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-extrabold text-[#10233F] text-base lg:text-lg mb-1.5 group-hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-1">
                  {pkg.judul}
                </h3>
                <p className="text-[#0B5CA8] font-black text-sm mb-3">
                  {pkg.harga_fmt}
                </p>
                <p className="text-[#64748B] text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                  {pkg.deskripsi}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[#DDEAF6]">
                  <Link
                    to="/paket-wisata"
                    className="font-bold text-[10px] py-2.5 rounded-xl text-center transition-all bg-[#F3FAFF] text-[#073B78] hover:bg-[#EAF6FF]"
                  >
                    Lihat Paket
                  </Link>
                  <a
                    href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20tanya%20paket%20${encodeURIComponent(pkg.judul)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-[10px] py-2.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all"
                  >
                    <i className="fab fa-whatsapp"></i>
                    Tanya Paket
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourPackages;

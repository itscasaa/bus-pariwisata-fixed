import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner = () => {
  return (
    <section className="py-16 lg:py-20 bg-white text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-r from-[#073B78] via-[#062D5F] to-[#0B5CA8] rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-xl border border-white/10">
          {/* Glowing decoration blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD23F]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left - Text content */}
            <div className="text-center lg:text-left space-y-3 max-w-2xl">
              <span className="bg-white/10 text-[#FFD23F] border border-white/10 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <i className="fas fa-file-invoice-dollar text-[#FFD23F]"></i> Daftar Harga Terbaru
              </span>
              <h3 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
                Price List & Tarif Sewa
              </h3>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed">
                Lihat daftar harga sewa bus pariwisata dan layanan perjalanan terbaru kami untuk mempermudah perencanaan agenda wisata Anda.
              </p>
            </div>

            {/* Right - CTA Button */}
            <div className="flex-shrink-0 w-full lg:w-auto text-center">
              <Link
                to="/price-list"
                className="w-full lg:w-auto justify-center bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 inline-flex items-center gap-2"
              >
                <i className="fas fa-tags text-sm"></i>
                Lihat Price List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
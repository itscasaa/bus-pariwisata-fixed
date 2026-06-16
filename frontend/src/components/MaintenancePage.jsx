import React, { useEffect } from 'react';
import siteData from '../data/siteData';

const MaintenancePage = ({ message }) => {
  const whatsappNumber = siteData?.whatsapp?.number || '6285199802536';
  const defaultMessage = 'Halo Mafina Trans, saya ingin bertanya tentang sewa bus pariwisata.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  useEffect(() => {
    // Inject Material Symbols dynamically for premium UI icons
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1528] via-[#0F2440] to-[#0B1528] text-white px-4 relative overflow-hidden font-sans">
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#3525cd]/10 blur-[120px] pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#4e45d5]/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>

      {/* Main Container */}
      <div className="max-w-xl w-full text-center z-10 space-y-6">
        {/* Animated Glow Icon Wrapper */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-[#3525cd]/30 rounded-full blur-2xl scale-125 animate-pulse"></div>
          
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-[#3525cd] to-[#6860ef] rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 transform hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-4xl md:text-5xl text-white animate-bounce">
              construction
            </span>
          </div>
        </div>

        {/* Content Card with Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-4">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#e2dfff] to-white bg-clip-text text-transparent py-1 leading-normal">
            Sedang Dalam Pemeliharaan
          </h1>
          
          <div className="w-16 h-1 bg-gradient-to-r from-[#3525cd] to-[#6860ef] mx-auto rounded-full"></div>
          
          <p className="text-[#c7c4d8] text-sm md:text-base leading-relaxed max-w-md mx-auto">
            {message || 'Website kami sedang dalam pemeliharaan berkala untuk meningkatkan layanan kami. Kami akan segera kembali online.'}
          </p>
        </div>

        {/* Action / Contact Section */}
        <div className="space-y-4 pt-2">
          <p className="text-xs md:text-sm text-[#777587]">
            Butuh bantuan mendesak atau ingin melakukan pemesanan bus?
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white text-xs md:text-sm font-semibold rounded-full shadow-lg hover:shadow-green-500/20 hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              Hubungi via WhatsApp
            </a>
            
            <a
              href="mailto:mafinatourtravel@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-xs md:text-sm font-semibold rounded-full border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
              Kirim Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;

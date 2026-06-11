import React from 'react';

const ContactCTA = () => {
  const waLink = 'https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20bertanya%20tentang%20sewa%20bus%20pariwisata.';

  return (
    <section className="py-16 lg:py-20 bg-white text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-r from-[#073B78] via-[#062D5F] to-[#0B5CA8] rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-2xl border border-white/10 text-center">
          {/* Decorative blur blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFD23F]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="bg-white/10 text-[#FFD23F] border border-white/10 text-xs lg:text-sm font-extrabold uppercase tracking-wider px-4 py-2 rounded-full inline-flex items-center gap-1.5 shadow-sm">
              <i className="fas fa-question-circle text-[#FFD23F]"></i> Butuh Bantuan?
            </span>
            
            <h3 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Punya Pertanyaan?
            </h3>
            
            <p className="text-white/80 text-sm lg:text-base leading-relaxed">
              Hubungi kami sekarang dan dapatkan informasi terbaik serta penawaran spesial untuk rencana perjalanan wisata Anda.
            </p>
            
            <div className="pt-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-extrabold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 inline-flex items-center gap-2 text-sm"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;

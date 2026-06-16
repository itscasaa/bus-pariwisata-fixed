import React from 'react';
import siteData from '../data/siteData';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#062D5F] to-[#041E42] text-white border-t border-[#073B78]/30">
      <div className="container mx-auto px-4 py-6 md:py-8">

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-white/10">
          
          {/* Column 1 - Company Info */}
          <div className="w-full md:w-1/3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-wider text-white">
                MAFINA <span className="text-[#FFD23F]">TRANS</span>
              </span>
            </div>
            <p className="text-white/70 text-[11px] md:text-xs leading-relaxed max-w-sm">
              Solusi transportasi pariwisata terpercaya di Kota Tangerang. Aman, nyaman, dan armada lengkap.
            </p>
            <div className="space-y-1 text-[11px] md:text-xs text-white/80 pt-1">
              <p className="flex items-center gap-2">
                <i className="fab fa-whatsapp text-sm text-[#25D366]"></i>
                <a
                  href={`https://wa.me/${siteData.whatsapp.number}?text=${encodeURIComponent(siteData.whatsapp.message)}`}
                  className="hover:text-[#FFD23F] transition-colors underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteData.footer.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <i className="fas fa-envelope text-white/60 text-xs"></i>
                <a
                  href={`mailto:${siteData.footer.contact.email}`}
                  className="hover:text-[#FFD23F] transition-colors underline"
                >
                  {siteData.footer.contact.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-white/60 text-xs"></i>
                <span>{siteData.footer.contact.address}</span>
              </p>
            </div>
          </div>

          {/* Column 2 & 3 wrapper - Side-by-side on mobile */}
          <div className="w-full md:w-2/3 grid grid-cols-2 gap-4 md:gap-8">
            
            {/* Column 2 - Navigation Links */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs md:text-sm text-white border-b border-[#073B78]/50 pb-1 inline-block">
                Navigasi
              </h4>
              <ul className="space-y-1 text-[11px] md:text-xs text-white/80">
                <li>
                  <a href="/" className="hover:text-[#FFD23F] transition-colors flex items-center gap-1.5">
                    <i className="fas fa-chevron-right text-[8px] text-[#FFD23F]"></i>Beranda
                  </a>
                </li>
                <li>
                  <a href="/bus-wisata" className="hover:text-[#FFD23F] transition-colors flex items-center gap-1.5">
                    <i className="fas fa-chevron-right text-[8px] text-[#FFD23F]"></i>Armada Bus
                  </a>
                </li>
                <li>
                  <a href="/paket-wisata" className="hover:text-[#FFD23F] transition-colors flex items-center gap-1.5">
                    <i className="fas fa-chevron-right text-[8px] text-[#FFD23F]"></i>Paket Wisata
                  </a>
                </li>
                <li>
                  <a href="/price-list" className="hover:text-[#FFD23F] transition-colors flex items-center gap-1.5">
                    <i className="fas fa-chevron-right text-[8px] text-[#FFD23F]"></i>Price List
                  </a>
                </li>
                <li>
                  <a href="/news" className="hover:text-[#FFD23F] transition-colors flex items-center gap-1.5">
                    <i className="fas fa-chevron-right text-[8px] text-[#FFD23F]"></i>News &amp; Info
                  </a>
                </li>
                <li>
                  <a href="/kontak" className="hover:text-[#FFD23F] transition-colors flex items-center gap-1.5">
                    <i className="fas fa-chevron-right text-[8px] text-[#FFD23F]"></i>Kontak Kami
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Social Media */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs md:text-sm text-white border-b border-[#073B78]/50 pb-1 inline-block">
                Ikuti Kami
              </h4>
              <div className="flex gap-2">
                {siteData.footer.social.instagram && siteData.footer.social.instagram !== '#' && (
                  <a
                    href={siteData.footer.social.instagram}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:border-[#FFD23F] hover:bg-[#FFD23F]/20 flex items-center justify-center transition-all duration-200"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram text-xs"></i>
                  </a>
                )}
                {siteData.footer.social.tiktok && siteData.footer.social.tiktok !== '#' && (
                  <a
                    href={siteData.footer.social.tiktok}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:border-[#FFD23F] hover:bg-[#FFD23F]/20 flex items-center justify-center transition-all duration-200"
                    aria-label="TikTok"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-tiktok text-xs"></i>
                  </a>
                )}
              </div>
              <p className="text-white/50 text-[10px] leading-relaxed pt-1 hidden sm:block">
                Ikuti media sosial kami untuk update promo terbaru.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 text-center text-[10px] text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div>
            {siteData.footer.copyright}
          </div>
          <div>
            Dibuat dengan <i className="fas fa-heart text-red-500 mx-0.5 text-[8px]"></i> oleh Tim Mafina Trans
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
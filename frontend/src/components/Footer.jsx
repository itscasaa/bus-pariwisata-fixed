import React from 'react';
import siteData from '../data/siteData';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#062D5F] to-[#041E42] text-white border-t border-[#073B78]/30">
      <div className="container mx-auto px-4 py-12 lg:py-16">

        {/* 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* Column 1 - Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-wider text-white">
                MAFINA <span className="text-[#FFD23F]">TRANS</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Solusi transportasi pariwisata terpercaya di Kota Tangerang. Armada lengkap, nyaman, dan aman untuk perjalanan Anda.
            </p>
            <div className="space-y-2.5 text-sm text-white/80 pt-2">
              <p className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-lg text-[#25D366]"></i>
                <a
                  href={`https://wa.me/${siteData.whatsapp.number}?text=${encodeURIComponent(siteData.whatsapp.message)}`}
                  className="hover:text-[#FFD23F] transition-colors underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteData.footer.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <i className="fas fa-envelope text-white/70"></i>
                <a
                  href={`mailto:${siteData.footer.contact.email}`}
                  className="hover:text-[#FFD23F] transition-colors underline"
                >
                  {siteData.footer.contact.email}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <i className="fas fa-map-marker-alt text-white/70"></i>
                <span>{siteData.footer.contact.address}, Banten</span>
              </p>
            </div>
          </div>

          {/* Column 2 - Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-white border-b border-[#073B78]/50 pb-2 inline-block">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm text-white/85">
              <li>
                <a href="/" className="hover:text-[#FFD23F] transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[10px] text-[#FFD23F]"></i>Beranda
                </a>
              </li>
              <li>
                <a href="/bus-wisata" className="hover:text-[#FFD23F] transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[10px] text-[#FFD23F]"></i>Armada Bus
                </a>
              </li>
              <li>
                <a href="/paket-wisata" className="hover:text-[#FFD23F] transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[10px] text-[#FFD23F]"></i>Paket Wisata
                </a>
              </li>
              <li>
                <a href="/price-list" className="hover:text-[#FFD23F] transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[10px] text-[#FFD23F]"></i>Price List
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-[#FFD23F] transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[10px] text-[#FFD23F]"></i>News &amp; Info
                </a>
              </li>
              <li>
                <a href="/kontak" className="hover:text-[#FFD23F] transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[10px] text-[#FFD23F]"></i>Kontak Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Social Media */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-white border-b border-[#073B78]/50 pb-2 inline-block">
              Ikuti Kami
            </h4>
            <div className="flex gap-3">
              {siteData.footer.social.instagram && siteData.footer.social.instagram !== '#' && (
                <a
                  href={siteData.footer.social.instagram}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFD23F] hover:bg-[#FFD23F]/20 flex items-center justify-center transition-all duration-200"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram text-base"></i>
                </a>
              )}
              {siteData.footer.social.tiktok && siteData.footer.social.tiktok !== '#' && (
                <a
                  href={siteData.footer.social.tiktok}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFD23F] hover:bg-[#FFD23F]/20 flex items-center justify-center transition-all duration-200"
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-tiktok text-base"></i>
                </a>
              )}
            </div>
            <p className="text-white/60 text-xs leading-relaxed pt-2">
              Ikuti media sosial kami untuk mendapatkan informasi promo, update armada bus, dan destinasi wisata terbaru.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 text-center text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {siteData.footer.copyright}
          </div>
          <div>
            Dibuat dengan <i className="fas fa-heart text-red-500 mx-1"></i> oleh Tim Mafina Trans
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
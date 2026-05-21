import React from 'react';
import siteData from '../data/siteData';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-white">
      <div className="container mx-auto px-4 py-10">

        {/* 3 kolom utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/20">

          {/* Kolom 1 - Info perusahaan */}
          <div className="space-y-3">
            <h3 className="font-bold text-xl tracking-wide">SURYA TOUR &amp; TRANS</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Solusi transportasi pariwisata terpercaya di Kota Tangerang. Armada lengkap, nyaman, dan aman untuk perjalanan Anda.
            </p>
            <div className="space-y-1 text-sm text-white/80 pt-1">
              <p><i className="fas fa-phone mr-2"></i>087785598639</p>
              <p><i className="fas fa-envelope mr-2"></i>
                <a href="mailto:info@mafinatrans.co.id" className="hover:text-white transition-colors underline">
                  info@mafinatrans.co.id
                </a>
              </p>
              <p><i className="fas fa-map-marker-alt mr-2"></i>Kota Tangerang, Banten</p>
            </div>
          </div>

          {/* Kolom 2 - Link navigasi */}
          <div>
            <h4 className="font-semibold text-base mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/" className="hover:text-white transition-colors"><i className="fas fa-chevron-right mr-2 text-xs"></i>Beranda</a></li>
              <li><a href="/bus-wisata" className="hover:text-white transition-colors"><i className="fas fa-chevron-right mr-2 text-xs"></i>Armada Bus</a></li>
              <li><a href="/paket-wisata" className="hover:text-white transition-colors"><i className="fas fa-chevron-right mr-2 text-xs"></i>Paket Wisata</a></li>
              <li><a href="/price-list" className="hover:text-white transition-colors"><i className="fas fa-chevron-right mr-2 text-xs"></i>Price List</a></li>
              <li><a href="/news" className="hover:text-white transition-colors"><i className="fas fa-chevron-right mr-2 text-xs"></i>News &amp; Info</a></li>
              <li><a href="/kontak" className="hover:text-white transition-colors"><i className="fas fa-chevron-right mr-2 text-xs"></i>Kontak Kami</a></li>
            </ul>
          </div>

          {/* Kolom 3 - Sosial media */}
          <div>
            <h4 className="font-semibold text-base mb-4">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a href={siteData.footer.social.facebook}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook">
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a href={siteData.footer.social.instagram}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram">
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a href={siteData.footer.social.youtube}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200"
                aria-label="YouTube">
                <i className="fab fa-youtube text-sm"></i>
              </a>
              <a href={siteData.footer.social.twitter}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200"
                aria-label="Twitter">
                <i className="fab fa-twitter text-sm"></i>
              </a>
            </div>
            <p className="text-white/60 text-xs mt-4 leading-relaxed">
              Ikuti kami di media sosial untuk promo terbaru dan informasi wisata menarik.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 text-center text-xs text-white/50">
          {siteData.footer.copyright} &nbsp;|&nbsp; Dibuat dengan <i className="fas fa-heart text-red-400 mx-1"></i> oleh Tim Surya Tour &amp; Trans
        </div>

      </div>
    </footer>
  );
};

export default Footer;
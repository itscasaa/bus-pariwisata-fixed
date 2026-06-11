import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteData from '../data/siteData';
import logoImg from '../assets/logo.webp';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-[#073B78] font-extrabold'
      : 'text-[#10233F] hover:text-[#0B5CA8] transition-all duration-300';

  const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Armada Bus', path: '/bus-wisata' },
    { label: 'Paket Wisata', path: '/paket-wisata' },
    { label: 'Price List', path: '/price-list' },
    { label: 'News & Info', path: '/news' },
    { label: 'Kontak Kami', path: '/kontak' },
  ];

  const waLink = `https://wa.me/6285199802536?text=${encodeURIComponent('Halo Mafina Trans, saya ingin bertanya tentang sewa bus pariwisata.')}`;

  return (
    <nav 
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #DDEAF6',
        boxShadow: '0 4px 20px rgba(16, 35, 63, 0.05)'
      }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          
          {/* Logo - Transparent, no capsule background */}
          <Link to="/" className="flex items-center group">
            <img
              src={logoImg}
              alt="Mafina Trans"
              width={120}
              height={120}
              className="h-10 lg:h-[44px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 xl:px-4 py-2 nav-link-custom relative group transition-all duration-300 ${isActive(item.path)}`}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#073B78] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* CTA Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-[#10233F] font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
              style={{
                background: '#FFD23F',
                border: '1px solid #F6B800'
              }}
            >
              <i className="fab fa-whatsapp text-lg"></i>
              Pesan Sekarang
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-[#10233F] hover:text-[#073B78] text-2xl focus:outline-none p-2 rounded-lg hover:bg-[#10233F]/5 transition-colors duration-200"
            aria-label="Toggle navigation"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[450px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div 
          className="border-t px-4 py-3 space-y-1 shadow-inner"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderTop: '1px solid #DDEAF6'
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 nav-link-custom rounded-lg transition-colors duration-200 ${isActive(item.path)}`}
            >
              {item.label}
            </Link>
          ))}
          {/* Mobile CTA Button */}
          <div className="pt-2 px-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full text-[#10233F] text-center font-bold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              style={{
                background: '#FFD23F',
                border: '1px solid #F6B800'
              }}
            >
              <i className="fab fa-whatsapp text-lg"></i>
              Pesan Sekarang
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

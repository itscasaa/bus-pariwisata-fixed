import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteData from '../data/siteData';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-[var(--color-primary)] font-bold'
      : 'text-gray-600 hover:text-[var(--color-primary)]';

  const allLinks = [
    ...siteData.navLinks,
    { label: 'Price List', path: '/price-list' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-blue-50/80 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center group">
            <img
              src={logoImg}
              alt="Mafina Trans"
              className="h-14 lg:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={`px-3 xl:px-4 py-2 text-sm font-semibold relative group transition-all duration-300 ${isActive('/')}`}>
                <i className="fas fa-home mr-1.5 text-[var(--color-primary)]"></i>Home
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1d6ec5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/bus-wisata" className={`px-3 xl:px-4 py-2 text-sm font-semibold relative group transition-all duration-300 ${isActive('/bus-wisata')}`}>
                <i className="fas fa-bus mr-1.5 text-[var(--color-primary)]"></i>Armada
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1d6ec5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/paket-wisata" className={`px-3 xl:px-4 py-2 text-sm font-semibold relative group transition-all duration-300 ${isActive('/paket-wisata')}`}>
                <i className="fas fa-map-marked-alt mr-1.5 text-[var(--color-primary)]"></i>Paket Wisata
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1d6ec5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/price-list" className={`px-3 xl:px-4 py-2 text-sm font-semibold relative group transition-all duration-300 ${isActive('/price-list')}`}>
                <i className="fas fa-tags mr-1.5 text-[var(--color-primary)]"></i>Price List
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1d6ec5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/news" className={`px-3 xl:px-4 py-2 text-sm font-semibold relative group transition-all duration-300 ${isActive('/news')}`}>
                <i className="fas fa-newspaper mr-1.5 text-[var(--color-primary)]"></i>News & Info
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1d6ec5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/kontak" className={`px-3 xl:px-4 py-2 text-sm font-semibold relative group transition-all duration-300 ${isActive('/kontak')}`}>
                <i className="fas fa-envelope mr-1.5 text-[var(--color-primary)]"></i>Kontak Kami
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1d6ec5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-700 hover:text-[#1d6ec5] text-2xl focus:outline-none p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            aria-label="Toggle navigation"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 space-y-1 shadow-inner">
          <Link to="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-200 ${isActive('/')}`}>
            <i className="fas fa-home mr-3 text-[#1d6ec5]"></i>Home
          </Link>
          <Link to="/bus-wisata" onClick={() => setIsOpen(false)} className={`block px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-200 ${isActive('/bus-wisata')}`}>
            <i className="fas fa-bus mr-3 text-[#1d6ec5]"></i>Armada
          </Link>
          <Link to="/paket-wisata" onClick={() => setIsOpen(false)} className={`block px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-200 ${isActive('/paket-wisata')}`}>
            <i className="fas fa-map-marked-alt mr-3 text-[#1d6ec5]"></i>Paket Wisata
          </Link>
          <Link to="/price-list" onClick={() => setIsOpen(false)} className={`block px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-200 ${isActive('/price-list')}`}>
            <i className="fas fa-tags mr-3 text-[#1d6ec5]"></i>Price List
          </Link>
          <Link to="/news" onClick={() => setIsOpen(false)} className={`block px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-200 ${isActive('/news')}`}>
            <i className="fas fa-newspaper mr-3 text-[#1d6ec5]"></i>News & Info
          </Link>
          <Link to="/kontak" onClick={() => setIsOpen(false)} className={`block px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-200 ${isActive('/kontak')}`}>
            <i className="fas fa-envelope mr-3 text-[#1d6ec5]"></i>Kontak Kami
          </Link>
        </div>
      </div>
        </nav>
  );
};

export default Navbar;

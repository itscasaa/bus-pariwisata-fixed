import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const navItems = [
  { to: '/',             icon: 'dashboard',      label: 'Dashboard',          end: true },
  { to: '/armada',       icon: 'directions_bus', label: 'Kelola Armada' },
  { to: '/price-list',   icon: 'payments',       label: 'Kelola Price List' },
  { to: '/wisata',       icon: 'map',            label: 'Kelola Wisata' },
  { to: '/news',         icon: 'newspaper',      label: 'Kelola Berita' },
];

export default function Layout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const nama      = localStorage.getItem('admin_nama') || 'Admin';
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('admin_sidebar_collapsed') === 'true');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Tutup drawer saat navigasi
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Prevent body scroll saat drawer terbuka
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Track viewport width dynamically
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_nama');
    window.location.href = '/login';
  };

  const SidebarContent = ({ forceExpanded = false } = {}) => {
    const showCollapsed = isCollapsed && !forceExpanded;
    return (
      <>
        {/* Logo */}
        <div className={`mb-8 ${showCollapsed ? 'px-1' : 'px-4'}`}>
          <div className={`flex items-center ${showCollapsed ? 'justify-center' : 'gap-3.5'}`}>
            <div className={`${showCollapsed ? 'w-10 h-10' : 'w-14 h-14'} flex items-center justify-center shrink-0`}>
              <img src={logoImg} alt="Mafina Trans Logo" className="w-full h-full object-contain" />
            </div>
            {!showCollapsed && (
              <div>
                <h1 className="font-extrabold text-zinc-900 leading-tight" style={{ fontSize: '16.5px' }}>
                  Mafina Trans
                </h1>
                <p className="text-zinc-400 font-medium" style={{ fontSize: '11px' }}>Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={showCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl font-bold transition-all duration-200 ${
                  showCollapsed ? 'justify-center p-3 mx-auto w-12 h-12' : 'gap-3 px-4 py-3.5'
                } ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border border-blue-100/50 shadow-sm scale-[0.97]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70'
                }`
              }
              style={{ fontSize: '13px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{item.icon}</span>
              {!showCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className={`pt-4 border-t border-zinc-200 space-y-1.5 ${showCollapsed ? 'px-0' : ''}`}>
          <a
            href="https://mafinatrans.duckdns.org"
            target="_blank"
            rel="noopener noreferrer"
            title={showCollapsed ? "Lihat Website" : undefined}
            className={`flex items-center text-zinc-500 hover:text-zinc-900
                       hover:bg-zinc-100/70 rounded-xl transition-all duration-200 ${
                         showCollapsed ? 'justify-center p-3 mx-auto w-12 h-12' : 'gap-3 px-4 py-3.5'
                       }`}
            style={{ fontSize: '13px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>language</span>
            {!showCollapsed && <span>Lihat Website</span>}
          </a>
          <button
            onClick={handleLogout}
            title={showCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center text-red-650 hover:bg-red-50 hover:text-red-700
                       rounded-xl transition-all duration-200 ${
                         showCollapsed ? 'justify-center p-3 mx-auto w-12 h-12' : 'gap-3 px-4 py-3.5'
                       }`}
            style={{ fontSize: '13px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>logout</span>
            {!showCollapsed && <span className="font-bold">Logout</span>}
          </button>
        </div>

        {/* User card */}
        <div
          title={showCollapsed ? `${nama} - Administrator` : undefined}
          className={`mt-4 bg-zinc-50 border border-zinc-150/60 rounded-xl flex items-center ${
            showCollapsed ? 'justify-center p-2 mx-auto w-12 h-12' : 'px-4 py-3.5 gap-3'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center
                          text-zinc-700 font-extrabold shrink-0" style={{ fontSize: '12px' }}>
            {nama.charAt(0).toUpperCase()}
          </div>
          {!showCollapsed && (
            <div className="min-w-0">
              <p className="font-bold text-zinc-800 truncate" style={{ fontSize: '12.5px' }}>{nama}</p>
              <p className="text-zinc-400 font-medium" style={{ fontSize: '10px' }}>Administrator</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-surface">

      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen flex-col py-6 px-4 z-50
                   bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out"
        style={{ width: isCollapsed ? '88px' : '280px', boxShadow: '0px 10px 30px rgba(0,0,0,0.01)' }}
      >
        <SidebarContent />

        {/* Collapse Button */}
        <button
          onClick={() => {
            const newState = !isCollapsed;
            setIsCollapsed(newState);
            localStorage.setItem('admin_sidebar_collapsed', newState);
          }}
          className="absolute -right-3.5 top-8 w-7 h-7 bg-white border border-zinc-200
                     rounded-full flex items-center justify-center shadow-md hover:bg-zinc-50
                     hover:text-zinc-900 transition-all duration-200 z-50 text-zinc-400 hover:scale-110 cursor-pointer"
          title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </aside>

      {/* ── Mobile Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className="fixed left-0 top-0 h-screen flex flex-col py-6 px-4 z-50 lg:hidden
                   bg-white border-r border-zinc-200 transition-transform duration-300"
        style={{
          width: '280px',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: open ? '0px 10px 40px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                     rounded-full hover:bg-zinc-50 transition-colors text-zinc-400 hover:text-zinc-950"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
        </button>
        <SidebarContent forceExpanded={true} />
      </aside>

      {/* ── Main Content ── */}
      <div
        className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out"
        style={{ marginLeft: isDesktop ? (isCollapsed ? '88px' : '280px') : '0px' }}
      >

        {/* ── Mobile Top Bar ── */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white
                        border-b border-zinc-150 sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl
                       hover:bg-zinc-50 transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-500" style={{ fontSize: '24px' }}>
              menu
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-zinc-900" style={{ fontSize: '16.5px' }}>Mafina Trans</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center
                          text-zinc-700 font-extrabold" style={{ fontSize: '13px' }}>
            {nama.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* ── Page Content ── */}
        <Outlet />
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white
                   border-t border-zinc-150 flex items-center justify-around px-2 py-2"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.03)' }}
      >
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 ${
                isActive ? 'text-blue-600' : 'text-zinc-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-10 h-8 flex items-center justify-center rounded-full transition-all"
                  style={{ background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    {item.icon}
                  </span>
                </div>
                <span className="truncate" style={{ fontSize: '10px', fontWeight: isActive ? '700' : '500' }}>
                  {item.label.replace('Kelola ', '')}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

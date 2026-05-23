import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/',           icon: 'dashboard',      label: 'Dashboard',       end: true },
  { to: '/armada',     icon: 'directions_bus', label: 'Kelola Armada' },
  { to: '/price-list', icon: 'payments',       label: 'Kelola Price List' },
  { to: '/news',       icon: 'newspaper',      label: 'Kelola Berita' },
];

export default function Layout() {
  const navigate = useNavigate();
  const nama = localStorage.getItem('admin_nama') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_nama');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface-container-lowest border-r border-outline-variant flex flex-col py-unit-lg px-unit-md z-50 card-shadow">
        {/* Logo */}
        <div className="mb-unit-xl px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-xl">directions_bus</span>
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-primary leading-tight">Surya Tour</h1>
              <p className="text-[12px] text-outline">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-unit-md px-4 py-3 rounded-xl text-body-md font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-md scale-[0.97]'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="pt-unit-lg border-t border-outline-variant space-y-1">
          <a
            href="http://localhost:3003"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high px-4 py-3 rounded-xl transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[22px]">language</span>
            <span className="text-body-md">Lihat Website</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-unit-md text-error hover:bg-error-container px-4 py-3 rounded-xl transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="text-body-md font-medium">Logout</span>
          </button>
        </div>

        {/* User */}
        <div className="mt-3 px-4 py-3 bg-surface-container-low rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm shrink-0">
            {nama.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-on-surface truncate">{nama}</p>
            <p className="text-[11px] text-outline">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-sidebar-width flex-1 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

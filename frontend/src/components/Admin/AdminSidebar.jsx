import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'directions_bus', label: 'Kelola Armada', path: '/admin/armada' },
    { icon: 'payments', label: 'Kelola Price List', path: '/admin/price-list' },
    { icon: 'newspaper', label: 'Kelola Berita', path: '/admin/news' },
    { icon: 'language', label: 'Lihat Website', path: '/', external: true },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface dark:bg-surface-container border-r border-outline-variant dark:border-outline shadow-sm flex flex-col py-unit-lg px-unit-md z-50">
      {/* Logo Section */}
      <div className="mb-unit-xl px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined">directions_bus</span>
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary leading-tight">
              Mafina Trans
            </h1>
            <p className="font-body-md text-body-md text-outline">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className={`flex items-center gap-unit-md px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary-container text-on-primary-container shadow-md scale-95'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md text-body-md">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="pt-unit-lg border-t border-outline-variant space-y-2">
        <Link
          to="/admin/settings"
          className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high px-4 py-3 rounded-xl transition-all duration-200"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-unit-md text-error hover:bg-error-container px-4 py-3 rounded-xl transition-all duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

import React from 'react';

export default function PageHeader({ title, subtitle }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="flex justify-between items-center w-full pt-4 lg:pt-unit-lg
                       px-4 lg:px-unit-xl bg-transparent mb-4 lg:mb-unit-lg">
      <div>
        <h2 className="font-black text-on-surface" style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>
          {title}
        </h2>
        <p className="text-outline mt-0.5" style={{ fontSize: '13px' }}>
          {subtitle || dateStr}
        </p>
      </div>

      {/* Desktop only: search + profile */}
      <div className="hidden lg:flex items-center gap-unit-lg">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                           text-outline" style={{ fontSize: '20px' }}>search</span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-56
                       focus:ring-2 focus:ring-primary outline-none"
            placeholder="Cari data..."
            type="text"
            style={{ fontSize: '14px' }}
          />
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
          <div className="text-right">
            <p className="font-bold text-on-surface" style={{ fontSize: '12px' }}>
              {localStorage.getItem('admin_nama') || 'Admin'}
            </p>
            <p className="text-outline" style={{ fontSize: '11px' }}>Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center
                          text-white font-bold ring-2 ring-primary-container" style={{ fontSize: '14px' }}>
            {(localStorage.getItem('admin_nama') || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

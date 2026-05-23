import React from 'react';

export default function PageHeader({ title, subtitle }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <header className="flex justify-between items-center w-full pt-unit-lg px-unit-xl bg-transparent mb-unit-lg">
      <div>
        <h2 className="text-headline-md font-black text-on-surface">{title}</h2>
        <p className="text-body-md text-outline">{subtitle || dateStr}</p>
      </div>
      <div className="flex items-center gap-unit-lg">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-primary text-body-md outline-none"
            placeholder="Cari data..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
          <div className="text-right hidden sm:block">
            <p className="text-label-sm font-bold text-on-surface">{localStorage.getItem('admin_nama') || 'Admin'}</p>
            <p className="text-label-sm text-outline">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold ring-2 ring-primary-container">
            {(localStorage.getItem('admin_nama') || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

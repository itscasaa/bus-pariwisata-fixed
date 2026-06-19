import React from 'react';

export default function PageHeader({ title, subtitle }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const displayTitle = title === 'Dashboard' 
    ? `Halo, ${localStorage.getItem('admin_nama') || 'Admin'}! 👋` 
    : title;
  const displaySubtitle = title === 'Dashboard'
    ? 'Berikut adalah ringkasan data operasional Mafina Trans.'
    : subtitle || dateStr;

  return (
    <header className="flex justify-between items-center w-full pt-4 lg:pt-6 px-4 lg:px-8 bg-transparent mb-6">
      <div>
        <h2 className="font-black text-zinc-900 tracking-tight" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>
          {displayTitle}
        </h2>
        <p className="text-zinc-500 mt-1" style={{ fontSize: '13px' }}>
          {displaySubtitle}
        </p>
      </div>

      {/* Desktop only: search, date, action icons, profile */}
      <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
        {/* Search */}
        <div className="relative shrink-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" style={{ fontSize: '18px' }}>
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-white border border-zinc-200 text-zinc-800 placeholder-zinc-400 rounded-full w-40 xl:w-56 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-xs shadow-sm"
            placeholder="Cari data..."
            type="text"
          />
        </div>

        {/* Date display */}
        <div className="text-zinc-600 text-xs font-semibold bg-white border border-zinc-200 px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-sm shrink-0 whitespace-nowrap">
          <span className="material-symbols-outlined text-sm text-zinc-400">calendar_today</span>
          <span>{dateStr}</span>
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm">
            <span className="material-symbols-outlined text-sm">settings</span>
          </button>
          <button className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm">
            <span className="material-symbols-outlined text-sm">notifications</span>
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 shrink-0">
          <div className="text-right">
            <p className="font-extrabold text-zinc-800 whitespace-nowrap" style={{ fontSize: '12px' }}>
              {localStorage.getItem('admin_nama') || 'Admin'}
            </p>
            <p className="text-zinc-400 text-[10px] font-semibold whitespace-nowrap">Super Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-extrabold shadow-sm" style={{ fontSize: '13px' }}>
            {(localStorage.getItem('admin_nama') || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

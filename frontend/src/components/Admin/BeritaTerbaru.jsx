import React from 'react';
import { useNavigate } from 'react-router-dom';

const BeritaTerbaru = () => {
  const navigate = useNavigate();
  const hasNews = false; // TODO: Fetch from API

  if (hasNews) {
    return (
      <section className="bg-surface-container-lowest rounded-[24px] custom-shadow p-unit-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-headline-sm font-headline-sm text-on-surface">Berita Terbaru</h3>
          <button className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        {/* News list will go here */}
      </section>
    );
  }

  // Empty State
  return (
    <section className="bg-surface-container-lowest rounded-[24px] custom-shadow p-unit-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">Berita Terbaru</h3>
        <button className="text-outline hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-32 h-32 bg-surface-container-low rounded-full flex items-center justify-center mb-6 relative">
          <span className="material-symbols-outlined text-5xl text-outline-variant">newspaper</span>
          <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-primary">info</span>
          </div>
        </div>
        <h4 className="text-body-lg font-bold text-on-surface mb-2">Belum ada berita baru</h4>
        <p className="text-body-md text-outline px-6">
          Mulailah menulis berita atau pengumuman terbaru untuk ditampilkan di website utama.
        </p>
        <button
          onClick={() => navigate('/admin/news/create')}
          className="mt-6 px-6 py-2 rounded-full border border-primary text-primary font-bold text-body-md hover:bg-primary hover:text-white transition-all"
        >
          Buat Berita Pertama
        </button>
      </div>
    </section>
  );
};

export default BeritaTerbaru;

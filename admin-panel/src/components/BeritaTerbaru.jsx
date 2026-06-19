import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_PUB, API_BASE } from '../config/api';

const BeritaTerbaru = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_PUB}/news.php`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') {
          setNews(d.data.slice(0, 3));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white border border-zinc-200/60 rounded-[24px] p-6" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}>
        <h3 className="text-lg font-black text-zinc-800 mb-6">Berita Terbaru</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="bg-white border border-zinc-200/60 rounded-[24px] p-6" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-zinc-800">Berita Terbaru</h3>
          <span className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-blue-500">
            more_horiz
          </span>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-24 h-24 bg-zinc-50 border border-zinc-150 rounded-full flex items-center justify-center mb-6 relative">
            <span className="material-symbols-outlined text-4xl text-zinc-400">
              newspaper
            </span>
            <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-blue-50 border border-blue-150 rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
            </div>
          </div>
          
          <h4 className="text-sm font-bold text-zinc-700 mb-2">
            Belum ada berita baru
          </h4>
          <p className="text-xs text-zinc-400 px-6">
            Mulailah menulis berita atau pengumuman terbaru untuk ditampilkan di website utama.
          </p>
          
          <button
            onClick={() => navigate('/news/tambah')}
            className="mt-6 px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            Buat Berita Pertama
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-zinc-200/60 rounded-[24px] p-6" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-zinc-800">Berita Terbaru</h3>
        <button 
          onClick={() => navigate('/news')}
          className="text-blue-650 text-xs font-bold hover:text-blue-700 hover:underline cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50/70 transition-colors cursor-pointer border border-transparent hover:border-zinc-150/80"
            onClick={() => navigate(`/news/edit/${item.id}`)}
          >
            <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-150 overflow-hidden flex-shrink-0">
              <img
                src={
                  item.gambar
                    ? (item.gambar.startsWith('http') ? item.gambar : `${API_BASE}${item.gambar}`)
                    : 'https://via.placeholder.com/48x48?text=News'
                }
                alt={item.judul}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-zinc-800 truncate">
                {item.judul}
              </h4>
              <p className="text-[10px] font-semibold text-zinc-400 mt-1">
                {new Date(item.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              item.status === 'publish' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {item.status === 'publish' ? 'Published' : 'Draft'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BeritaTerbaru;

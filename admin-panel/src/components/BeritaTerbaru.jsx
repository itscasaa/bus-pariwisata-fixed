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
      <section className="bg-surface-container-lowest rounded-[24px] custom-shadow p-unit-lg">
        <h3 className="text-headline-sm text-on-surface mb-6">Berita Terbaru</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-surface-container rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-[24px] custom-shadow p-unit-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-headline-sm text-on-surface">Berita Terbaru</h3>
          <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">
            more_horiz
          </span>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-32 h-32 bg-surface-container-low rounded-full flex items-center justify-center mb-6 relative">
            <span className="material-symbols-outlined text-5xl text-outline-variant">
              newspaper
            </span>
            <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-primary">info</span>
            </div>
          </div>
          
          <h4 className="text-body-lg font-bold text-on-surface mb-2">
            Belum ada berita baru
          </h4>
          <p className="text-body-md text-outline px-6">
            Mulailah menulis berita atau pengumuman terbaru untuk ditampilkan di website utama.
          </p>
          
          <button
            onClick={() => navigate('/news/tambah')}
            className="mt-6 px-6 py-2 rounded-full border border-primary text-primary font-bold text-body-md hover:bg-primary hover:text-white transition-all"
          >
            Buat Berita Pertama
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest rounded-[24px] custom-shadow p-unit-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-headline-sm text-on-surface">Berita Terbaru</h3>
        <button 
          onClick={() => navigate('/news')}
          className="text-primary text-body-md font-semibold hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
            onClick={() => navigate(`/news/edit/${item.id}`)}
          >
            <div className="w-12 h-12 rounded-lg bg-surface-dim overflow-hidden flex-shrink-0">
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
              <h4 className="text-body-md font-bold text-on-surface truncate">
                {item.judul}
              </h4>
              <p className="text-label-sm text-outline">
                {new Date(item.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              item.status === 'publish' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
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

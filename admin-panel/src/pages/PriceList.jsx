import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM } from '../config/api';

export default function PriceList() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    setError('');
    const url = search ? `${API_PUB}/price_list.php?keyword=${encodeURIComponent(search)}` : `${API_PUB}/price_list.php`;
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Gagal memuat price list dari server.');
        return r.json();
      })
      .then(d => setPrices(d.data || []))
      .catch(err => setError(err.message || 'Tidak dapat terhubung ke server.'))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    setVisibleCount(5);
  }, [search]);

  const handleHapus = async (id) => {
    if (!confirm('Hapus destinasi ini?')) return;
    try {
      const res = await fetch(`${API_ADM}/hapus_harga.php?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPrices(prices.filter(p => p.id !== id));
      } else {
        alert(data.message || 'Gagal menghapus.');
      }
    } catch {
      alert('Gagal menghapus. Coba lagi.');
    }
  };


  const formatRp = n => n && n > 0 ? 'Rp ' + new Intl.NumberFormat('id-ID').format(n) : 'Hubungi Kami';

  return (
    <main className="flex-1">
      <PageHeader title="Kelola Price List" subtitle="Manajemen harga sewa per destinasi" />
      <div className="px-4 lg:px-8 pb-24 lg:pb-12">
        <div 
          className="bg-white border border-zinc-200/60 rounded-[24px] p-6" 
          style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.01)' }}
        >
          {error && (
            <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-extrabold text-zinc-800">Daftar Harga</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{prices.length} destinasi</p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl transition-all max-w-xs w-full">
                <span className="material-symbols-outlined text-zinc-400" style={{ fontSize: '20px' }}>
                  search
                </span>
                <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearch(keyword)}
                  placeholder="Cari destinasi..."
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-zinc-700 w-full placeholder-zinc-400 font-medium"
                />
                {keyword && (
                  <button onClick={() => { setKeyword(''); setSearch(''); }} className="text-zinc-400 hover:text-blue-600">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>

              {/* Tambah Button */}
              <button
                onClick={() => navigate('/price-list/tambah')}
                className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm text-xs cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Tambah Harga
              </button>
            </div>
          </div>

          {/* Desktop/Tablet Table View (Cleaned & simplified) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100">
                  {['Tujuan', 'Durasi', 'HiAce', 'Elf', 'Medium Bus', 'Big Bus', 'Aksi'].map(h => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider ${
                        h === 'Aksi' ? 'text-center' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100/70">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-400 text-xs font-semibold">
                      Memuat data...
                    </td>
                  </tr>
                ) : prices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-450 text-xs font-semibold">
                      Tidak ada data harga sewa
                    </td>
                  </tr>
                ) : (
                  prices.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-50/30 transition-colors group">
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <span className="font-bold text-zinc-800 text-sm leading-snug">{p.nama_destinasi}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-zinc-500 text-xs font-semibold">{p.durasi}</span>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-650 text-xs font-medium whitespace-nowrap">
                        {formatRp(p.harga_hiace)}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-650 text-xs font-medium whitespace-nowrap">
                        {formatRp(p.harga_elf)}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-650 text-xs font-medium whitespace-nowrap">
                        {formatRp(p.harga_medium)}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-blue-600 text-xs whitespace-nowrap">
                        {formatRp(p.harga_big)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center w-[100px]">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate(`/price-list/edit/${p.id}`)}
                            className="text-zinc-400 hover:text-blue-600 transition-all cursor-pointer bg-transparent border-none p-1"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleHapus(p.id)}
                            className="text-zinc-400 hover:text-red-600 transition-all cursor-pointer bg-transparent border-none p-1"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile List View (Simpler card layout with Show More) */}
          <div className="block sm:hidden space-y-4">
            {loading ? (
              <div className="text-center py-10 text-zinc-400 text-xs font-semibold">Memuat data...</div>
            ) : prices.length === 0 ? (
              <div className="text-center py-10 text-zinc-450 text-xs font-semibold">Tidak ada data harga sewa</div>
            ) : (
              <>
                {prices.slice(0, visibleCount).map(p => (
                  <div key={p.id} className="bg-zinc-50 border border-zinc-200/60 rounded-[20px] p-5 shadow-sm space-y-4">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-200/60">
                      <div className="flex gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0 mt-0.5">location_on</span>
                        <span className="font-bold text-zinc-850 text-sm leading-tight">{p.nama_destinasi}</span>
                      </div>
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100/50 shrink-0">
                        {p.durasi}
                      </span>
                    </div>

                    {/* Grid of Prices */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                      <div className="flex flex-col border-b border-zinc-200/40 pb-1.5">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">HiAce</span>
                        <span className="text-zinc-700 font-extrabold mt-0.5">{formatRp(p.harga_hiace)}</span>
                      </div>
                      <div className="flex flex-col border-b border-zinc-200/40 pb-1.5">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">Elf</span>
                        <span className="text-zinc-700 font-extrabold mt-0.5">{formatRp(p.harga_elf)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">Medium Bus</span>
                        <span className="text-zinc-700 font-extrabold mt-0.5">{formatRp(p.harga_medium)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">Big Bus</span>
                        <span className="text-blue-600 font-black mt-0.5">{formatRp(p.harga_big)}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-2.5 pt-3 border-t border-zinc-200/60">
                      <button
                        onClick={() => navigate(`/price-list/edit/${p.id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100/30 text-xs font-bold transition-all cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleHapus(p.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 text-red-650 hover:bg-red-100 border border-red-100/30 text-xs font-bold transition-all cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}

                {prices.length > visibleCount && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 5)}
                      className="px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-blue-100/30 shadow-sm active:scale-95"
                    >
                      Tampilkan Lebih Banyak
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

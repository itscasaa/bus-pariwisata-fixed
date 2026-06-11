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
      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        <div className="bg-surface-container-lowest rounded-[24px] card-shadow overflow-hidden">
          {error && (
            <div className="mx-unit-lg mt-5 bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}
          <div className="px-unit-lg py-6 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30">
            <div>
              <h3 className="text-headline-sm text-on-surface">Daftar Harga</h3>
              <p className="text-body-md text-outline mt-0.5">{prices.length} destinasi</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                <input value={keyword} onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearch(keyword)}
                  placeholder="Cari destinasi..." className="pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md focus:outline-none focus:ring-2 focus:ring-primary w-48" />
              </div>
              {search && <button onClick={() => { setSearch(''); setKeyword(''); }} className="text-xs text-outline hover:text-primary">Reset</button>}
              <button onClick={() => navigate('/price-list/tambah')}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-secondary transition-colors">
                <span className="material-symbols-outlined text-[18px]">add_circle</span> Tambah
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Tujuan','Durasi','HiAce','Elf','Medium','Big Bus','Aksi'].map(h => (
                    <th key={h} className={`px-unit-lg py-4 text-label-sm text-outline uppercase tracking-wider font-medium ${h === 'Aksi' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {loading ? <tr><td colSpan={7} className="px-unit-lg py-10 text-center text-outline">Memuat...</td></tr>
                : prices.map(p => (
                  <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-unit-lg py-3.5 max-w-[220px]">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">location_on</span>
                        <span className="font-semibold text-on-surface text-sm leading-snug">{p.nama_destinasi}</span>
                      </div>
                    </td>
                    <td className="px-unit-lg py-3.5">
                      <span className="bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">{p.durasi}</span>
                    </td>
                    <td className="px-unit-lg py-3.5 text-on-surface-variant text-xs whitespace-nowrap">{formatRp(p.harga_hiace)}</td>
                    <td className="px-unit-lg py-3.5 text-on-surface-variant text-xs whitespace-nowrap">{formatRp(p.harga_elf)}</td>
                    <td className="px-unit-lg py-3.5 text-on-surface-variant text-xs whitespace-nowrap">{formatRp(p.harga_medium)}</td>
                    <td className="px-unit-lg py-3.5 font-bold text-primary text-xs whitespace-nowrap">{formatRp(p.harga_big)}</td>
                    <td className="px-unit-lg py-3.5 whitespace-nowrap text-center w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/price-list/edit/${p.id}`)}
                          className="w-10 h-10 inline-flex items-center justify-center rounded-[14px] transition-all hover:scale-105"
                          style={{
                            background: 'rgba(53,37,205,0.08)',
                            color: '#3525cd',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(53,37,205,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(53,37,205,0.08)'}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleHapus(p.id)}
                          className="w-10 h-10 inline-flex items-center justify-center rounded-[14px] transition-all hover:scale-105"
                          style={{
                            background: 'rgba(186,26,26,0.08)',
                            color: '#ba1a1a',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(186,26,26,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(186,26,26,0.08)'}
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const API = 'http://localhost/bus_pariwisata';

export default function PriceList() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = search ? `${API}/api/price_list.php?keyword=${encodeURIComponent(search)}` : `${API}/api/price_list.php`;
    fetch(url).then(r => r.json()).then(d => setPrices(d.data || [])).finally(() => setLoading(false));
  }, [search]);

  const handleHapus = async (id) => {
    if (!confirm('Hapus destinasi ini?')) return;
    await fetch(`${API}/admin/api/hapus_harga.php?id=${id}`);
    setPrices(prices.filter(p => p.id !== id));
  };

  const formatRp = n => n && n > 0 ? 'Rp ' + new Intl.NumberFormat('id-ID').format(n) : 'Hubungi Kami';

  return (
    <main className="flex-1">
      <PageHeader title="Kelola Price List" subtitle="Manajemen harga sewa per destinasi" />
      <div className="px-unit-xl pb-unit-xl">
        <div className="bg-surface-container-lowest rounded-[24px] card-shadow overflow-hidden">
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
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Tujuan','Durasi','HiAce','Elf','Medium','Big Bus','Aksi'].map(h => (
                    <th key={h} className="px-unit-lg py-4 text-label-sm text-outline uppercase tracking-wider font-medium">{h}</th>
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
                    <td className="px-unit-lg py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/price-list/edit/${p.id}`)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-bold hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-[15px]">edit</span> Edit
                        </button>
                        <button onClick={() => handleHapus(p.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-error-container text-on-error-container text-xs font-bold hover:opacity-80 transition-opacity">
                          <span className="material-symbols-outlined text-[15px]">delete</span> Hapus
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

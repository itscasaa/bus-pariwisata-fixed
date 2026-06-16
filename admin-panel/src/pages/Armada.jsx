import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM, API_BASE } from '../config/api';

const ITEMS_PER_PAGE = 5;

// ─── Badge config per tipe ────────────────────────────────────────────────────
const TIPE_CONFIG = {
  big_bus:    { label: 'Executive', bg: '#c3c0ff', color: '#3323cc' },
  medium_bus: { label: 'VIP Class', bg: '#e3dfff', color: '#100069' },
  elf:        { label: 'Standard',  bg: '#eae6f4', color: '#464555' },
  hiace:      { label: 'Microbus',  bg: '#ffdbcc', color: '#7b2f00' },
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  available:  { label: 'Available',   bg: '#dcfce7', color: '#15803d' },
  in_service: { label: 'In Service',  bg: '#ffedd5', color: '#c2410c' },
  booked:     { label: 'Booked',      bg: '#dbeafe', color: '#1d4ed8' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRp = n => n ? 'Rp ' + new Intl.NumberFormat('id-ID').format(n) : '-';

const getTipeConfig  = t => TIPE_CONFIG[t]   || TIPE_CONFIG.elf;
const getStatusConfig = s => STATUS_CONFIG[s] || STATUS_CONFIG.available;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Armada() {
  const navigate = useNavigate();

  const [buses,      setBuses]      = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [page,       setPage]       = useState(1);
  const [deleting,   setDeleting]   = useState(null);
  const [error,      setError]      = useState('');

  // Fetch buses
  useEffect(() => {
    setError('');
    fetch(`${API_PUB}/buses.php`)
      .then(r => {
        if (!r.ok) throw new Error('Gagal memuat data bus dari server.');
        return r.json();
      })
      .then(d => {
        const list = d.data || [];
        setBuses(list);
        setFiltered(list);
      })
      .catch((err) => {
        setError(err.message || 'Tidak dapat terhubung ke server.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter & search
  useEffect(() => {
    let result = [...buses];
    if (filterTipe) result = result.filter(b => b.tipe === filterTipe);
    if (search)     result = result.filter(b =>
      b.nama_bus.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, filterTipe, buses]);

  // Pagination
  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Delete
  const handleHapus = async (id, nama) => {
    if (!window.confirm(`Hapus bus "${nama}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_ADM}/hapus_armada.php?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      const data = await res.json();
      if (data.status === 'success') {
        const updated = buses.filter(b => b.id !== id);
        setBuses(updated);
      } else {
        alert(data.message || 'Gagal menghapus.');
      }
    } catch {
      alert('Gagal menghapus. Coba lagi.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Kelola Armada" subtitle="Kelola data bus dan ketersediaan armada Anda" />

      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        <div
          className="bg-surface-container-lowest rounded-[24px] p-unit-lg"
          style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}
        >
          {error && (
            <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}


          {/* ── Toolbar ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-unit-lg gap-4">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter Tipe */}
              <div className="relative">
                <select
                  value={filterTipe}
                  onChange={e => setFilterTipe(e.target.value)}
                  className="appearance-none bg-surface-container-low border border-outline-variant
                             px-4 py-2.5 pr-10 rounded-xl text-body-md font-medium text-on-surface-variant
                             focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': 'rgba(53,37,205,0.2)' }}
                >
                  <option value="">Semua Tipe Bus</option>
                  <option value="big_bus">Executive Class</option>
                  <option value="medium_bus">VIP Class</option>
                  <option value="elf">Standard Class</option>
                  <option value="hiace">Microbus</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2
                                 pointer-events-none text-outline" style={{ fontSize: '20px' }}>
                  expand_more
                </span>
              </div>

              {/* Search */}
              <div
                className="flex items-center gap-2 bg-surface-container px-4 py-2.5 rounded-xl
                           border border-transparent transition-all"
                style={{ minWidth: '220px' }}
              >
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari armada..."
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-body-md
                             text-on-surface w-full"
                  style={{ fontSize: '14px' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-outline hover:text-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>

              {/* Result count */}
              {!loading && (
                <span className="text-outline" style={{ fontSize: '13px' }}>
                  {filtered.length} armada
                </span>
              )}
            </div>

            {/* Tambah Button */}
            <button
              onClick={() => navigate('/armada/tambah')}
              className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl
                         transition-all hover:scale-[1.02] active:scale-95 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
                fontSize: '14px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
              Tambah Armada
            </button>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="border-b border-surface-container-high">
                  {['Armada', 'Tipe', 'Kapasitas', 'Harga (Sewa/Hari)', 'Diskon', 'Status', 'Aksi'].map(h => (
                    <th key={h}
                      className="pb-4 text-outline uppercase tracking-wider"
                      style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.05em' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-container">
                {/* Loading skeleton */}
                {loading && [1,2,3,4].map(i => (
                  <tr key={i}>
                    <td className="py-4" colSpan={6}>
                      <div className="h-14 bg-surface-container rounded-2xl animate-pulse" />
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline-variant"
                            style={{ fontSize: '40px' }}>directions_bus</span>
                        </div>
                        <p className="font-semibold text-on-surface" style={{ fontSize: '15px' }}>
                          {search || filterTipe ? 'Tidak ada hasil' : 'Belum ada armada'}
                        </p>
                        {(search || filterTipe) && (
                          <button
                            onClick={() => { setSearch(''); setFilterTipe(''); }}
                            className="text-primary underline"
                            style={{ fontSize: '13px' }}
                          >
                            Reset filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!loading && paginated.map(bus => {
                  const tipe   = getTipeConfig(bus.tipe);
                  const status = getStatusConfig('available'); // default available

                  return (
                    <tr
                      key={bus.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      {/* Armada */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-4">
                          {/* Gambar landscape */}
                          <div
                            className="shrink-0 rounded-2xl overflow-hidden bg-surface-dim w-24 h-16 min-w-[96px]"
                          >
                            <img
                              src={
                                (bus.gambar_utama || bus.gambar)
                                  ? ((bus.gambar_utama || bus.gambar).startsWith('http')
                                    ? (bus.gambar_utama || bus.gambar)
                                    : `${API_BASE}${bus.gambar_utama || bus.gambar}`)
                                  : ''
                              }
                              alt={bus.nama_bus}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/96x64/e4e1ee/777587?text=Bus';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-on-surface flex items-center gap-2" style={{ fontSize: '15px' }}>
                              {bus.nama_bus}
                              {bus.images && bus.images.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold text-[10px]" style={{ backgroundColor: 'rgba(53,37,205,0.08)', color: '#3525cd' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '10.5px', verticalAlign: 'middle' }}>image</span>
                                  {bus.images.length}
                                </span>
                              )}
                            </p>
                            <p className="text-outline mt-0.5" style={{ fontSize: '12px' }}>
                              {bus.tipe?.replace('_', ' ').toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tipe */}
                      <td className="py-4 pr-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: tipe.bg, color: tipe.color }}
                        >
                          {tipe.label}
                        </span>
                      </td>

                      {/* Kapasitas */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1 text-on-surface-variant"
                          style={{ fontSize: '14px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                            airline_seat_recline_normal
                          </span>
                          {bus.kapasitas} Seats
                        </div>
                      </td>

                      {/* Harga */}
                      <td className="py-4 pr-4 font-semibold text-on-surface" style={{ fontSize: '14px' }}>
                        {formatRp(bus.harga_sewa)}
                      </td>

                      {/* Diskon */}
                      <td className="py-4 pr-4">
                        {bus.diskon ? (
                          <span className="px-2.5 py-1 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded-lg text-xs font-bold">
                            {bus.diskon}
                          </span>
                        ) : (
                          <span className="text-outline text-xs">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 pr-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-4 whitespace-nowrap text-right w-[240px]">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/armada/${bus.id}/images`)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[14px] transition-all hover:scale-105 text-left border border-primary/10"
                            style={{
                              background: 'rgba(53,37,205,0.06)',
                              color: '#3525cd',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(53,37,205,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(53,37,205,0.06)'}
                            title="Kelola foto eksterior, interior, kursi, dan fasilitas bus"
                          >
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>
                              photo_library
                            </span>
                            <div className="flex flex-col text-left leading-tight">
                              <span className="font-bold text-[11.5px] whitespace-nowrap">Kelola Foto Bus</span>
                              <span className="text-[9.5px] text-outline opacity-80 whitespace-nowrap">
                                {bus.images && bus.images.length > 0 ? `${bus.images.length} Foto` : '0 Foto'}
                              </span>
                            </div>
                          </button>
                          <button
                            onClick={() => navigate(`/armada/edit/${bus.id}`)}
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
                            onClick={() => handleHapus(bus.id, bus.nama_bus)}
                            disabled={deleting === bus.id}
                            className="w-10 h-10 inline-flex items-center justify-center rounded-[14px] transition-all hover:scale-105 disabled:opacity-50"
                            style={{
                              background: 'rgba(186,26,26,0.08)',
                              color: '#ba1a1a',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(186,26,26,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(186,26,26,0.08)'}
                            title="Hapus"
                          >
                            {deleting === bus.id ? (
                              <span className="w-5 h-5 border-2 border-error border-t-transparent
                                               rounded-full animate-spin inline-block" />
                            ) : (
                              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                delete
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="mt-unit-lg flex items-center justify-between border-t border-surface-container pt-unit-md">
              <p className="text-outline" style={{ fontSize: '12px', fontWeight: '500' }}>
                Menampilkan {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} armada
              </p>

              <div className="flex gap-2">
                {/* Prev */}
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low
                             transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-on-surface-variant"
                    style={{ fontSize: '20px' }}>chevron_left</span>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === '...' ? (
                      <span key={`dot-${i}`} className="px-3 py-2 text-outline"
                        style={{ fontSize: '13px' }}>…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className="px-4 py-2 rounded-lg font-semibold transition-colors"
                        style={{
                          fontSize: '12px',
                          background: page === n ? '#4f46e5' : 'transparent',
                          color:      page === n ? '#ffffff' : '#464555',
                          border:     page === n ? 'none' : '1px solid #c7c4d8',
                        }}
                      >
                        {n}
                      </button>
                    )
                  )
                }

                {/* Next */}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low
                             transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-on-surface-variant"
                    style={{ fontSize: '20px' }}>chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* Single page info */}
          {!loading && totalPages <= 1 && filtered.length > 0 && (
            <div className="mt-unit-lg border-t border-surface-container pt-unit-md">
              <p className="text-outline" style={{ fontSize: '12px', fontWeight: '500' }}>
                Menampilkan {filtered.length} armada
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM, API_BASE } from '../config/api';

const ITEMS_PER_PAGE = 5;

// ─── Badge config per tipe ────────────────────────────────────────────────────
const TIPE_CONFIG = {
  big_bus:    { label: 'Big Bus',    bg: '#e0e7ff', color: '#4338ca' },
  medium_bus: { label: 'Medium Bus', bg: '#dbeafe', color: '#1d4ed8' },
  elf:        { label: 'Elf',        bg: '#f1f5f9', color: '#475569' },
  hiace:      { label: 'HiAce',      bg: '#fef3c7', color: '#d97706' },
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

// ─── Category Slider Component ────────────────────────────────────────────────
const CategorySlider = ({
  catKey,
  busesInCat,
  catConfig,
  navigate,
  deleting,
  handleHapus,
  getStatusConfig,
  API_BASE,
  formatRp
}) => {
  const containerRef = React.useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-blue-600 rounded-full"></span>
          <h3 className="text-base font-extrabold text-zinc-855">
            {catConfig.label}
          </h3>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100/50">
            {busesInCat.length} Unit
          </span>
        </div>

        {/* Navigation Buttons (only if multiple items) */}
        {busesInCat.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Slide Kiri"
            >
              <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Slide Kanan"
            >
              <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Scroll Slide Track */}
      <div
        ref={containerRef}
        className="flex flex-nowrap gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scroll-smooth"
      >
        {busesInCat.map(bus => {
          const status = getStatusConfig('available');

          return (
            <div
              key={bus.id}
              className="w-80 shrink-0 bg-white border border-zinc-200/70 rounded-[20px] overflow-hidden snap-start flex flex-col shadow-sm hover:shadow-md transition-all duration-350"
            >
              {/* Image Cover Container */}
              <div className="aspect-[16/10] overflow-hidden bg-zinc-50 relative border-b border-zinc-100">
                <img
                  src={
                    (bus.gambar_utama || bus.gambar)
                      ? ((bus.gambar_utama || bus.gambar).startsWith('http')
                        ? (bus.gambar_utama || bus.gambar)
                        : `${API_BASE}${bus.gambar_utama || bus.gambar}`)
                      : ''
                  }
                  alt={bus.nama_bus}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/320x200/f1f5f9/94a3b8?text=Bus';
                  }}
                />
                {/* Badges on Cover Image */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-blue-600 shadow-sm border border-zinc-100/50">
                    {bus.kapasitas} Seats
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-sm">
                    Available
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-zinc-800 text-base leading-snug truncate" title={bus.nama_bus}>
                    {bus.nama_bus}
                  </h4>
                  <p className="text-zinc-400 text-[11px] mt-1 font-semibold">
                    {catConfig.label}
                  </p>

                  {/* Rental Price */}
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-base font-black text-blue-600">{formatRp(bus.harga_sewa)}</span>
                    <span className="text-[10px] text-zinc-400 font-bold">/ hari</span>
                  </div>

                  {/* Discount Badge */}
                  {bus.diskon ? (
                    <div className="mt-2">
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100/60">
                        {bus.diskon}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 h-5"></div>
                  )}
                </div>

                {/* Card Control Buttons */}
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                  {/* Manage Photos Button */}
                  <button
                    onClick={() => navigate(`/armada/${bus.id}/images`)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100/80 border border-blue-100/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    title="Kelola foto eksterior, interior, kursi, dan fasilitas bus"
                  >
                    <span className="material-symbols-outlined text-sm">photo_library</span>
                    <span>Foto ({bus.images ? bus.images.length : 0})</span>
                  </button>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => navigate(`/armada/edit/${bus.id}`)}
                      className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-zinc-955 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleHapus(bus.id, bus.nama_bus)}
                      disabled={deleting === bus.id}
                      className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-red-650 hover:bg-red-100 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 shadow-sm"
                      title="Hapus"
                    >
                      {deleting === bus.id ? (
                        <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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

  const categoriesList = [
    { value: '', label: 'Semua Tipe' },
    { value: 'big_bus', label: 'Big Bus' },
    { value: 'medium_bus', label: 'Medium Bus' },
    { value: 'elf', label: 'Elf' },
    { value: 'hiace', label: 'HiAce' }
  ];

  const getCategoryCount = (value) => {
    let list = buses;
    if (search) {
      list = list.filter(b => b.nama_bus.toLowerCase().includes(search.toLowerCase()));
    }
    if (value) {
      list = list.filter(b => b.tipe === value);
    }
    return list.length;
  };

  if (loading) {
    return (
      <main className="flex-1">
        <PageHeader title="Kelola Armada" subtitle="Kelola data bus dan ketersediaan armada Anda" />
        <div className="px-4 lg:px-8 pb-24 lg:pb-12">
          <div className="bg-white border border-zinc-200/60 rounded-[24px] p-6 animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="h-10 bg-slate-100 rounded-full w-2/3"></div>
              <div className="h-10 bg-slate-100 rounded-xl w-32"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/4"></div>
              <div className="flex gap-6 overflow-hidden">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-80 h-96 bg-slate-100 rounded-[20px] shrink-0"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Group filtered buses by category
  const categorizedBuses = {};
  filtered.forEach(bus => {
    const cat = bus.tipe || 'other';
    if (!categorizedBuses[cat]) categorizedBuses[cat] = [];
    categorizedBuses[cat].push(bus);
  });

  const categoryOrder = ['big_bus', 'medium_bus', 'elf', 'hiace'];
  const sortedCategories = Object.keys(categorizedBuses)
    .filter(cat => !filterTipe || cat === filterTipe)
    .sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

  return (
    <main className="flex-1">
      <PageHeader title="Kelola Armada" subtitle="Kelola data bus dan ketersediaan armada Anda" />

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

          {/* ── Toolbar ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-zinc-100">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              {/* Category Pills (Task 11) */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {categoriesList.map(cat => {
                  const count = getCategoryCount(cat.value);
                  const isActive = filterTipe === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setFilterTipe(cat.value)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-800'
                      }`}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div
                className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl
                           transition-all max-w-xs w-full"
              >
                <span className="material-symbols-outlined text-zinc-400" style={{ fontSize: '20px' }}>
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama bus..."
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-zinc-700 w-full placeholder-zinc-400 font-medium"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-blue-600">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tambah Button */}
            <button
              onClick={() => navigate('/armada/tambah')}
              className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl
                         transition-all hover:scale-[1.02] active:scale-95 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm text-xs cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Armada
            </button>
          </div>

          {/* ── Grouped Slide Content ── */}
          <div className="space-y-12">
            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-zinc-400"
                      style={{ fontSize: '40px' }}>directions_bus</span>
                  </div>
                  <p className="font-semibold text-zinc-700" style={{ fontSize: '15px' }}>
                    {search || filterTipe ? 'Tidak ada hasil pencarian' : 'Belum ada armada bus'}
                  </p>
                  {(search || filterTipe) && (
                    <button
                      onClick={() => { setSearch(''); setFilterTipe(''); }}
                      className="text-blue-600 underline font-semibold text-xs cursor-pointer"
                    >
                      Reset filter
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Render Category Snap-Sliders */}
            {filtered.length > 0 && sortedCategories.map(catKey => {
              const busesInCat = categorizedBuses[catKey] || [];
              if (busesInCat.length === 0) return null;
              const catConfig = getTipeConfig(catKey);

              return (
                <CategorySlider
                  key={catKey}
                  catKey={catKey}
                  busesInCat={busesInCat}
                  catConfig={catConfig}
                  navigate={navigate}
                  deleting={deleting}
                  handleHapus={handleHapus}
                  getStatusConfig={getStatusConfig}
                  API_BASE={API_BASE}
                  formatRp={formatRp}
                />
              );
            })}
          </div>

        </div>
      </div>
    </main>
  );
}

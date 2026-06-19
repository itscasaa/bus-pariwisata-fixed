import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_ADM, API_BASE } from '../config/api';

const inputCls = "w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all";

const formatCategoryLabel = (kategori) => {
  if (!kategori || kategori.trim() === '') return 'Lainnya';
  if (kategori.toLowerCase().startsWith('paket')) return kategori;
  return `Paket ${kategori}`;
};

// ─── Category Slider Component (Desktop) ──────────────────────────────────────
const CategorySlider = ({
  catName,
  items,
  navigate,
  deleting,
  handleHapus,
  API_BASE
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
      {/* Category Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-blue-600 rounded-full"></span>
          <h3 className="text-base font-extrabold text-zinc-800">
            {catName}
          </h3>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100/50">
            {items.length} Paket
          </span>
        </div>

        {/* Navigation Buttons */}
        {items.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm active:scale-95 border-none"
              title="Slide Kiri"
            >
              <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm active:scale-95 border-none"
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
        {items.map(item => (
          <div
            key={item.id}
            className="w-80 shrink-0 bg-white border border-zinc-200/70 rounded-[20px] overflow-hidden snap-start flex flex-col shadow-sm hover:shadow-md transition-all duration-350"
          >
            {/* Image Cover Container */}
            <div className="aspect-[16/10] overflow-hidden bg-zinc-50 relative border-b border-zinc-100">
              <img
                src={
                  item.gambar
                    ? (item.gambar.startsWith('http') ? item.gambar : `${API_BASE}${item.gambar}`)
                    : ''
                }
                alt={item.judul}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/320x200/f1f5f9/94a3b8?text=Wisata';
                }}
              />
              {/* Badges on Cover Image */}
              <div className="absolute top-3 left-3">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border shadow-sm"
                  style={item.status === 'aktif'
                    ? { background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }
                    : { background: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' }}
                >
                  {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-[#ffd23f] text-[#10233f] border border-[#f6b800]/50 shadow-sm uppercase tracking-wider">
                  {item.badge || 'PROMO'}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-zinc-800 text-base leading-snug truncate" title={item.judul}>
                  {item.judul}
                </h4>
                {item.durasi && (
                  <p className="text-zinc-400 text-[11px] mt-1 font-semibold">
                    Durasi: {item.durasi}
                  </p>
                )}
                <p className="text-zinc-500 text-xs leading-normal mt-2 line-clamp-2 font-medium" title={item.deskripsi}>
                  {item.deskripsi || 'Tidak ada deskripsi'}
                </p>
              </div>

              {/* Card Control Buttons */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => navigate(`/wisata/edit/${item.id}`)}
                  className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-zinc-955 transition-all flex items-center justify-center cursor-pointer shadow-sm border-none"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleHapus(item.id, item.judul)}
                  disabled={deleting === item.id}
                  className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-red-650 hover:bg-red-100 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 shadow-sm border-none"
                  title="Hapus"
                >
                  {deleting === item.id ? (
                    <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Wisata() {
  const navigate = useNavigate();
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error,    setError]    = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    setError('');
    const url = `${API_ADM}/discount.php`;
    const token = localStorage.getItem('admin_token');
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async r => {
        if (!r.ok) {
          throw new Error(`Gagal memuat paket wisata dari server (Status: ${r.status}).`);
        }
        return r.json();
      })
      .then(d => {
        setList(d.data || []);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message || 'Tidak dapat terhubung ke server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHapus = async (id, judul) => {
    if (!window.confirm(`Hapus paket wisata "${judul}"?`)) return;
    setDeleting(id);
    try {
      const res  = await fetch(`${API_ADM}/discount.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ action: 'hapus', id }),
      });
      const data = await res.json();
      if (data.status === 'success') setList(prev => prev.filter(p => p.id !== id));
      else alert(data.message || 'Gagal menghapus.');
    } catch { alert('Tidak dapat terhubung.'); }
    finally { setDeleting(null); }
  };

  // Group by category for desktop sliders
  const categorized = {};
  list.forEach(item => {
    const cat = formatCategoryLabel(item.kategori);
    if (!categorized[cat]) categorized[cat] = [];
    categorized[cat].push(item);
  });

  const categoryOrder = [
    'Paket 1 Hari',
    'Paket 2 Hari',
    'Paket 3 Hari',
    'Paket 4 Hari',
    'Paket 5 Hari',
    'Paket 10 Hari',
    'Lainnya'
  ];

  const sortedCategories = categoryOrder.filter(cat => categorized[cat] && categorized[cat].length > 0);
  Object.keys(categorized).forEach(cat => {
    if (!sortedCategories.includes(cat) && categorized[cat].length > 0) {
      sortedCategories.push(cat);
    }
  });

  return (
    <main className="flex-1">
      <PageHeader title="Kelola Wisata" subtitle="Manajemen paket wisata & promo" />
      
      <div className="px-4 lg:px-8 pb-24 lg:pb-12">
        <div 
          className="bg-white border border-zinc-200/60 rounded-[24px] p-6"
          style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.01)' }}
        >
          {error && (
            <div className="bg-[#ffdad6] text-[#ba1a1a] text-xs px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-extrabold text-zinc-800">Daftar Wisata / Promo</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{list.length} paket wisata</p>
            </div>
            <div>
              <button
                onClick={() => navigate('/wisata/tambah')}
                className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 bg-blue-600 hover:bg-blue-700 shadow-sm text-xs cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Tambah Wisata
              </button>
            </div>
          </div>

          {/* Desktop Category Sliders View */}
          <div className="hidden sm:block space-y-12">
            {loading && (
              <div className="flex justify-center py-20">
                <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!loading && sortedCategories.length === 0 && (
              <div className="py-16 text-center text-zinc-450 text-xs font-semibold">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-zinc-50 border border-zinc-200/50 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-zinc-400" style={{ fontSize: '32px' }}>map</span>
                  </div>
                  <p>Belum ada paket wisata / promo</p>
                </div>
              </div>
            )}
            {!loading && sortedCategories.map(cat => (
              <CategorySlider
                key={cat}
                catName={cat}
                items={categorized[cat]}
                navigate={navigate}
                deleting={deleting}
                handleHapus={handleHapus}
                API_BASE={API_BASE}
              />
            ))}
          </div>

          {/* Mobile Card List View */}
          <div className="block sm:hidden space-y-4">
            {loading ? (
              <div className="text-center py-10">
                <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block" />
              </div>
            ) : list.length === 0 ? (
              <div className="text-center py-10 text-zinc-450 text-xs font-semibold">
                Belum ada paket wisata / promo
              </div>
            ) : (
              <>
                {list.slice(0, visibleCount).map(item => (
                  <div key={item.id} className="bg-zinc-50 border border-zinc-200/60 rounded-[20px] p-5 shadow-sm space-y-4">
                    {/* Cover image & badge */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-150 border border-zinc-200/50">
                      <img
                        src={
                          item.gambar
                            ? (item.gambar.startsWith('http') ? item.gambar : `${API_BASE}${item.gambar}`)
                            : ''
                        }
                        alt={item.judul}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://placehold.co/320x200/f1f5f9/94a3b8?text=Wisata'; }}
                      />
                      {/* Status Tag */}
                      <div className="absolute top-3 left-3">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border shadow-sm"
                          style={item.status === 'aktif'
                            ? { background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }
                            : { background: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' }}
                        >
                          {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      {/* Tag Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-[#ffd23f] text-[#10233f] border border-[#f6b800]/50 shadow-sm uppercase tracking-wider">
                          {item.badge || 'PROMO'}
                        </span>
                      </div>
                    </div>

                    {/* Card Title & Desc */}
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-zinc-850 text-sm leading-snug">
                        {item.judul}
                      </h4>
                      {item.durasi && (
                        <p className="text-zinc-400 text-[10px] font-semibold">
                          Durasi: {item.durasi}
                        </p>
                      )}
                      <p className="text-zinc-500 text-xs leading-normal line-clamp-2">
                        {item.deskripsi || 'Tidak ada deskripsi'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-3 border-t border-zinc-200/60">
                      <button
                        onClick={() => navigate(`/wisata/edit/${item.id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100/30 text-xs font-bold transition-all cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleHapus(item.id, item.judul)}
                        disabled={deleting === item.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 text-red-650 hover:bg-red-100 border border-red-100/30 text-xs font-bold transition-all cursor-pointer border-none disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}

                {list.length > visibleCount && (
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

// ─── Shared Form ──────────────────────────────────────────────────────────────
function WisataForm({ title, onSubmit, loading, error, onBack, initial }) {
  const [form, setForm] = useState(initial || {
    judul: '', badge: '', kategori: 'Paket 1 Hari', durasi: '', deskripsi: '', gambar: '', status: 'aktif', urutan: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => { 
    if (initial) {
      setForm({
        ...initial,
        kategori: initial.kategori || 'Paket 1 Hari',
        durasi: initial.durasi || ''
      }); 
    }
  }, [initial]);

  const s = k => e => setForm({ ...form, [k]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-zinc-400 hover:text-blue-600 mb-5 transition-colors font-bold border-none bg-transparent cursor-pointer"
        style={{ fontSize: '12px' }}>
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Kembali
      </button>

      <div className="bg-white border border-zinc-200/60 rounded-[24px] p-6 max-w-2xl"
        style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.01)' }}>
        <h3 className="text-base font-extrabold text-zinc-800 mb-6">{title}</h3>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-xs bg-[#ffdad6] text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); onSubmit(form, selectedFile); }} className="space-y-5 text-left">
          {/* Judul */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Nama Paket Wisata / Promo <span className="text-red-500">*</span>
            </label>
            <input value={form.judul} onChange={s('judul')} className={inputCls}
              placeholder="Contoh: Paket Wisata Jogja 3 Hari" required />
          </div>

          {/* Kategori Wisata */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Kategori Wisata <span className="text-red-500">*</span>
            </label>
            <select value={form.kategori} onChange={s('kategori')} className={inputCls}>
              <option value="Paket 1 Hari">Paket 1 Hari</option>
              <option value="Paket 2 Hari">Paket 2 Hari</option>
              <option value="Paket 3 Hari">Paket 3 Hari</option>
              <option value="Paket 4 Hari">Paket 4 Hari</option>
              <option value="Paket 5 Hari">Paket 5 Hari</option>
              <option value="Paket 10 Hari">Paket 10 Hari</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Durasi */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Durasi Perjalanan
            </label>
            <input value={form.durasi} onChange={s('durasi')} className={inputCls}
              placeholder="Contoh: 1 Hari, 2 Hari 1 Malam, dll." />
          </div>

          {/* Badge / Tag */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Tag Wisata / Badge <span className="text-red-500">*</span>
            </label>
            <input value={form.badge} onChange={s('badge')} className={inputCls}
              placeholder="Contoh: 3 HARI, HOT DEAL, PROMO, dll." required />
          </div>

          {/* Gambar */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Banner / Gambar Wisata <span className="text-red-500">*</span>
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} className={inputCls} required={!initial} />
            {previewUrl && (
              <div className="mt-3 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200" style={{ height: '120px', width: '200px' }}>
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            {!previewUrl && form.gambar && (
              <div className="mt-3 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200" style={{ height: '120px', width: '200px' }}>
                <img src={form.gambar.startsWith('http') ? form.gambar : `${API_BASE}${form.gambar}`} alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">Deskripsi / Detail &amp; Fasilitas Paket</label>
            <textarea value={form.deskripsi} onChange={s('deskripsi')}
              className={inputCls + ' resize-none'} rows={4}
              placeholder="Tuliskan detail itinerary, destinasi, dan fasilitas yang didapatkan..." />
          </div>

          {/* Status + Urutan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1.5 text-xs">Status</label>
              <select value={form.status} onChange={s('status')} className={inputCls}>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
                Urutan Tampil
              </label>
              <input type="number" value={form.urutan} onChange={s('urutan')} className={inputCls}
                placeholder="0 = otomatis" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3 border-t border-zinc-100">
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-70 bg-blue-600 hover:bg-blue-700 text-xs shadow-sm cursor-pointer border-none"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <span className="material-symbols-outlined text-[16px]">save</span>
              }
              Simpan Wisata
            </button>
            <button type="button" onClick={onBack}
              className="px-6 py-2.5 rounded-xl font-bold transition-colors bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs cursor-pointer border-none"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tambah Wisata ─────────────────────────────────────────────────────────────
export function TambahWisata() {
  const navigate = useNavigate();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form, file) => {
    setError(''); setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'tambah');
      formData.append('judul', form.judul);
      formData.append('kategori', form.kategori);
      formData.append('durasi', form.durasi);
      formData.append('badge', form.badge);
      formData.append('deskripsi', form.deskripsi);
      formData.append('gambar', form.gambar);
      formData.append('status', form.status);
      formData.append('urutan', form.urutan);
      if (file) {
        formData.append('gambar_file', file);
      }

      const res  = await fetch(`${API_ADM}/discount.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') navigate('/wisata');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Tambah Wisata" subtitle="Buat paket wisata baru" />
      <div className="px-4 lg:px-8 pb-24 lg:pb-12">
        <WisataForm title="Form Tambah Paket Wisata" onSubmit={handleSubmit}
          loading={loading} error={error} onBack={() => navigate('/wisata')} />
      </div>
    </main>
  );
}

// ─── Edit Wisata ───────────────────────────────────────────────────────────────
export function EditWisata() {
  const { id }                = useParams();
  const navigate              = useNavigate();
  const [initial, setInitial] = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_ADM}/discount.php`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
      .then(r => r.json())
      .then(d => {
        const item = (d.data || []).find(p => String(p.id) === String(id));
        if (item) setInitial(item);
      })
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (form, file) => {
    setError(''); setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'edit');
      formData.append('id', parseInt(id));
      formData.append('judul', form.judul);
      formData.append('kategori', form.kategori);
      formData.append('durasi', form.durasi);
      formData.append('badge', form.badge);
      formData.append('deskripsi', form.deskripsi);
      formData.append('gambar', form.gambar);
      formData.append('status', form.status);
      formData.append('urutan', form.urutan);
      if (file) {
        formData.append('gambar_file', file);
      }

      const res  = await fetch(`${API_ADM}/discount.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') navigate('/wisata');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Edit Wisata" subtitle="Perbarui data paket wisata" />
      <div className="px-4 lg:px-8 pb-24 lg:pb-12">
        {initial
          ? <WisataForm title="Form Edit Paket Wisata" onSubmit={handleSubmit}
              loading={loading} error={error} onBack={() => navigate('/wisata')} initial={initial} />
          : <div className="flex justify-center py-20">
              <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }
      </div>
    </main>
  );
}

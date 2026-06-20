import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM, API_BASE } from '../config/api';

const ITEMS_PER_PAGE = 6;
const inputCls = "w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function News() {
  const navigate = useNavigate();
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('');
  const [page,     setPage]     = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [error,    setError]    = useState('');

  useEffect(() => {
    setError('');
    fetch(`${API_PUB}/news.php`)
      .then(r => {
        if (!r.ok) throw new Error('Gagal memuat berita dari server.');
        return r.json();
      })
      .then(d => setList(d.data || []))
      .catch(err => setError(err.message || 'Tidak dapat terhubung ke server.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter & search
  const filtered = list.filter(n => {
    const matchSearch = !search || n.judul.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter
      || (filter === 'publish' && n.status === 'publish')
      || (filter === 'draft'   && n.status === 'draft');
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Hapus berita "${judul}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_ADM}/hapus_news.php?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setList(prev => prev.filter(n => n.id !== id));
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
      <PageHeader title="Kelola Berita" subtitle="Kelola konten berita dan promo terbaru Anda" />

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
              <h3 className="text-base font-extrabold text-zinc-800">Daftar Berita</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{filtered.length} artikel</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl transition-all max-w-xs w-full">
                <span className="material-symbols-outlined text-zinc-400" style={{ fontSize: '20px' }}>
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Cari artikel..."
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-zinc-700 w-full placeholder-zinc-400 font-medium"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-blue-600 bg-transparent border-none">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>

              {/* Filter Status */}
              <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
                <select
                  value={filter}
                  onChange={e => { setFilter(e.target.value); setPage(1); }}
                  className="appearance-none bg-transparent border-none pr-6 focus:ring-0 focus:outline-none text-xs text-zinc-750 font-medium cursor-pointer"
                >
                  <option value="">Semua Status</option>
                  <option value="publish">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 pointer-events-none text-zinc-400" style={{ fontSize: '18px' }}>
                  expand_more
                </span>
              </div>

              {/* Tambah Button */}
              <button
                onClick={() => navigate('/news/tambah')}
                className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 bg-blue-600 hover:bg-blue-700 shadow-sm text-xs cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Tambah Berita
              </button>
            </div>
          </div>

          {/* Desktop/Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100">
                  {['Berita', 'Kategori', 'Konten', 'Tanggal', 'Status', 'Aksi'].map(h => (
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
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400 text-xs font-semibold">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-450 text-xs font-semibold">
                      Tidak ada data berita
                    </td>
                  </tr>
                ) : (
                  paginated.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-50/30 transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-150 w-16 h-12">
                            <img
                              src={item.gambar ? (item.gambar.startsWith('http') ? item.gambar : `${API_BASE}${item.gambar}`) : ''}
                              alt={item.judul}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.src = 'https://placehold.co/96x64/e4e1ee/777587?text=News'; }}
                            />
                          </div>
                          <span className="font-bold text-zinc-800 text-sm leading-snug line-clamp-2">{item.judul}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100/50">
                          {item.kategori || 'Berita'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-zinc-500 text-xs line-clamp-2 max-w-[280px]">
                          {item.konten ? item.konten.replace(/<[^>]*>/g, '') : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-500 text-xs font-semibold whitespace-nowrap">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                          style={item.status === 'publish'
                            ? { background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }
                            : { background: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}
                        >
                          {item.status === 'publish' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center w-[100px]">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate(`/news/edit/${item.id}`)}
                            className="text-zinc-400 hover:text-blue-600 transition-all cursor-pointer bg-transparent border-none p-1"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            disabled={deleting === item.id}
                            className="text-zinc-400 hover:text-red-600 transition-all cursor-pointer bg-transparent border-none p-1 disabled:opacity-50"
                            title="Hapus"
                          >
                            {deleting === item.id ? (
                              <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block" />
                            ) : (
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block sm:hidden space-y-4">
            {loading ? (
              <div className="text-center py-10 text-zinc-400 text-xs font-semibold">
                Memuat data...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-zinc-450 text-xs font-semibold">
                Tidak ada data berita
              </div>
            ) : (
              paginated.map(item => (
                <div key={item.id} className="bg-zinc-50 border border-zinc-200/60 rounded-[20px] p-5 shadow-sm space-y-4">
                  {/* Header: Gambar, Title & Category */}
                  <div className="flex gap-3">
                    <div className="shrink-0 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-150 w-20 h-16">
                      <img
                        src={item.gambar ? (item.gambar.startsWith('http') ? item.gambar : `${API_BASE}${item.gambar}`) : ''}
                        alt={item.judul}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://placehold.co/96x64/e4e1ee/777587?text=News'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-100/50">
                          {item.kategori || 'Berita'}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold border"
                          style={item.status === 'publish'
                            ? { background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }
                            : { background: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}
                        >
                          {item.status === 'publish' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h4 className="font-bold text-zinc-800 text-sm leading-snug line-clamp-2">{item.judul}</h4>
                    </div>
                  </div>

                  {/* Content snippet & date */}
                  <div className="space-y-1.5">
                    <p className="text-zinc-500 text-xs line-clamp-2">
                      {item.konten ? item.konten.replace(/<[^>]*>/g, '') : ''}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      <span>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 pt-3 border-t border-zinc-200/60">
                    <button
                      onClick={() => navigate(`/news/edit/${item.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100/30 text-xs font-bold transition-all cursor-pointer border-none"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.judul)}
                      disabled={deleting === item.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 text-red-650 hover:bg-red-100 border border-red-100/30 text-xs font-bold transition-all cursor-pointer border-none disabled:opacity-50"
                    >
                      {deleting === item.id ? (
                        <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Hapus</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center sm:justify-between mt-6 pt-6 border-t border-zinc-100">
              <p className="text-zinc-400 text-xs hidden sm:block">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} articles
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 disabled:opacity-40 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                     key={n}
                     onClick={() => setPage(n)}
                     className={`w-8 h-8 flex items-center justify-center rounded-xl font-bold transition-all border ${
                       page === n 
                         ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                         : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 cursor-pointer'
                     }`}
                     style={{ fontSize: '11px' }}
                   >
                     {n}
                   </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 disabled:opacity-40 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

// ─── News Form Component ──────────────────────────────────────────────────────
function NewsForm({ title, onSubmit, loading, error, onBack, initial }) {
  const [form, setForm] = useState(
    initial || { judul: '', konten: '', gambar: '', status: 'publish' }
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => { if (initial) setForm(initial); }, [initial]);
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
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Judul <span className="text-red-500">*</span>
            </label>
            <input value={form.judul} onChange={s('judul')} className={inputCls}
              placeholder="Judul berita..." required />
          </div>
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Gambar Berita
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} className={inputCls} />
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
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">
              Konten <span className="text-red-500">*</span>
            </label>
            <textarea value={form.konten} onChange={s('konten')}
              className={inputCls + ' resize-none'} rows={8}
              placeholder="Tulis konten berita..." required />
          </div>
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5 text-xs">Status</label>
            <select value={form.status} onChange={s('status')} className={inputCls}>
              <option value="publish">Publish</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex gap-3 pt-3 border-t border-zinc-100">
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-70 bg-blue-600 hover:bg-blue-700 text-xs shadow-sm cursor-pointer border-none"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <span className="material-symbols-outlined text-[16px]">save</span>
              }
              Simpan Berita
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

// ─── Tambah News ─────────────────────────────────────────────────────────────
export function TambahNews() {
  const navigate = useNavigate();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form, file) => {
    setError(''); setLoading(true);
    try {
      const formData = new FormData();
      formData.append('judul', form.judul);
      formData.append('konten', form.konten);
      formData.append('gambar', form.gambar);
      formData.append('status', form.status);
      if (file) {
        formData.append('gambar_file', file);
      }

      const res  = await fetch(`${API_ADM}/tambah_news.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') navigate('/news');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Tambah Berita" subtitle="Buat artikel atau pengumuman baru" />
      <div className="px-4 lg:px-8 pb-24 lg:pb-12">
        <NewsForm title="Form Tambah Berita" onSubmit={handleSubmit}
          loading={loading} error={error} onBack={() => navigate('/news')} />
      </div>
    </main>
  );
}

// ─── Edit News ────────────────────────────────────────────────────────────────
export function EditNews() {
  const { id }                = useParams();
  const navigate              = useNavigate();
  const [initial, setInitial] = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_PUB}/news.php`)
      .then(r => r.json())
      .then(d => {
        const item = (d.data || []).find(n => String(n.id) === String(id));
        if (item) setInitial(item);
      })
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (form, file) => {
    setError(''); setLoading(true);
    try {
      const formData = new FormData();
      formData.append('judul', form.judul);
      formData.append('konten', form.konten);
      formData.append('gambar', form.gambar);
      formData.append('status', form.status);
      if (file) {
        formData.append('gambar_file', file);
      }

      const res  = await fetch(`${API_ADM}/edit_news.php?id=${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') navigate('/news');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Edit Berita" subtitle="Perbarui konten artikel" />
      <div className="px-4 lg:px-8 pb-24 lg:pb-12">
        {initial
          ? <NewsForm title="Form Edit Berita" onSubmit={handleSubmit}
              loading={loading} error={error} onBack={() => navigate('/news')} initial={initial} />
          : <div className="flex justify-center py-20">
               <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }
      </div>
    </main>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM, API_BASE } from '../config/api';

const ITEMS_PER_PAGE = 6;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = status === 'publish'
    ? { label: 'Published', bg: '#dcfce7', color: '#15803d' }
    : { label: 'Draft',     bg: '#fef3c7', color: '#b45309' };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
      style={{ fontSize: '11px', background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
};

// ─── News Card ────────────────────────────────────────────────────────────────
const NewsCard = ({ item, onEdit, onDelete, deleting }) => {
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  // Gambar: pakai gambar dari DB atau fallback gradient
  const imgSrc = item.gambar
    ? (item.gambar.startsWith('http') ? item.gambar : `${API_BASE}${item.gambar}`)
    : null;

  return (
    <article
      className="bg-white rounded-[24px] flex flex-col h-full transition-all duration-300"
      style={{ padding: '16px', boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0px 20px 40px rgba(0,0,0,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0px 10px 30px rgba(0,0,0,0.03)'; }}
    >
      {/* Thumbnail */}
      <div className="relative w-full rounded-[16px] overflow-hidden mb-4"
        style={{ aspectRatio: '16/10' }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.judul}
            className="w-full h-full object-cover"
            onError={e => { e.target.onerror = null; e.target.parentElement.innerHTML = FallbackThumb(item.status); }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e2dfff 0%, #c3c0ff 100%)' }}>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>
              newspaper
            </span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: '500', color: '#3525cd' }}>
          {item.kategori || 'Berita'}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-on-surface mb-2 leading-snug"
          style={{ fontSize: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.judul}
        </h3>
        <p className="text-outline mb-4"
          style={{ fontSize: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.konten ? item.konten.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : 'Tidak ada konten.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4"
        style={{ borderTop: '1px solid #f0ecf9' }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-outline" style={{ fontSize: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
            <span>{dateStr}</span>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item.id)}
            className="p-2.5 rounded-xl transition-all hover:scale-105"
            style={{ background: 'rgba(53,37,205,0.08)', color: '#3525cd' }}
            onMouseEnter={e => e.currentTarget.style.background = '#4f46e5' || (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(53,37,205,0.08)'; e.currentTarget.style.color = '#3525cd'; }}
            title="Edit"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
          </button>
          <button
            onClick={() => onDelete(item.id, item.judul)}
            disabled={deleting === item.id}
            className="p-2.5 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: 'rgba(186,26,26,0.08)', color: '#ba1a1a' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ba1a1a'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(186,26,26,0.08)'; e.currentTarget.style.color = '#ba1a1a'; }}
            title="Hapus"
          >
            {deleting === item.id
              ? <span className="w-5 h-5 border-2 border-error border-t-transparent rounded-full animate-spin inline-block" />
              : <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
            }
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Add New Card (dashed placeholder) ───────────────────────────────────────
const AddCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="rounded-[24px] flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-300"
    style={{
      padding: '16px',
      border: '2px dashed #c7c4d8',
      minHeight: '280px',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(53,37,205,0.5)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#c7c4d8'}
  >
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors"
      style={{ background: '#eae6f4' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(53,37,205,0.1)'}
    >
      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors"
        style={{ fontSize: '32px' }}>post_add</span>
    </div>
    <h4 className="font-bold text-on-surface mb-1" style={{ fontSize: '16px' }}>Buat Artikel Baru</h4>
    <p className="text-outline px-6" style={{ fontSize: '14px', lineHeight: '1.5' }}>
      Bagikan berita atau promo terbaru kepada pelanggan Anda
    </p>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 relative"
      style={{ background: '#f5f2ff' }}>
      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: '56px' }}>
        newspaper
      </span>
      <div className="absolute -right-1 -bottom-1 w-12 h-12 bg-white rounded-full flex items-center justify-center"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>info</span>
      </div>
    </div>
    <h3 className="font-bold text-on-surface mb-2" style={{ fontSize: '20px' }}>Belum Ada Berita</h3>
    <p className="text-outline mb-8 max-w-sm" style={{ fontSize: '14px', lineHeight: '1.6' }}>
      Mulai buat berita atau pengumuman pertama Anda untuk ditampilkan di website.
    </p>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
      style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3525cd 100%)', boxShadow: '0 4px 15px rgba(79,70,229,0.3)', fontSize: '14px' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
      Buat Berita Pertama
    </button>
  </div>
);

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-[24px] animate-pulse" style={{ padding: '16px', boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}>
    <div className="rounded-[16px] bg-surface-container mb-4" style={{ aspectRatio: '16/10' }} />
    <div className="h-4 bg-surface-container rounded-full mb-2 w-3/4" />
    <div className="h-4 bg-surface-container rounded-full mb-2 w-full" />
    <div className="h-4 bg-surface-container rounded-full mb-4 w-2/3" />
    <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid #f0ecf9' }}>
      <div className="h-4 bg-surface-container rounded-full w-24" />
      <div className="flex gap-2">
        <div className="w-10 h-10 bg-surface-container rounded-xl" />
        <div className="w-10 h-10 bg-surface-container rounded-xl" />
      </div>
    </div>
  </div>
);

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

      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[18px]">error</span> {error}
          </div>
        )}

        {/* ── Toolbar ── */}
        <section className="flex flex-wrap items-center justify-between gap-4 mb-unit-lg">
          <div className="flex gap-3 flex-wrap">
            {/* Filter Status */}
            <div className="relative">
              <select
                value={filter}
                onChange={e => { setFilter(e.target.value); setPage(1); }}
                className="appearance-none bg-white border-none pr-10 pl-4 py-2.5 rounded-xl
                           text-on-surface-variant cursor-pointer focus:outline-none"
                style={{ fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <option value="">Semua Status</option>
                <option value="publish">Published</option>
                <option value="draft">Draft</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2
                               pointer-events-none text-outline" style={{ fontSize: '20px' }}>
                expand_more
              </span>
            </div>

            {/* Search */}
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                style={{ fontSize: '20px' }}>search</span>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Cari artikel..."
                className="pl-10 pr-4 py-2.5 border-none rounded-xl focus:outline-none focus:ring-2"
                style={{
                  width: '240px',
                  fontSize: '14px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  '--tw-ring-color': 'rgba(53,37,205,0.2)',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                </button>
              )}
            </div>

            {/* Count */}
            {!loading && (
              <span className="flex items-center text-outline" style={{ fontSize: '13px' }}>
                {filtered.length} artikel
              </span>
            )}
          </div>

          {/* Tambah Button */}
          <button
            onClick={() => navigate('/news/tambah')}
            className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl
                       transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #3525cd 100%)',
              boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
              fontSize: '14px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
            Tambah Berita
          </button>
        </section>

        {/* ── Table ── */}
        <div className="bg-surface-container-lowest rounded-[24px] overflow-hidden"
          style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Berita', 'Kategori', 'Konten', 'Tanggal', 'Status', 'Aksi'].map(h => (
                    <th key={h} className={`px-unit-lg py-4 text-label-sm text-outline uppercase tracking-wider font-medium ${h === 'Aksi' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {loading && [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td className="px-unit-lg py-4" colSpan={6}>
                      <div className="h-14 bg-surface-container rounded-2xl animate-pulse" />
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-unit-lg py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: '40px' }}>newspaper</span>
                        </div>
                        <p className="font-semibold text-on-surface">Belum ada berita</p>
                        <button onClick={() => navigate('/news/tambah')}
                          className="px-5 py-2 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all">
                          Tambah Berita Pertama
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && paginated.map(item => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    {/* Berita */}
                    <td className="px-unit-lg py-4">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 rounded-2xl overflow-hidden bg-surface-dim w-24 h-16 min-w-[96px]">
                          <img
                            src={
                              item.gambar
                                ? (item.gambar.startsWith('http') ? item.gambar : `${API_BASE}${item.gambar}`)
                                : ''
                            }
                            alt={item.judul}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://placehold.co/96x64/e4e1ee/777587?text=News'; }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.judul}</p>
                        </div>
                      </div>
                    </td>
                    {/* Kategori */}
                    <td className="px-unit-lg py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: '#e2dfff', color: '#3323cc' }}>
                        {item.kategori || 'Berita'}
                      </span>
                    </td>
                    {/* Konten */}
                    <td className="px-unit-lg py-4">
                      <p className="text-on-surface-variant text-xs line-clamp-2 max-w-[320px]" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.konten ? item.konten.replace(/<[^>]*>/g, '') : ''}
                      </p>
                    </td>
                    {/* Tanggal */}
                    <td className="px-unit-lg py-4 text-outline text-xs whitespace-nowrap">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '-'}
                    </td>
                    {/* Status */}
                    <td className="px-unit-lg py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    {/* Aksi */}
                    <td className="px-unit-lg py-4 whitespace-nowrap text-center w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/news/edit/${item.id}`)}
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
                          onClick={() => handleDelete(item.id, item.judul)}
                          disabled={deleting === item.id}
                          className="w-10 h-10 inline-flex items-center justify-center rounded-[14px] transition-all hover:scale-105 disabled:opacity-50"
                          style={{
                            background: 'rgba(186,26,26,0.08)',
                            color: '#ba1a1a',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(186,26,26,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(186,26,26,0.08)'}
                          title="Hapus"
                        >
                          {deleting === item.id ? (
                            <span className="w-5 h-5 border-2 border-error border-t-transparent rounded-full animate-spin inline-block" />
                          ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                              delete
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-unit-lg">
            <p className="text-outline" style={{ fontSize: '14px' }}>
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} articles
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors disabled:opacity-40"
                style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: '#777587' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-all"
                  style={{
                    fontSize: '14px',
                    background: page === n ? '#3525cd' : '#fff',
                    color:      page === n ? '#fff'    : '#464555',
                    boxShadow:  page === n ? '0 4px 12px rgba(53,37,205,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors disabled:opacity-40"
                style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: '#777587' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// ─── TambahNews & EditNews (exported from same file) ─────────────────────────
const inputCls = "w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary";

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
        className="flex items-center gap-2 text-outline hover:text-primary mb-5 transition-colors"
        style={{ fontSize: '14px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        Kembali
      </button>

      <div className="bg-surface-container-lowest rounded-[24px] p-unit-lg max-w-2xl"
        style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}>
        <h3 className="text-headline-sm text-on-surface mb-6">{title}</h3>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
            style={{ background: '#ffdad6', color: '#ba1a1a', fontSize: '14px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
            {error}
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); onSubmit(form, selectedFile); }} className="space-y-4">
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
              Judul <span className="text-error">*</span>
            </label>
            <input value={form.judul} onChange={s('judul')} className={inputCls}
              placeholder="Judul berita..." required />
          </div>
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
              Gambar Berita
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} className={inputCls} />
            {previewUrl && (
              <div className="mt-3 rounded-xl overflow-hidden bg-surface-dim" style={{ height: '120px', width: '200px' }}>
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            {!previewUrl && form.gambar && (
              <div className="mt-3 rounded-xl overflow-hidden bg-surface-dim" style={{ height: '120px', width: '200px' }}>
                <img src={form.gambar.startsWith('http') ? form.gambar : `${API_BASE}${form.gambar}`} alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
              Konten <span className="text-error">*</span>
            </label>
            <textarea value={form.konten} onChange={s('konten')}
              className={inputCls + ' resize-none'} rows={8}
              placeholder="Tulis konten berita..." required />
          </div>
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
              Status
            </label>
            <div className="flex gap-4">
              {['publish', 'draft'].map(v => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={v}
                    checked={form.status === v} onChange={s('status')}
                    className="accent-primary" />
                  <span style={{ fontSize: '14px' }} className="capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl
                         transition-all disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #3525cd)', fontSize: '14px' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
              }
              Publish
            </button>
            <button type="button" onClick={onBack}
              className="px-6 py-2.5 rounded-xl font-semibold transition-colors"
              style={{ background: '#f0ecf9', color: '#1b1b24', fontSize: '14px' }}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
      <div className="px-unit-xl pb-unit-xl">
        <NewsForm title="Form Tambah Berita" onSubmit={handleSubmit}
          loading={loading} error={error} onBack={() => navigate('/news')} />
      </div>
    </main>
  );
}

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
      <div className="px-unit-xl pb-unit-xl">
        {initial
          ? <NewsForm title="Form Edit Berita" onSubmit={handleSubmit}
              loading={loading} error={error} onBack={() => navigate('/news')} initial={initial} />
          : <div className="flex justify-center py-20">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }
      </div>
    </main>
  );
}

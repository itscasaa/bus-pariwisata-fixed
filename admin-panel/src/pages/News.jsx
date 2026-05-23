import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const API = 'http://localhost/bus_pariwisata';
const inputCls = "w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary";

export default function News() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API}/api/news.php`).then(r => r.json()).then(d => setList(d.data || [])).catch(() => setList([])).finally(() => setLoading(false));
  }, []);
  const handleHapus = async (id) => {
    if (!confirm('Hapus berita ini?')) return;
    await fetch(`${API}/admin/api/hapus_news.php?id=${id}`);
    setList(list.filter(n => n.id !== id));
  };
  return (
    <main className="flex-1">
      <PageHeader title="Kelola Berita" subtitle="Manajemen berita dan informasi" />
      <div className="px-unit-xl pb-unit-xl">
        <div className="bg-surface-container-lowest rounded-[24px] card-shadow overflow-hidden">
          <div className="px-unit-lg py-6 flex items-center justify-between border-b border-outline-variant/30">
            <div>
              <h3 className="text-headline-sm text-on-surface">Daftar Berita</h3>
              <p className="text-body-md text-outline mt-0.5">{list.length} berita</p>
            </div>
            <button onClick={() => navigate('/news/tambah')}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-body-md hover:bg-secondary transition-colors">
              <span className="material-symbols-outlined text-[20px]">add_circle</span> Tambah Berita
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Judul','Status','Tanggal','Aksi'].map(h => (
                    <th key={h} className="px-unit-lg py-4 text-label-sm text-outline uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {loading ? <tr><td colSpan={4} className="px-unit-lg py-10 text-center text-outline">Memuat...</td></tr>
                : list.length === 0 ? (
                  <tr><td colSpan={4} className="px-unit-lg py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[40px] text-outline-variant">newspaper</span>
                      </div>
                      <p className="text-on-surface font-semibold">Belum ada berita</p>
                      <button onClick={() => navigate('/news/tambah')} className="px-5 py-2 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all">Buat Berita Pertama</button>
                    </div>
                  </td></tr>
                ) : list.map(n => (
                  <tr key={n.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-unit-lg py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px] text-outline">article</span>
                        </div>
                        <span className="font-semibold text-on-surface">{n.judul}</span>
                      </div>
                    </td>
                    <td className="px-unit-lg py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${n.status === 'publish' ? 'bg-green-100 text-green-700' : 'bg-surface-container-high text-outline'}`}>
                        {n.status === 'publish' ? 'Publish' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-unit-lg py-4 text-on-surface-variant text-sm">{new Date(n.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</td>
                    <td className="px-unit-lg py-4">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/news/edit/${n.id}`)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-bold hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-[15px]">edit</span> Edit
                        </button>
                        <button onClick={() => handleHapus(n.id)}
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

function NewsForm({ title, onSubmit, loading, error, onBack, initial }) {
  const [form, setForm] = useState(initial || { judul:'', konten:'', gambar:'', status:'publish' });
  useEffect(() => { if (initial) setForm(initial); }, [initial]);
  const s = k => e => setForm({ ...form, [k]: e.target.value });
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-outline hover:text-primary mb-5 transition-colors text-body-md">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Kembali
      </button>
      <div className="bg-surface-container-lowest rounded-[24px] card-shadow p-unit-lg max-w-2xl">
        <h3 className="text-headline-sm text-on-surface mb-6">{title}</h3>
        {error && <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">error</span>{error}</div>}
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div>
            <label className="block text-body-md font-semibold text-on-surface mb-1.5">Judul <span className="text-error">*</span></label>
            <input value={form.judul} onChange={s('judul')} className={inputCls} placeholder="Judul berita..." required />
          </div>
          <div>
            <label className="block text-body-md font-semibold text-on-surface mb-1.5">URL Gambar</label>
            <input value={form.gambar} onChange={s('gambar')} className={inputCls} placeholder="https://... atau kosongkan" />
          </div>
          <div>
            <label className="block text-body-md font-semibold text-on-surface mb-1.5">Konten <span className="text-error">*</span></label>
            <textarea value={form.konten} onChange={s('konten')} className={inputCls + ' resize-none'} rows={8} placeholder="Tulis konten berita..." required />
          </div>
          <div>
            <label className="block text-body-md font-semibold text-on-surface mb-1.5">Status</label>
            <div className="flex gap-4">
              {['publish','draft'].map(v => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={v} checked={form.status === v} onChange={s('status')} className="accent-primary" />
                  <span className="text-body-md capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-body-md hover:bg-secondary transition-colors disabled:opacity-70">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <span className="material-symbols-outlined text-[18px]">send</span>}
              Publish
            </button>
            <button type="button" onClick={onBack} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-xl font-semibold text-body-md hover:bg-surface-container-high transition-colors">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TambahNews() {
  const navigate = useNavigate();
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const handleSubmit = async (form) => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/admin/api/tambah_news.php`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.status === 'success') navigate('/news');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung.'); } finally { setLoading(false); }
  };
  return <main className="flex-1"><PageHeader title="Tambah Berita" /><div className="px-unit-xl pb-unit-xl"><NewsForm title="Form Tambah Berita" onSubmit={handleSubmit} loading={loading} error={error} onBack={() => navigate('/news')} /></div></main>;
}

export function EditNews() {
  const { id } = useParams(); const navigate = useNavigate();
  const [initial, setInitial] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(`${API}/api/news.php`).then(r => r.json()).then(d => {
      const item = (d.data || []).find(n => String(n.id) === String(id));
      if (item) setInitial(item);
    }).catch(() => {});
  }, [id]);
  const handleSubmit = async (form) => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/admin/api/edit_news.php?id=${id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.status === 'success') navigate('/news');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung.'); } finally { setLoading(false); }
  };
  return <main className="flex-1"><PageHeader title="Edit Berita" /><div className="px-unit-xl pb-unit-xl">{initial ? <NewsForm title="Form Edit Berita" onSubmit={handleSubmit} loading={loading} error={error} onBack={() => navigate('/news')} initial={initial} /> : <div className="flex justify-center py-20"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span></div>}</div></main>;
}

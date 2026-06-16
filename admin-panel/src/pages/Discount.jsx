import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM, API_BASE } from '../config/api';

const inputCls = "w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary";

// ─── List Page ────────────────────────────────────────────────────────────────
export default function Discount() {
  const navigate = useNavigate();
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error,    setError]    = useState('');

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
          throw new Error(`Gagal memuat discount dari server (Status: ${r.status}).`);
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
    if (!window.confirm(`Hapus discount "${judul}"?`)) return;
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

  return (
    <main className="flex-1">
      <PageHeader title="Kelola Discount" subtitle="Manajemen discount & promo" />
      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        <div className="bg-surface-container-lowest rounded-[24px] overflow-hidden"
          style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}>
          {error && (
            <div className="mx-unit-lg mt-5 bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="px-unit-lg py-6 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30">
            <div>
              <h3 className="text-headline-sm text-on-surface">Daftar Discount</h3>
              <p className="text-body-md text-outline mt-0.5">{list.length} discount</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('/discount/tambah')}
                className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#3525cd)', fontSize: '14px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                Tambah Discount
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Promo / Discount','Discount Tag','Deskripsi','Status','Aksi'].map(h => (
                    <th key={h} className={`px-unit-lg py-4 text-label-sm text-outline uppercase tracking-wider font-medium ${h === 'Aksi' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {loading && (
                  <tr><td colSpan={5} className="px-unit-lg py-10 text-center">
                    <div className="flex justify-center">
                      <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td></tr>
                )}
                {!loading && list.length === 0 && (
                  <tr><td colSpan={5} className="px-unit-lg py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: '40px' }}>percent</span>
                      </div>
                      <p className="font-semibold text-on-surface">Belum ada discount / promo</p>
                      <button onClick={() => navigate('/discount/tambah')}
                        className="px-5 py-2 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all">
                        Tambah Discount Pertama
                      </button>
                    </div>
                  </td></tr>
                )}
                {!loading && list.map(item => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    {/* Promo */}
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
                            onError={e => { e.target.src = 'https://placehold.co/96x64/e4e1ee/777587?text=Discount'; }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface" style={{ fontSize: '14px' }}>{item.judul}</p>
                        </div>
                      </div>
                    </td>
                    {/* Tag Diskon */}
                    <td className="px-unit-lg py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ffd23f] text-[#10233f]">
                        {item.badge || 'PROMO'}
                      </span>
                    </td>
                    {/* Deskripsi */}
                    <td className="px-unit-lg py-4 text-on-surface-variant text-body-md max-w-sm truncate" title={item.deskripsi}>
                      {item.deskripsi || '-'}
                    </td>
                    {/* Status */}
                    <td className="px-unit-lg py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold"
                        style={item.status === 'aktif'
                          ? { background: '#dcfce7', color: '#15803d' }
                          : { background: '#f3f4f6', color: '#6b7280' }}>
                        {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    {/* Aksi */}
                    <td className="px-unit-lg py-4 whitespace-nowrap text-center w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/discount/edit/${item.id}`)}
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
                          onClick={() => handleHapus(item.id, item.judul)}
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
      </div>
    </main>
  );
}

// ─── Shared Form ──────────────────────────────────────────────────────────────
function DiscountForm({ title, onSubmit, loading, error, onBack, initial }) {
  const [form, setForm] = useState(initial || {
    judul: '', badge: '', deskripsi: '', gambar: '', status: 'aktif', urutan: 0,
  });
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
          {/* Judul */}
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
              Nama Promo / Discount <span className="text-error">*</span>
            </label>
            <input value={form.judul} onChange={s('judul')} className={inputCls}
              placeholder="contoh: Diskon Rombongan Sekolah 10%" required />
          </div>

          {/* Badge / Discount Tag */}
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
              Discount Tag (Badge) <span className="text-error">*</span>
            </label>
            <input value={form.badge} onChange={s('badge')} className={inputCls}
              placeholder="contoh: 10% OFF, PROMO, dll." required />
          </div>

          {/* Gambar */}
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
              Banner / Gambar Promo <span className="text-error">*</span>
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} className={inputCls} required={!initial} />
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

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>Deskripsi / Syarat & Ketentuan</label>
            <textarea value={form.deskripsi} onChange={s('deskripsi')}
              className={inputCls + ' resize-none'} rows={4}
              placeholder="Tuliskan detail promo atau syarat & ketentuan..." />
          </div>

          {/* Status + Urutan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>Status</label>
              <select value={form.status} onChange={s('status')} className={inputCls}>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1.5" style={{ fontSize: '14px' }}>
                Urutan Tampil
              </label>
              <input type="number" value={form.urutan} onChange={s('urutan')} className={inputCls}
                placeholder="0 = otomatis" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#3525cd)', fontSize: '14px' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
              }
              Simpan Discount
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

// ─── Tambah Discount ─────────────────────────────────────────────────────────────
export function TambahDiscount() {
  const navigate = useNavigate();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form, file) => {
    setError(''); setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'tambah');
      formData.append('judul', form.judul);
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
      if (data.status === 'success') navigate('/discount');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Tambah Discount" subtitle="Buat promo / discount baru" />
      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        <DiscountForm title="Form Tambah Discount" onSubmit={handleSubmit}
          loading={loading} error={error} onBack={() => navigate('/discount')} />
      </div>
    </main>
  );
}

// ─── Edit Discount ───────────────────────────────────────────────────────────────
export function EditDiscount() {
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
      if (data.status === 'success') navigate('/discount');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Edit Discount" subtitle="Perbarui data promo / discount" />
      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        {initial
          ? <DiscountForm title="Form Edit Discount" onSubmit={handleSubmit}
              loading={loading} error={error} onBack={() => navigate('/discount')} initial={initial} />
          : <div className="flex justify-center py-20">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }
      </div>
    </main>
  );
}

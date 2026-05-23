import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const API = 'http://localhost/bus_pariwisata';
const inputCls = "w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary";

function HargaForm({ onSubmit, loading, error, onBack, title, initial }) {
  const [form, setForm] = useState(initial || { nama_destinasi:'', durasi:'', harga_hiace:0, harga_elf:0, harga_medium:0, harga_big:0 });
  useEffect(() => { if (initial) setForm(initial); }, [initial]);
  const s = k => e => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-outline hover:text-primary mb-5 transition-colors text-body-md">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Kembali
      </button>
      <div className="bg-surface-container-lowest rounded-[24px] card-shadow p-unit-lg max-w-xl">
        <h3 className="text-headline-sm text-on-surface mb-6">{title}</h3>
        {error && <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">error</span>{error}</div>}
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div>
            <label className="block text-body-md font-semibold text-on-surface mb-1.5">Nama Destinasi <span className="text-error">*</span></label>
            <input value={form.nama_destinasi} onChange={s('nama_destinasi')} className={inputCls} placeholder="contoh: BANDUNG KOTA, LEMBANG" required />
          </div>
          <div>
            <label className="block text-body-md font-semibold text-on-surface mb-1.5">Durasi <span className="text-error">*</span></label>
            <input value={form.durasi} onChange={s('durasi')} className={inputCls} placeholder="contoh: 12 Jam / 2 Hari" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['harga_hiace','HiAce'],['harga_elf','Elf'],['harga_medium','Medium Bus'],['harga_big','Big Bus']].map(([k,l]) => (
              <div key={k}>
                <label className="block text-body-md font-semibold text-on-surface mb-1.5">Harga {l} (Rp)</label>
                <input type="number" value={form[k]} onChange={s(k)} className={inputCls} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-body-md hover:bg-secondary transition-colors disabled:opacity-70">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <span className="material-symbols-outlined text-[18px]">save</span>}
              Simpan
            </button>
            <button type="button" onClick={onBack} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-xl font-semibold text-body-md hover:bg-surface-container-high transition-colors">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TambahHarga() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (form) => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/admin/api/tambah_harga.php`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.status === 'success') navigate('/price-list');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); } finally { setLoading(false); }
  };
  return <main className="flex-1"><PageHeader title="Tambah Harga" /><div className="px-unit-xl pb-unit-xl"><HargaForm title="Form Tambah Harga" onSubmit={handleSubmit} loading={loading} error={error} onBack={() => navigate('/price-list')} /></div></main>;
}

export function EditHarga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(`${API}/api/price_list.php`).then(r => r.json()).then(d => {
      const item = (d.data || []).find(p => String(p.id) === String(id));
      if (item) setInitial(item);
    });
  }, [id]);
  const handleSubmit = async (form) => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/admin/api/edit_harga.php?id=${id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.status === 'success') navigate('/price-list');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); } finally { setLoading(false); }
  };
  return <main className="flex-1"><PageHeader title="Edit Harga" /><div className="px-unit-xl pb-unit-xl">{initial ? <HargaForm title="Form Edit Harga" onSubmit={handleSubmit} loading={loading} error={error} onBack={() => navigate('/price-list')} initial={initial} /> : <div className="flex justify-center py-20"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span></div>}</div></main>;
}

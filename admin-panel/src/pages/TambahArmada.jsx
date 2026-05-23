// Placeholder pages - akan diisi sesuai kebutuhan
import React from 'react';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';

// ===== TAMBAH ARMADA =====
export function TambahArmada() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ nama_bus:'', tipe:'big_bus', kapasitas:'', harga_sewa:'', gambar_utama:'', deskripsi:'', fasilitas_json:'["Seat 3-2","2 Unit LCD TV","Dispenser","AC","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('http://localhost/bus_pariwisata/admin/api/tambah_armada.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.status === 'success') navigate('/armada');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex-1">
      <PageHeader title="Tambah Armada" subtitle="Tambah data bus baru" />
      <div className="px-unit-xl pb-unit-xl max-w-2xl">
        <FormCard title="Form Tambah Armada" onBack={() => navigate('/armada')} onSubmit={handleSubmit} error={error} loading={loading} submitLabel="Simpan Armada">
          <ArmadaFields form={form} setForm={setForm} />
        </FormCard>
      </div>
    </main>
  );
}

// ===== EDIT ARMADA =====
export function EditArmada() {
  const navigate = useNavigate();
  const id = window.location.pathname.split('/').pop();
  const [form, setForm] = React.useState(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetch(`http://localhost/bus_pariwisata/api/buses.php`)
      .then(r => r.json()).then(d => {
        const bus = (d.data || []).find(b => String(b.id) === String(id));
        if (bus) setForm({ nama_bus: bus.nama_bus, tipe: bus.tipe || 'big_bus', kapasitas: bus.kapasitas, harga_sewa: bus.harga_sewa, gambar_utama: bus.gambar_utama?.replace('http://localhost/bus_pariwisata/frontend/assets/images/', '') || '', deskripsi: bus.deskripsi || '', fasilitas_json: JSON.stringify(bus.fasilitas || []) });
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch(`http://localhost/bus_pariwisata/admin/api/edit_armada.php?id=${id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.status === 'success') navigate('/armada');
      else setError(data.message || 'Gagal menyimpan.');
    } catch { setError('Tidak dapat terhubung ke server.'); }
    finally { setLoading(false); }
  };

  if (!form) return <main className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></main>;

  return (
    <main className="flex-1">
      <PageHeader title="Edit Armada" subtitle="Perbarui data bus" />
      <div className="px-unit-xl pb-unit-xl max-w-2xl">
        <FormCard title="Form Edit Armada" onBack={() => navigate('/armada')} onSubmit={handleSubmit} error={error} loading={loading} submitLabel="Simpan Perubahan">
          <ArmadaFields form={form} setForm={setForm} />
        </FormCard>
      </div>
    </main>
  );
}

// ===== SHARED FORM COMPONENTS =====
function FormCard({ title, onBack, onSubmit, error, loading, submitLabel, children }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-outline hover:text-primary mb-5 transition-colors text-body-md">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Kembali
      </button>
      <div className="bg-surface-container-lowest rounded-[24px] card-shadow p-unit-lg">
        <h3 className="text-headline-sm text-on-surface mb-6">{title}</h3>
        {error && (
          <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[18px]">error</span> {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-body-md hover:bg-secondary transition-colors disabled:opacity-70">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                : <span className="material-symbols-outlined text-[18px]">save</span>}
              {submitLabel}
            </button>
            <button type="button" onClick={onBack} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-xl font-semibold text-body-md hover:bg-surface-container-high transition-colors">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-body-md font-semibold text-on-surface mb-1.5">{label}{required && <span className="text-error ml-1">*</span>}</label>
      {children}
      {hint && <p className="text-xs text-outline mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary";

function ArmadaFields({ form, setForm }) {
  const s = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nama Bus" required><input type="text" value={form.nama_bus} onChange={s('nama_bus')} className={inputCls} placeholder="contoh: Zahra Ayu" required /></Field>
        <Field label="Tipe">
          <select value={form.tipe} onChange={s('tipe')} className={inputCls}>
            <option value="big_bus">Big Bus</option>
            <option value="medium_bus">Medium Bus</option>
            <option value="elf">Elf</option>
            <option value="hiace">HiAce</option>
          </select>
        </Field>
        <Field label="Kapasitas (Kursi)" required><input type="number" value={form.kapasitas} onChange={s('kapasitas')} className={inputCls} placeholder="45" required /></Field>
        <Field label="Harga Sewa (Rp)" required><input type="number" value={form.harga_sewa} onChange={s('harga_sewa')} className={inputCls} placeholder="4500000" required /></Field>
      </div>
      <Field label="Path Gambar Utama" hint="Path relatif dari folder frontend/assets/images/">
        <input type="text" value={form.gambar_utama} onChange={s('gambar_utama')} className={inputCls} placeholder="bus1/bu1.jpeg" />
      </Field>
      <Field label="Deskripsi">
        <textarea value={form.deskripsi} onChange={s('deskripsi')} className={inputCls + ' resize-none'} rows={3} placeholder="Deskripsi singkat bus..." />
      </Field>
      <Field label="Fasilitas (JSON Array)">
        <textarea value={form.fasilitas_json} onChange={s('fasilitas_json')} className={inputCls + ' resize-none font-mono text-xs'} rows={3} />
      </Field>
    </>
  );
}

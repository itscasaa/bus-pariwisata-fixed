import React from 'react'; import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function Armada() {
  const navigate = useNavigate();
  const [buses, setBuses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost/bus_pariwisata/api/buses.php')
      .then(r => r.json()).then(d => setBuses(d.data || [])).finally(() => setLoading(false));
  }, []);

  const handleHapus = async (id, nama) => {
    if (!confirm(`Hapus bus "${nama}"?`)) return;
    await fetch(`http://localhost/bus_pariwisata/admin/api/hapus_armada.php?id=${id}`);
    setBuses(buses.filter(b => b.id !== id));
  };

  const formatRp = n => n ? 'Rp ' + new Intl.NumberFormat('id-ID').format(n) : '-';

  return (
    <main className="flex-1">
      <PageHeader title="Kelola Armada" subtitle="Manajemen data bus dan fasilitas" />
      <div className="px-unit-xl pb-unit-xl">
        <div className="bg-surface-container-lowest rounded-[24px] card-shadow overflow-hidden">
          <div className="px-unit-lg py-6 flex items-center justify-between border-b border-outline-variant/30">
            <div>
              <h3 className="text-headline-sm text-on-surface">Daftar Armada Bus</h3>
              <p className="text-body-md text-outline mt-0.5">{buses.length} bus terdaftar</p>
            </div>
            <button onClick={() => navigate('/armada/tambah')}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-body-md hover:bg-secondary transition-colors">
              <span className="material-symbols-outlined text-[20px]">add_circle</span> Tambah Armada
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Bus','Tipe','Kapasitas','Harga Sewa','Aksi'].map(h => (
                    <th key={h} className="px-unit-lg py-4 text-label-sm text-outline uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {loading ? <tr><td colSpan={5} className="px-unit-lg py-10 text-center text-outline">Memuat...</td></tr>
                : buses.map(bus => (
                  <tr key={bus.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-unit-lg py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-dim overflow-hidden shrink-0">
                          <img src={bus.gambar_utama || bus.gambar} alt={bus.nama_bus} className="w-full h-full object-cover" onError={e => e.target.src='https://placehold.co/40x40?text=Bus'} />
                        </div>
                        <span className="font-bold text-on-surface">{bus.nama_bus}</span>
                      </div>
                    </td>
                    <td className="px-unit-lg py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${bus.tipe === 'big_bus' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-fixed text-on-primary-fixed-variant'}`}>
                        {bus.tipe === 'big_bus' ? 'Big Bus' : 'Medium Bus'}
                      </span>
                    </td>
                    <td className="px-unit-lg py-4 text-on-surface-variant">{bus.kapasitas} Kursi</td>
                    <td className="px-unit-lg py-4 font-bold text-on-surface">{formatRp(bus.harga_sewa)}</td>
                    <td className="px-unit-lg py-4">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/armada/edit/${bus.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-bold hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                        </button>
                        <button onClick={() => handleHapus(bus.id, bus.nama_bus)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error-container text-on-error-container text-xs font-bold hover:opacity-80 transition-opacity">
                          <span className="material-symbols-outlined text-[16px]">delete</span> Hapus
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

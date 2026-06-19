import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_PUB, API_BASE } from '../config/api';

const ArmadaTable = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`${API_PUB}/buses.php`);
        const data = await response.json();
        
        if (data.status === 'success') {
          // Only show first 3 buses for dashboard
          setBuses(data.data.slice(0, 3));
        } else {
          setError(data.message || 'Gagal memuat data armada');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const formatRupiah = (num) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
  };

  const getBusTypeLabel = (type) => {
    const types = {
      'big_bus': 'Executive',
      'medium_bus': 'VIP Class',
      'elf': 'Standard',
      'hiace': 'Standard',
    };
    return types[type] || 'Standard';
  };

  const getBusTypeColor = (type) => {
    const colors = {
      'big_bus': 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      'medium_bus': 'bg-blue-50 text-blue-600 border border-blue-100',
      'elf': 'bg-slate-50 text-slate-600 border border-slate-150',
      'hiace': 'bg-slate-50 text-slate-600 border border-slate-150',
    };
    return colors[type] || 'bg-slate-50 text-slate-650 border border-slate-150';
  };

  if (loading) {
    return (
      <section className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-[24px] overflow-hidden" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}>
        <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-100">
          <h3 className="text-lg font-black text-zinc-800">Data Armada Bus</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-55 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-[24px] overflow-hidden" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}>
        <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-100">
          <h3 className="text-lg font-black text-zinc-800">Data Armada Bus</h3>
        </div>
        <div className="p-6 text-center text-red-500 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-[24px] overflow-hidden" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}>
      <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-100">
        <h3 className="text-lg font-black text-zinc-800">Data Armada Bus</h3>
        <button onClick={() => navigate('/armada')} className="text-blue-600 text-xs font-bold hover:underline cursor-pointer">
          Lihat Semua
        </button>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="hidden sm:block p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-6 py-4.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bus Name</th>
              <th className="px-6 py-4.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-4.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-10 rounded-xl bg-zinc-50 border border-zinc-150 overflow-hidden shrink-0">
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
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/56x48/f1f5f9/94a3b8?text=Bus';
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors">{bus.nama_bus}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-xs font-semibold">
                  {bus.kapasitas} Seats
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBusTypeColor(bus.tipe)}`}>
                    {getBusTypeLabel(bus.tipe)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-55 text-emerald-600 border border-emerald-100 text-[10px] font-bold">
                    Available
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List View (Simpler and cleaner layout) */}
      <div className="block sm:hidden divide-y divide-zinc-100 px-6 pb-4">
        {buses.map((bus) => (
          <div key={bus.id} className="py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-9 rounded-lg bg-zinc-50 border border-zinc-150 overflow-hidden shrink-0">
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
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/48x36/f1f5f9/94a3b8?text=Bus';
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800 line-clamp-1">{bus.nama_bus}</p>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  {getBusTypeLabel(bus.tipe)} • {bus.kapasitas} Seats
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px] font-bold shrink-0">
              Available
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArmadaTable;

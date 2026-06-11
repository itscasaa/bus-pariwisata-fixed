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
      'big_bus': 'bg-secondary-fixed text-on-secondary-fixed',
      'medium_bus': 'bg-primary-fixed-dim text-on-primary-fixed-variant',
      'elf': 'bg-surface-variant text-on-surface-variant',
      'hiace': 'bg-surface-variant text-on-surface-variant',
    };
    return colors[type] || 'bg-surface-variant text-on-surface-variant';
  };

  if (loading) {
    return (
      <section className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] custom-shadow overflow-hidden">
        <div className="px-unit-lg py-6 flex justify-between items-center border-b border-outline-variant/30">
          <h3 className="text-headline-sm text-on-surface">Data Armada Bus</h3>
        </div>
        <div className="p-unit-lg">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-container rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] custom-shadow overflow-hidden">
        <div className="px-unit-lg py-6 flex justify-between items-center border-b border-outline-variant/30">
          <h3 className="text-headline-sm text-on-surface">Data Armada Bus</h3>
        </div>
        <div className="p-unit-lg text-center text-error">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] custom-shadow overflow-hidden">
      <div className="px-unit-lg py-6 flex justify-between items-center border-b border-outline-variant/30">
        <h3 className="text-headline-sm text-on-surface">Data Armada Bus</h3>
        <button onClick={() => navigate('/armada')} className="text-primary text-body-md font-semibold hover:underline">
          Lihat Semua
        </button>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-unit-lg py-4 text-label-sm text-outline uppercase">Bus Name</th>
              <th className="px-unit-lg py-4 text-label-sm text-outline uppercase">Capacity</th>
              <th className="px-unit-lg py-4 text-label-sm text-outline uppercase">Type</th>
              <th className="px-unit-lg py-4 text-label-sm text-outline uppercase">Price</th>
              <th className="px-unit-lg py-4 text-label-sm text-outline uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-unit-lg py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-12 rounded-xl bg-surface-dim overflow-hidden shrink-0">
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
                          e.target.src = 'https://placehold.co/56x48/e4e1ee/777587?text=Bus';
                        }}
                      />
                    </div>
                    <span className="text-body-lg font-bold text-on-surface leading-tight">{bus.nama_bus}</span>
                  </div>
                </td>
                <td className="px-unit-lg py-5 text-on-surface-variant text-body-md">
                  {bus.kapasitas} Seats
                </td>
                <td className="px-unit-lg py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBusTypeColor(bus.tipe)}`}>
                    {getBusTypeLabel(bus.tipe)}
                  </span>
                </td>
                <td className="px-unit-lg py-5 font-bold text-on-surface">
                  {formatRupiah(bus.harga_sewa)}
                </td>
                <td className="px-unit-lg py-5 text-right whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    Available
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ArmadaTable;

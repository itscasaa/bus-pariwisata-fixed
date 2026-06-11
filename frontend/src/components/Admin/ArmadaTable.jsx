import React, { useState, useEffect } from 'react';
import API_BASE from '../../config/api';

const ArmadaTable = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/buses.php`);
      const data = await response.json();
      if (data.status === 'success') {
        setBuses(Array.isArray(data.data) ? data.data.slice(0, 3) : []);
      } else {
        setError(data.message || 'Gagal memuat data armada');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'available') {
      return 'bg-green-100 text-green-700';
    } else if (status === 'in-service') {
      return 'bg-amber-100 text-amber-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      big_bus: { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed', label: 'Big Bus' },
      medium_bus: { bg: 'bg-primary-fixed-dim', text: 'text-on-primary-fixed-variant', label: 'Medium Bus' },
      elf: { bg: 'bg-surface-variant', text: 'text-on-surface-variant', label: 'Elf' },
      hiace: { bg: 'bg-surface-variant', text: 'text-on-surface-variant', label: 'Hiace' },
    };
    const typeInfo = typeMap[type] || typeMap.big_bus;
    return typeInfo;
  };

  if (loading) {
    return (
      <section className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] custom-shadow overflow-hidden">
        <div className="px-unit-lg py-6 flex justify-between items-center border-b border-outline-variant/30">
          <h3 className="text-headline-sm font-headline-sm text-on-surface">Data Armada Bus</h3>
        </div>
        <div className="p-unit-lg text-center text-outline">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          <p className="mt-2">Memuat data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] custom-shadow overflow-hidden">
      {/* Header */}
      <div className="px-unit-lg py-6 flex justify-between items-center border-b border-outline-variant/30">
        <h3 className="text-headline-sm font-headline-sm text-on-surface">Data Armada Bus</h3>
        <a href="/admin/armada" className="text-primary text-body-md font-semibold hover:underline">
          Lihat Semua
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-unit-lg py-4 font-label-sm text-label-sm text-outline uppercase">
                Bus Name
              </th>
              <th className="px-unit-lg py-4 font-label-sm text-label-sm text-outline uppercase">
                Capacity
              </th>
              <th className="px-unit-lg py-4 font-label-sm text-label-sm text-outline uppercase">
                Type
              </th>
              <th className="px-unit-lg py-4 font-label-sm text-label-sm text-outline uppercase">
                Price
              </th>
              <th className="px-unit-lg py-4 font-label-sm text-label-sm text-outline uppercase text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {buses.length > 0 ? (
              buses.map((bus) => {
                const typeInfo = getTypeBadge(bus.tipe);
                return (
                  <tr key={bus.id} className="hover:bg-surface-container-low transition-colors group">
                    {/* Bus Name with Image */}
                    <td className="px-unit-lg py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-dim overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={bus.gambar_utama || bus.gambar}
                            alt={bus.nama_bus}
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/40?text=Bus';
                            }}
                          />
                        </div>
                        <span className="font-body-lg text-body-lg font-bold text-on-surface">
                          {bus.nama_bus}
                        </span>
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="px-unit-lg py-5 text-on-surface-variant text-body-md">
                      {bus.kapasitas} Seats
                    </td>

                    {/* Type */}
                    <td className="px-unit-lg py-5">
                      <span
                        className={`px-3 py-1 rounded-full ${typeInfo.bg} ${typeInfo.text} text-xs font-bold`}
                      >
                        {typeInfo.label}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-unit-lg py-5 font-bold text-on-surface">
                      Rp {new Intl.NumberFormat('id-ID').format(bus.harga_sewa)}
                    </td>

                    {/* Status */}
                    <td className="px-unit-lg py-5 text-right">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        Available
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-unit-lg py-8 text-center text-outline">
                  Tidak ada data armada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ArmadaTable;

import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';

const PriceListPage = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = searchTerm
      ? `${API_BASE}/price_list.php?keyword=${encodeURIComponent(searchTerm)}`
      : `${API_BASE}/price_list.php`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        let data;
        try { data = JSON.parse(text); } catch { throw new Error('Response bukan JSON valid.'); }
        if (data.status === 'success') {
          setPrices(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || 'Gagal memuat data harga.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(keyword.trim());
  };

  const formatRupiah = (num) => {
    if (!num || num === 0) return 'Hubungi Kami';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0d4a8a] to-[#1d6ec5] py-14 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-2">Harga Resmi 2025 – 2026</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">Daftar Harga Sewa Bus</h1>
          <p className="text-blue-100 mb-8 text-sm lg:text-base">Surya Tour &amp; Trans — Tangerang</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex rounded-xl overflow-hidden shadow-xl">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari tujuan wisata..."
                className="flex-1 px-5 py-3.5 text-gray-800 text-sm focus:outline-none"
              />
              <button type="submit"
                className="px-7 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-search"></i> Cari
              </button>
            </div>
          </form>

          {searchTerm && (
            <p className="mt-3 text-blue-200 text-sm">
              Hasil pencarian: <span className="text-white font-bold">"{searchTerm}"</span>
              <button onClick={() => { setSearchTerm(''); setKeyword(''); }}
                className="ml-3 underline text-blue-300 hover:text-white text-xs">Reset</button>
            </p>
          )}
        </div>
      </div>

      {/* Info Strip - Keterangan Harga */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3">
          <div className="flex items-start gap-2.5 flex-1 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <i className="fas fa-check-circle text-green-500 text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs text-green-800 leading-relaxed">
              <strong className="block text-green-700 mb-0.5">Harga Sudah Termasuk:</strong>
              Sewa Bus, BBM, Driver, Helper &amp; Asuransi Jiwa
            </p>
          </div>
          <div className="flex items-start gap-2.5 flex-1 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <i className="fas fa-times-circle text-red-500 text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs text-red-800 leading-relaxed">
              <strong className="block text-red-700 mb-0.5">Harga Belum Termasuk:</strong>
              Toll, Parkir, Tips, Penyeberangan (Kapal Ferry), Retribusi Daerah &amp; Tiket Masuk Wisata
            </p>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="container mx-auto px-4 py-10">

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-[#1d6ec5] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400 text-sm">Memuat daftar harga...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <i className="fas fa-exclamation-circle text-5xl text-red-400 mb-4"></i>
            <p className="text-red-500 font-semibold">Gagal memuat data.</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
            <button onClick={() => setSearchTerm('')}
              className="mt-5 px-6 py-2.5 bg-[#1d6ec5] text-white rounded-lg font-semibold hover:opacity-90 transition text-sm">
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && prices.length === 0 && (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl text-gray-200 mb-4"></i>
            <p className="text-gray-500 font-semibold">
              {searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : 'Belum ada data harga.'}
            </p>
          </div>
        )}

        {!loading && !error && prices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header tabel */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Daftar Harga <span className="text-[#1d6ec5]">Surya Tour Trans</span></h2>
                <p className="text-xs text-gray-400 mt-0.5">{prices.length} tujuan tersedia</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <i className="fas fa-info-circle text-[#1d6ec5]"></i>
                Harga dalam Rupiah (IDR)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d2b4a] text-white">
                    <th className="px-5 py-4 text-left font-semibold w-[35%]">Tujuan Wisata</th>
                    <th className="px-4 py-4 text-center font-semibold">Durasi</th>
                    <th className="px-4 py-4 text-center font-semibold">HiAce</th>
                    <th className="px-4 py-4 text-center font-semibold">Elf</th>
                    <th className="px-4 py-4 text-center font-semibold">Medium Bus</th>
                    <th className="px-4 py-4 text-center font-semibold">Big Bus</th>
                    <th className="px-4 py-4 text-center font-semibold">Pesan</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((item, i) => (
                    <tr key={item.id}
                      className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors duration-150 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-2">
                          <i className="fas fa-map-marker-alt text-[#1d6ec5] mt-0.5 shrink-0"></i>
                          <span className="font-semibold text-gray-800 leading-snug">{item.nama_destinasi}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="bg-blue-100 text-[#1d6ec5] text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                          {item.durasi}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-700 font-medium whitespace-nowrap">{formatRupiah(item.harga_hiace)}</td>
                      <td className="px-4 py-3.5 text-center text-gray-700 font-medium whitespace-nowrap">{formatRupiah(item.harga_elf)}</td>
                      <td className="px-4 py-3.5 text-center text-gray-700 font-medium whitespace-nowrap">{formatRupiah(item.harga_medium)}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#0d4a8a] whitespace-nowrap">{formatRupiah(item.harga_big)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <a href={`https://wa.me/6287785598639?text=Halo%20Surya%20Tour%20Trans%2C%20saya%20ingin%20tanya%20harga%20ke%20${encodeURIComponent(item.nama_destinasi)}%20durasi%20${encodeURIComponent(item.durasi)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors duration-200 whitespace-nowrap">
                          <i className="fab fa-whatsapp"></i> Pesan
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer tabel - 3 baris keterangan */}
            <div className="border-t border-gray-100">
              <div className="flex items-start gap-3 px-6 py-3.5 bg-green-50 border-b border-green-100">
                <i className="fas fa-check-circle text-green-500 text-base mt-0.5 shrink-0"></i>
                <p className="text-xs text-green-800 leading-relaxed">
                  <strong>Harga sudah termasuk:</strong> Sewa Bus, BBM, Driver, Helper &amp; Asuransi Jiwa
                </p>
              </div>
              <div className="flex items-start gap-3 px-6 py-3.5 bg-red-50 border-b border-red-100">
                <i className="fas fa-times-circle text-red-500 text-base mt-0.5 shrink-0"></i>
                <p className="text-xs text-red-800 leading-relaxed">
                  <strong>Harga belum termasuk:</strong> Toll, Parkir, Tips, Penyeberangan (Kapal Ferry), Retribusi Daerah &amp; Tiket Masuk Wisata
                </p>
              </div>
              <div className="flex items-start gap-3 px-6 py-3.5 bg-amber-50">
                <i className="fas fa-exclamation-triangle text-amber-500 text-base mt-0.5 shrink-0"></i>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Catatan:</strong> Penggunaan bus menginap mulai jam <strong>05.00 WIB</strong> s/d <strong>24.00 WIB</strong> di hari terakhir.
                  Harga dapat berubah sewaktu-waktu, konfirmasi via WhatsApp untuk harga terkini.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PriceListPage;

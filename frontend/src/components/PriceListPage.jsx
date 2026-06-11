import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';
import siteData from '../data/siteData';
import PriceListTerms from './PriceListTerms';

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
    <div className="min-h-screen bg-white pt-16">

      {/* Hero */}
      <div className="relative text-white py-16 md:py-24 overflow-hidden text-center bg-[#062D5F]">
        {/* Background Image */}
        <img 
          src="/images/bannerpricelist.webp" 
          alt="Price List Banner" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: 'center', zIndex: 1 }}
        />
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: 'linear-gradient(180deg, rgba(6, 45, 95, 0.82) 0%, rgba(4, 30, 66, 0.92) 100%)',
            zIndex: 2
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,210,63,0.1),transparent)] pointer-events-none" style={{ zIndex: 3 }}></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Price List
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            Lihat estimasi harga sewa bus dan layanan perjalanan. Harga transparan, hemat, dan dapat disesuaikan dengan kebutuhan rute Anda.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex rounded-xl overflow-hidden shadow-xl border border-white/10 bg-white p-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari tujuan wisata..."
                className="flex-1 px-5 py-3 text-sm focus:outline-none text-[#10233F] rounded-lg"
              />
              <button type="submit"
                className="px-6 py-3 bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-bold text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <i className="fas fa-search"></i> Cari
              </button>
            </div>
          </form>

          {searchTerm && (
            <p className="mt-4 text-sm text-[#FFD23F]">
              Hasil pencarian: <span className="text-white font-bold">"{searchTerm}"</span>
              <button onClick={() => { setSearchTerm(''); setKeyword(''); }}
                className="ml-3 underline text-xs text-white/70 hover:text-white"
              >
                Reset
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Info Strip - Keterangan Harga */}
      <div className="border-b border-[#DDEAF6] bg-[#F3FAFF]">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-3">
          <div className="flex items-start gap-2.5 flex-1 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
            <i className="fas fa-check-circle text-[#128C7E] text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs text-green-800 leading-relaxed">
              <strong className="block text-green-750 mb-0.5">Harga Sudah Termasuk:</strong>
              Sewa Bus, BBM, Driver, Helper &amp; Asuransi Jiwa
            </p>
          </div>
          <div className="flex items-start gap-2.5 flex-1 bg-red-50 border border-red-255 rounded-2xl px-4 py-3">
            <i className="fas fa-times-circle text-red-500 text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs text-red-800 leading-relaxed">
              <strong className="block text-red-700 mb-0.5">Harga Belum Termasuk:</strong>
              Toll, Parkir, Tips, Penyeberangan (Kapal Ferry), Retribusi Daerah &amp; Tiket Masuk Wisata
            </p>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="container mx-auto px-4 py-10 bg-white">

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin mb-3" style={{ borderColor: '#0B5CA8', borderTopColor: 'transparent' }}></div>
            <p className="text-sm text-[#64748B]">Memuat daftar harga...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <i className="fas fa-exclamation-circle text-5xl text-red-400 mb-4"></i>
            <p className="font-semibold text-red-500">Gagal memuat data.</p>
            <p className="text-sm mt-1 text-[#64748B]">{error}</p>
            <button onClick={() => setSearchTerm('')}
              className="mt-5 px-6 py-2.5 text-[#10233F] rounded-xl font-bold hover:opacity-90 transition text-sm bg-[#FFD23F]"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && prices.length === 0 && (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl mb-4 text-[#DDEAF6]"></i>
            <p className="font-semibold text-[#64748B]">
              {searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : 'Belum ada data harga.'}
            </p>
          </div>
        )}

        {!loading && !error && prices.length > 0 && (
          <div className="bg-white border border-[#DDEAF6] rounded-3xl shadow-sm overflow-hidden">

            {/* Header tabel */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#DDEAF6]">
              <div>
                <h2 className="text-lg font-extrabold text-[#10233F]">Daftar Estimasi Tarif Sewa Bus <span className="text-[#0B5CA8]">Mafina Trans</span></h2>
                <p className="text-xs mt-0.5 text-[#64748B]">{prices.length} tujuan perjalanan tersedia</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#F3FAFF] text-[#64748B]">
                <i className="fas fa-info-circle text-[#0B5CA8]"></i>
                Harga dalam Rupiah (IDR)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#062D5F] text-white">
                    <th className="px-5 py-4 text-left font-bold w-[35%]">Tujuan Wisata</th>
                    <th className="px-4 py-4 text-center font-bold">Durasi</th>
                    <th className="px-4 py-4 text-center font-bold">HiAce</th>
                    <th className="px-4 py-4 text-center font-bold">Elf</th>
                    <th className="px-4 py-4 text-center font-bold">Medium Bus</th>
                    <th className="px-4 py-4 text-center font-bold">Big Bus</th>
                    <th className="px-4 py-4 text-center font-bold">Pesan</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((item, i) => (
                    <tr key={item.id}
                      className="transition-colors duration-150 border-b border-[#DDEAF6]"
                      style={{
                        background: i % 2 === 0 ? 'transparent' : '#F3FAFF'
                      }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-2">
                          <i className="fas fa-map-marker-alt mt-0.5 shrink-0 text-[#0B5CA8]"></i>
                          <span className="font-bold leading-snug text-[#10233F]">{item.nama_destinasi}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-[#EAF6FF] text-[#0B5CA8]">
                          {item.durasi}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold whitespace-nowrap text-[#073B78]">{formatRupiah(item.harga_hiace)}</td>
                      <td className="px-4 py-3.5 text-center font-bold whitespace-nowrap text-[#073B78]">{formatRupiah(item.harga_elf)}</td>
                      <td className="px-4 py-3.5 text-center font-bold whitespace-nowrap text-[#073B78]">{formatRupiah(item.harga_medium)}</td>
                      <td className="px-4 py-3.5 text-center font-extrabold whitespace-nowrap text-[#062D5F]">{formatRupiah(item.harga_big)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <a href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20tanya%20harga%20ke%20${encodeURIComponent(item.nama_destinasi)}%20durasi%20${encodeURIComponent(item.durasi)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#128C7E] hover:bg-[#0b655b] text-white text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm">
                          <i className="fab fa-whatsapp"></i> Pesan
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer tabel - 3 baris keterangan */}
            <div className="border-t border-[#DDEAF6]">
              <div className="flex items-start gap-3 px-6 py-3.5 bg-green-50/50 border-b border-[#DDEAF6]">
                <i className="fas fa-check-circle text-[#128C7E] text-base mt-0.5 shrink-0"></i>
                <p className="text-xs text-green-800 leading-relaxed">
                  <strong>Harga sudah termasuk:</strong> Sewa Bus, BBM, Driver, Helper &amp; Asuransi Jiwa
                </p>
              </div>
              <div className="flex items-start gap-3 px-6 py-3.5 bg-red-50/50 border-b border-[#DDEAF6]">
                <i className="fas fa-times-circle text-red-500 text-base mt-0.5 shrink-0"></i>
                <p className="text-xs text-red-850 leading-relaxed">
                  <strong>Harga belum termasuk:</strong> Toll, Parkir, Tips, Penyeberangan (Kapal Ferry), Retribusi Daerah &amp; Tiket Masuk Wisata
                </p>
              </div>
              <div className="flex items-start gap-3 px-6 py-3.5 bg-amber-55/40">
                <i className="fas fa-exclamation-triangle text-amber-600 text-base mt-0.5 shrink-0"></i>
                <p className="text-xs text-amber-850 leading-relaxed">
                  <strong>Catatan:</strong> Penggunaan bus menginap mulai jam <strong>05.00 WIB</strong> s/d <strong>24.00 WIB</strong> di hari terakhir.
                  Harga dapat berubah sewaktu-waktu, konfirmasi via WhatsApp untuk harga terkini.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <PriceListTerms />
    </div>
  );
};

export default PriceListPage;

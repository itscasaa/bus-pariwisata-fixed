import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE from '../config/api';
import siteData from '../data/siteData';

const getFacilityIcon = (facility) => {
  const facLower = facility.toLowerCase();
  if (facLower.includes('ac')) return 'fa-snowflake';
  if (facLower.includes('seat') || facLower.includes('kursi')) return 'fa-chair';
  if (facLower.includes('audio') || facLower.includes('sound')) return 'fa-volume-up';
  if (facLower.includes('bagasi')) return 'fa-suitcase';
  if (facLower.includes('bantal') || facLower.includes('selimut')) return 'fa-bed';
  if (facLower.includes('tv') || facLower.includes('monitor')) return 'fa-tv';
  if (facLower.includes('dispenser')) return 'fa-tint';
  return 'fa-check-circle';
};

const ArmadaPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/buses.php`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setBuses(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || 'Gagal memuat data armada.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===== HERO BANNER ===== */}
      <div className="bg-gradient-to-br from-[#0d4a8a] to-[#1d6ec5] pt-16 lg:pt-20 pb-14 text-white relative overflow-hidden">
        {/* Dot pattern dekoratif */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        ></div>
        {/* Lingkaran dekoratif */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Label kecil */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <i className="fas fa-bus text-yellow-300"></i>
            Surya Tour Trans — Tangerang
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold mb-3 tracking-tight">
            Armada Bus Kami
          </h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-2xl mx-auto mb-8">
            Pilihan armada bus pariwisata premium dengan fasilitas lengkap, driver profesional &amp; BBM sudah termasuk
          </p>

          {/* Stats bar */}
          <div className="inline-flex flex-wrap justify-center gap-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center font-bold text-xs">5</span>
              <span className="text-blue-100">Unit Armada</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-users text-yellow-300"></i>
              <span className="text-blue-100">Kapasitas 30–45 Kursi</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-shield-alt text-yellow-300"></i>
              <span className="text-blue-100">Driver &amp; BBM Included</span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block self-stretch"></div>
            <div className="flex items-center gap-2 text-sm">
              <i className="fas fa-snowflake text-yellow-300"></i>
              <span className="text-blue-100">Full AC &amp; Fasilitas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-blue-800">
          <span><i className="fas fa-check-circle text-green-500 mr-1"></i>Harga sudah termasuk: sewa bus, BBM, driver, helper &amp; asuransi jiwa</span>
          <span><i className="fas fa-times-circle text-red-400 mr-1"></i>Belum termasuk: toll, parkir, tips, tiket wisata &amp; kapal ferry</span>
        </div>
      </div>

      {/* ===== MAIN GRID ===== */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 border-[#1d6ec5] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-semibold">Memuat daftar armada...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto px-6">
              <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Koneksi Gagal</h3>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#1d6ec5] hover:bg-[#0d4a8a] text-white font-semibold px-6 py-2.5 rounded-lg transition"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && buses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto px-6">
              <i className="fas fa-bus text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-semibold">Belum ada armada bus yang tersedia saat ini.</p>
            </div>
          )}

          {!loading && !error && buses.length > 0 && (
            <>
              <div className="text-sm text-gray-500 mb-6">
                Menampilkan <span className="font-semibold text-gray-700">{buses.length}</span> unit armada tersedia
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {buses.map((bus) => (
                  <div
                    key={bus.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 flex flex-col"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden relative bg-gray-200">
                      <img
                        src={bus.gambar_utama || bus.gambar}
                        alt={bus.nama_bus}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/images/default-bus.jpg'; }}
                      />
                      <div className="absolute top-4 left-4 bg-[#1d6ec5] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        {bus.tipe.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-[#1d6ec5] transition-colors duration-300">
                        {bus.nama_bus}
                      </h3>

                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                        <span className="flex items-center gap-1.5">
                          <i className="fas fa-users text-[#1d6ec5]"></i>
                          <span>{bus.kapasitas} Kursi</span>
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1.5">
                          <i className="fas fa-shield-alt text-[#1d6ec5]"></i>
                          <span>Driver &amp; BBM</span>
                        </span>
                      </div>

                      {bus.fasilitas && bus.fasilitas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {bus.fasilitas.slice(0, 3).map((fac, i) => (
                            <span
                              key={i}
                              className="bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1 border border-gray-100"
                            >
                              <i className={`fas ${getFacilityIcon(fac)} text-gray-400`}></i>
                              {fac}
                            </span>
                          ))}
                          {bus.fasilitas.length > 3 && (
                            <span className="bg-blue-50 text-[#1d6ec5] text-xs font-bold px-2.5 py-1 rounded">
                              +{bus.fasilitas.length - 3} Lainnya
                            </span>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
                        <Link
                          to={`/bus/${bus.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm py-3 rounded-lg text-center transition"
                        >
                          Detail Unit
                        </Link>
                        <a
                          href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Surya%20Tour%20Trans%2C%20saya%20ingin%20menanyakan%20harga%20sewa%20untuk%20armada%20${encodeURIComponent(bus.nama_bus)}%20kapasitas%20${bus.kapasitas}%20kursi.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3 rounded-lg text-center flex items-center justify-center gap-1.5 transition"
                        >
                          <i className="fab fa-whatsapp text-base"></i>
                          Tanya Harga
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </div>
  );
};

export default ArmadaPage;

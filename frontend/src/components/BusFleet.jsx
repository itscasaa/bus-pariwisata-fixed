import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import API_BASE from '../config/api';

const FALLBACK_BUSES = [
  { name: 'Zahra Ayu', tipe: 'Big Bus', kapasitas: 59 },
  { name: 'Wong Kudus', tipe: 'Medium Bus', kapasitas: 31 },
  { name: 'William', tipe: 'Big Bus', kapasitas: 59 },
  { name: 'White Horse', tipe: 'Medium Bus', kapasitas: 31 },
  { name: 'Starbus', tipe: 'Big Bus', kapasitas: 45 },
  { name: 'Blue Star', tipe: 'Big Bus', kapasitas: 59 }
];

const BusFleet = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSwiper, setUseSwiper] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/buses.php`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.status === 'success') {
          setBuses(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || 'Gagal memuat data armada.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setUseSwiper(true);
      window.removeEventListener('scroll', handleScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timer = setTimeout(() => {
      setUseSwiper(true);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const swiperProps = {
    modules: [Navigation, Autoplay],
    spaceBetween: 24,
    slidesPerView: 1,
    navigation: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
    className: "pb-2",
  };

  const renderLiveGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {buses.slice(0, 4).map((bus) => (
        <div key={bus.id} className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full">
          <Link to={`/bus/${bus.id}`} className="aspect-[4/3] overflow-hidden bg-gray-100 block relative">
            <img
              src={bus.gambar_utama || bus.gambar}
              alt={bus.nama_bus}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/bus4/bus4.webp'; }}
            />
            {bus.diskon && (
              <div className="absolute top-3 right-3 bg-[#ba1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                Diskon {bus.diskon}
              </div>
            )}
          </Link>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-[#EAF6FF] text-[#0B5CA8] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {bus.tipe ? bus.tipe.replace('_', ' ') : 'Bus'}
              </span>
              <span className="text-[#64748B] text-xs flex items-center gap-1">
                <i className="fas fa-users text-[#0B5CA8]"></i> {bus.kapasitas} Kursi
              </span>
            </div>
            <Link to={`/bus/${bus.id}`}>
              <h3 className="font-extrabold text-[#10233F] text-lg hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-1">
                {bus.nama_bus}
              </h3>
            </Link>
            <p className="text-[#0B5CA8] font-black text-base mt-2 mb-4">
              Rp {new Intl.NumberFormat('id-ID').format(bus.harga_sewa)} <span className="text-xs text-[#64748B] font-normal">/ Hari</span>
            </p>
            
            <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[#DDEAF6]">
              <Link
                to={`/bus/${bus.id}`}
                className="font-bold text-xs py-2.5 rounded-xl text-center transition-all bg-[#F3FAFF] text-[#073B78] hover:bg-[#EAF6FF]"
              >
                Lihat Detail
              </Link>
              <a
                href={`https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20sewa%20bus%20${encodeURIComponent(bus.nama_bus)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all"
              >
                <i className="fab fa-whatsapp"></i>
                Pesan Bus
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFallbackGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {FALLBACK_BUSES.slice(0, 4).map((bus, i) => (
        <div key={i} className="bg-white border border-[#DDEAF6] shadow-sm rounded-3xl overflow-hidden p-6 text-center flex flex-col justify-between h-full">
          <div>
            <div className="aspect-[4/3] overflow-hidden bg-[#F3FAFF] rounded-2xl flex items-center justify-center mb-4">
              <i className="fas fa-bus text-4xl text-[#073B78]/20"></i>
            </div>
            <span className="bg-[#EAF6FF] text-[#0B5CA8] text-[10px] font-bold px-3 py-1 rounded-full inline-block mb-2 uppercase tracking-wider">
              {bus.tipe}
            </span>
            <h3 className="font-extrabold text-[#10233F] text-lg">{bus.name}</h3>
            <p className="text-[#64748B] text-xs mt-1.5 flex items-center justify-center gap-1.5">
              <i className="fas fa-users text-[#0B5CA8]"></i> {bus.kapasitas} Kursi
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#DDEAF6]">
            <a
              href={`https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20tanya%20sewa%20bus%20pariwisata.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
            >
              <i className="fab fa-whatsapp"></i>
              Tanya Harga
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-transparent">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#1567A5] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500">Memuat data armada...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[#0B5CA8] font-bold text-xs uppercase tracking-widest bg-[#EAF6FF] px-4 py-2 rounded-full">
              Pilihan Armada
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10233F] mt-4">
              Armada Bus Pariwisata
            </h2>
            <div className="w-16 h-1 bg-[#FFD23F] mt-3 rounded-full"></div>
          </div>
          <Link
            to="/bus-wisata"
            className="text-[#0B5CA8] hover:text-[#073B78] font-bold text-sm flex items-center gap-1.5 transition-colors duration-200"
          >
            Lihat Semua <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Error notice (non-blocking) */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 text-sm text-center shadow-sm">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Koneksi ke server gagal — menampilkan data statis. ({error})
          </div>
        )}

        {/* Live data from database */}
        {!error && buses.length > 0 && (
          useSwiper ? (
            <Swiper {...swiperProps}>
              {buses.map((bus) => (
                <SwiperSlide key={bus.id}>
                  <div className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full">
                    <Link to={`/bus/${bus.id}`} className="aspect-[4/3] overflow-hidden bg-gray-100 block relative">
                      <img
                        src={bus.gambar_utama || bus.gambar}
                        alt={bus.nama_bus}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/bus4/bus4.webp'; }}
                      />
                      {bus.diskon && (
                        <div className="absolute top-3 right-3 bg-[#ba1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                          Diskon {bus.diskon}
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-[#EAF6FF] text-[#0B5CA8] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {bus.tipe ? bus.tipe.replace('_', ' ') : 'Bus'}
                        </span>
                        <span className="text-[#64748B] text-xs flex items-center gap-1">
                          <i className="fas fa-users text-[#0B5CA8]"></i> {bus.kapasitas} Kursi
                        </span>
                      </div>
                      <Link to={`/bus/${bus.id}`}>
                        <h3 className="font-extrabold text-[#10233F] text-lg hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-1">
                          {bus.nama_bus}
                        </h3>
                      </Link>
                      <p className="text-[#0B5CA8] font-black text-base mt-2 mb-4">
                        Rp {new Intl.NumberFormat('id-ID').format(bus.harga_sewa)} <span className="text-xs text-[#64748B] font-normal">/ Hari</span>
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[#DDEAF6]">
                        <Link
                          to={`/bus/${bus.id}`}
                          className="font-bold text-xs py-2.5 rounded-xl text-center transition-all bg-[#F3FAFF] text-[#073B78] hover:bg-[#EAF6FF]"
                        >
                          Lihat Detail
                        </Link>
                        <a
                          href={`https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20sewa%20bus%20${encodeURIComponent(bus.nama_bus)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all"
                        >
                          <i className="fab fa-whatsapp"></i>
                          Pesan Bus
                        </a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            renderLiveGrid()
          )
        )}

        {/* Empty DB state — show fallback static cards */}
        {((!error && buses.length === 0) || error) && (
          useSwiper ? (
            <Swiper {...swiperProps}>
              {FALLBACK_BUSES.map((bus, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white border border-[#DDEAF6] shadow-sm rounded-3xl overflow-hidden p-6 text-center flex flex-col justify-between h-full">
                    <div>
                      <div className="aspect-[4/3] overflow-hidden bg-[#F3FAFF] rounded-2xl flex items-center justify-center mb-4">
                        <i className="fas fa-bus text-4xl text-[#073B78]/20"></i>
                      </div>
                      <span className="bg-[#EAF6FF] text-[#0B5CA8] text-[10px] font-bold px-3 py-1 rounded-full inline-block mb-2 uppercase tracking-wider">
                        {bus.tipe}
                      </span>
                      <h3 className="font-extrabold text-[#10233F] text-lg">{bus.name}</h3>
                      <p className="text-[#64748B] text-xs mt-1.5 flex items-center justify-center gap-1.5">
                        <i className="fas fa-users text-[#0B5CA8]"></i> {bus.kapasitas} Kursi
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#DDEAF6]">
                      <a
                        href={`https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20tanya%20sewa%20bus%20pariwisata.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <i className="fab fa-whatsapp"></i>
                        Tanya Harga
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            renderFallbackGrid()
          )
        )}
      </div>
    </section>
  );
};

export default BusFleet;

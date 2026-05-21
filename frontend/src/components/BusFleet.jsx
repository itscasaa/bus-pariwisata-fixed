import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import API_BASE from '../config/api';

const FALLBACK_BUSES = ['Zahra Ayu', 'Wong Kudus', 'William', 'White Horse', 'Starbus', 'Blue Star'];

const BusFleet = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500">Memuat data armada...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Bus Pariwisata</h2>
            <div className="w-16 h-1 bg-[var(--color-primary)] mt-2 rounded-full"></div>
          </div>
          <Link
            to="/bus-wisata"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-semibold text-sm flex items-center gap-1 transition-colors duration-200"
          >
            View All <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Error notice (non-blocking) */}
        {error && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm text-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Koneksi ke server gagal — menampilkan data statis. ({error})
          </div>
        )}

        {/* Live data from database */}
        {!error && buses.length > 0 && (
          <Swiper {...swiperProps}>
            {buses.map((bus) => (
              <SwiperSlide key={bus.id}>
                <Link
                  to={`/bus/${bus.id}`}
                  className="block group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={bus.gambar_utama || bus.gambar}
                      alt={bus.nama_bus}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                      {bus.nama_bus}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      <i className="fas fa-users mr-1"></i> {bus.kapasitas} Kursi
                    </p>
                    <p className="text-[var(--color-primary)] font-bold mt-2">
                      Rp {new Intl.NumberFormat('id-ID').format(bus.harga_sewa)}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Empty DB state — show fallback static cards */}
        {(!error && buses.length === 0) || error ? (
          <Swiper {...swiperProps}>
            {FALLBACK_BUSES.map((name, i) => (
              <SwiperSlide key={i}>
                <div className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-bus text-4xl text-gray-400"></i>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-800">{name}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>
    </section>
  );
};

export default BusFleet;

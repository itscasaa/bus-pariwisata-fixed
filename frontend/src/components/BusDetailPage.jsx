import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Thumbs } from 'swiper/modules';
import API_BASE from '../config/api';
import siteData from '../data/siteData';

const getFacilityDescription = (label) => {
  const labelLower = (label || '').toLowerCase();
  if (labelLower.includes('bangku depan') || labelLower.includes('depan')) {
    return 'Kabin depan dirancang dengan tata letak kursi ergonomis yang memberikan kenyamanan maksimal sejak awal perjalanan.';
  }
  if (labelLower.includes('bangku belakang') || labelLower.includes('belakang')) {
    return 'Kabin belakang yang luas dan tenang, sangat cocok untuk beristirahat dengan nyaman selama perjalanan jauh.';
  }
  if (labelLower.includes('supir') || labelLower.includes('driver')) {
    return 'Area kemudi yang modern dan rapi, diawasi oleh driver profesional berlisensi untuk menjamin keamanan Anda.';
  }
  if (labelLower.includes('dispenser')) {
    return 'Dispenser air minum terintegrasi untuk kenyamanan rombongan yang ingin menyeduh minuman hangat atau dingin.';
  }
  if (labelLower.includes('eksterior')) {
    return 'Tampilan bodi bus yang elegan, aerodinamis, dan selalu dirawat secara berkala untuk performa terbaik.';
  }
  return 'Fasilitas premium yang dirancang khusus guna meningkatkan kenyamanan dan keamanan rombongan perjalanan Anda.';
};

const getFacilityIcon = (facility) => {
  const f = facility.toLowerCase();
  if (f.includes('ac'))                                       return 'fa-snowflake';
  if (f.includes('seat') || f.includes('kursi'))              return 'fa-chair';
  if (f.includes('lcd') || f.includes('tv') || f.includes('monitor')) return 'fa-tv';
  if (f.includes('dispenser'))                                return 'fa-tint';
  if (f.includes('audio') || f.includes('sound'))             return 'fa-volume-up';
  if (f.includes('android') || f.includes('entertainment'))   return 'fa-tablet-alt';
  if (f.includes('karaoke') || f.includes('microphone'))      return 'fa-microphone';
  if (f.includes('cooler') || f.includes('box'))              return 'fa-box';
  if (f.includes('usb') || f.includes('port'))                return 'fa-plug';
  if (f.includes('bagasi') || f.includes('kompartemen'))      return 'fa-suitcase';
  if (f.includes('lampu') || f.includes('baca'))              return 'fa-lightbulb';
  if (f.includes('bantal') || f.includes('selimut'))          return 'fa-bed';
  return 'fa-check-circle';
};

const BusDetailPage = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/buses.php?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success' && data.data) {
          setBus(data.data);
        } else {
          setError(data.message || 'Gagal memuat detail armada.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1d6ec5] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-semibold">Memuat spesifikasi unit...</p>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
          <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unit Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">{error || 'Data spesifikasi bus tidak tersedia.'}</p>
          <Link
            to="/bus-wisata"
            className="inline-flex items-center gap-2 bg-[#1d6ec5] text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            <i className="fas fa-arrow-left"></i> Kembali ke Armada
          </Link>
        </div>
      </div>
    );
  }

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID').format(num);

  const galleryImages = bus.images && bus.images.length > 0 ? bus.images : [{ path: bus.gambar_utama, label: 'Eksterior Bus' }];

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-gray-50">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0d4a8a] to-[#1d6ec5] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to="/bus-wisata" className="text-blue-200 hover:text-white text-sm transition">
                  Armada
                </Link>
                <span className="text-blue-300 text-xs">/</span>
                <span className="text-white text-sm font-semibold">{bus.nama_bus}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                {bus.nama_bus}
              </h1>
              <p className="text-blue-100 text-base mt-2 flex items-center gap-2">
                <span className="bg-blue-800/60 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {bus.tipe.replace('_', ' ')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-users text-xs"></i> {bus.kapasitas} Kursi Penumpang
                </span>
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 text-right border border-white/20">
              <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">Harga Sewa Mulai</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-300 mt-1">
                Rp {formatRupiah(bus.harga_sewa)}
                <span className="text-sm font-normal text-white"> / Hari</span>
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Slider & Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Image Carousel */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Navigation, Autoplay, Thumbs]}
                  className="rounded-xl overflow-hidden aspect-[16/9] mb-4 shadow-sm"
                >
                  {galleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-full h-full relative">
                        <img
                          src={img.path}
                          alt={img.label}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/images/default-bus.jpg'; }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                          <span className="bg-[#1d6ec5] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                            {img.label}
                          </span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    watchSlidesProgress={true}
                    modules={[Navigation, Thumbs]}
                    className="thumbs-swiper cursor-pointer"
                  >
                    {galleryImages.map((img, index) => (
                      <SwiperSlide key={index} className="rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 opacity-60 hover:opacity-100">
                        <div className="aspect-[4/3] bg-gray-100">
                          <img
                            src={img.path}
                            alt={img.label}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/default-bus.jpg'; }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* Bus Description */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  Deskripsi Armada
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {bus.deskripsi || `${bus.nama_bus} merupakan salah satu unit unggulan kami dengan kapasitas ${bus.kapasitas} kursi. Armada ini dirancang khusus untuk memastikan kenyamanan rombongan pariwisata, ziarah, kunjungan industri, maupun perjalanan dinas Anda tetap optimal di sepanjang jalan.`}
                </p>
              </div>

              {/* Amenity Icons Grid */}
              {bus.fasilitas && bus.fasilitas.length > 0 && (
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                    Fasilitas Kenyamanan
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {bus.fasilitas.map((fac, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100 text-center hover:bg-blue-50/50 hover:border-blue-100 transition-all duration-300"
                      >
                        <span className="w-12 h-12 bg-blue-100 text-[#1d6ec5] flex items-center justify-center rounded-full text-lg mb-3 shadow-sm">
                          <i className={`fas ${getFacilityIcon(fac)}`}></i>
                        </span>
                        <span className="font-semibold text-gray-700 text-sm">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Interactive Gallery (Fasilitas Detail beserta Keterangannya) */}
              {bus.images && bus.images.length > 0 && (
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                    Galeri & Detail Fasilitas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bus.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="group overflow-hidden rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-gray-200 relative">
                          <img
                            src={img.path}
                            alt={img.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = '/images/default-bus.jpg'; }}
                          />
                          <div className="absolute top-3 left-3 bg-[#1d6ec5]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                            {img.label}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800 text-base mb-1">
                            {img.label}
                          </h4>
                          <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                            {getFacilityDescription(img.label)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Sticky Pricing & Action Widget */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24 space-y-6">
                <div>
                  <h4 className="text-gray-800 font-bold text-lg mb-2">Sewa Unit Ini</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Dapatkan armada bus premium terbaik untuk mengawal kegiatan penting Anda bersama Surya Tour Trans.
                  </p>
                </div>

                <div className="border-t border-b border-gray-100 py-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Kapasitas Maksimal</span>
                    <span className="font-bold text-gray-800">{bus.kapasitas} Kursi</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tipe Armada</span>
                    <span className="font-bold text-gray-800 uppercase text-xs bg-blue-50 text-[#1d6ec5] px-2.5 py-1 rounded">
                      {bus.tipe.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Sopir & BBM</span>
                    <span className="font-bold text-green-600">Sudah Termasuk</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Surya%20Tour%20Trans%2C%20saya%20tertarik%20untuk%20menyewa%20armada%20${encodeURIComponent(bus.nama_bus)}%20kapasitas%20${bus.kapasitas}%20kursi.%20Boleh%20tanya%20ketersediaan%20jadwalnya%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-100"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>Sewa via WhatsApp</span>
                  </a>
                  
                  <Link
                    to="/price-list"
                    className="w-full border border-gray-200 hover:border-[#1d6ec5] hover:text-[#1d6ec5] text-gray-600 font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <i className="fas fa-tags"></i>
                    <span>Cek Daftar Harga Lengkap</span>
                  </Link>
                </div>

                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    <i className="fas fa-info-circle mr-1"></i> Harga sewa dapat berubah tergantung jarak tempuh, durasi pemakaian, dan rute perjalanan.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default BusDetailPage;

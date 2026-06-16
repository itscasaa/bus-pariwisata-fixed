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

const getCategoryLabel = (tipe) => {
  const mapping = {
    exterior: 'Eksterior',
    interior: 'Interior',
    seat: 'Tempat Duduk',
    facility: 'Fasilitas',
    other: 'Lainnya'
  };
  return mapping[tipe] || 'Foto';
};

const getCategoryBadgeClass = (tipe) => {
  const mapping = {
    exterior: 'bg-green-100 text-green-800 border-green-200',
    interior: 'bg-blue-100 text-blue-800 border-blue-200',
    seat: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    facility: 'bg-orange-100 text-orange-800 border-orange-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return mapping[tipe] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const BusDetailPage = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

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
      <div className="pt-28 pb-20 min-h-screen bg-transparent flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" style={{ borderColor: 'var(--color-blue)', borderTopColor: 'transparent' }}></div>
        <p className="font-semibold" style={{ color: 'var(--color-muted)' }}>Memuat spesifikasi unit...</p>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-transparent flex flex-col items-center justify-center px-4">
        <div className="glass-card p-8 rounded-2xl text-center max-w-md w-full">
          <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Unit Tidak Ditemukan</h2>
          <p className="mb-6" style={{ color: 'var(--color-muted)' }}>{error || 'Data spesifikasi bus tidak tersedia.'}</p>
          <Link
            to="/bus-wisata"
            className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            style={{ background: 'var(--color-blue)' }}
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
    <div className="pt-16 lg:pt-20 min-h-screen bg-white">
      {/* Header Banner */}
      <section
        className="text-white py-12 md:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #073B78 0%, #062D5F 50%, #0B5CA8 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,210,63,0.08),transparent)] pointer-events-none"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to="/bus-wisata" className="text-white/60 hover:text-white text-sm transition">
                  Armada
                </Link>
                <span className="text-white/40 text-xs">/</span>
                <span className="text-white text-sm font-semibold">{bus.nama_bus}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {bus.nama_bus}
              </h1>
              <div className="text-white/80 text-base mt-2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10">
                  {bus.tipe.replace('_', ' ')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-users text-xs text-[#FFD23F]"></i> {bus.kapasitas} Kursi Penumpang
                </span>
              </div>
            </div>
            <div className="rounded-2xl p-4 md:p-6 text-right border border-white/15" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center justify-end gap-2 mb-1">
                {bus.diskon && (
                  <span className="bg-[#ba1a1a] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                    Diskon {bus.diskon}
                  </span>
                )}
                <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Harga Sewa Mulai</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFD23F] mt-1">
                Rp {formatRupiah(bus.harga_sewa)}
                <span className="text-sm font-normal text-white"> / Hari</span>
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Slider & Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Image Carousel */}
              <div className="bg-white border border-[#DDEAF6] p-4 rounded-3xl shadow-sm">
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Navigation, Autoplay, Thumbs]}
                  className="rounded-2xl overflow-hidden aspect-[16/9] mb-4 shadow-sm"
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
                        {bus.diskon && index === 0 && (
                          <div className="absolute top-4 right-4 bg-[#ba1a1a] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider z-10">
                            Diskon {bus.diskon}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 text-white">
                          <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block" style={{ background: '#0B5CA8' }}>
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
                      <SwiperSlide key={index} className="rounded-xl overflow-hidden border-2 border-transparent transition-all duration-300 opacity-60 hover:opacity-100">
                        <div className="aspect-[4/3] bg-[#F3FAFF]">
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
              <div className="bg-white border border-[#DDEAF6] p-6 md:p-8 rounded-3xl shadow-sm">
                <h3 className="text-xl font-extrabold text-[#10233F] mb-4 pb-2 border-b border-[#DDEAF6]">
                  Deskripsi Armada
                </h3>
                <p className="leading-relaxed whitespace-pre-line text-sm md:text-base text-[#64748B]">
                  {bus.deskripsi || `${bus.nama_bus} merupakan salah satu unit unggulan kami dengan kapasitas ${bus.kapasitas} kursi. Armada ini dirancang khusus untuk memastikan kenyamanan rombongan pariwisata, ziarah, kunjungan industri, maupun perjalanan dinas Anda tetap optimal di sepanjang jalan.`}
                </p>
              </div>

              {/* Amenity Icons Grid */}
              {bus.fasilitas && bus.fasilitas.length > 0 && (
                <div className="bg-white border border-[#DDEAF6] p-6 md:p-8 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-extrabold text-[#10233F] mb-5 pb-2 border-b border-[#DDEAF6]">
                    Fasilitas Kenyamanan
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {bus.fasilitas.map((fac, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center p-4 rounded-2xl text-center border border-[#DDEAF6] bg-[#F3FAFF] transition-all duration-300"
                      >
                        <span
                          className="w-12 h-12 flex items-center justify-center rounded-full text-lg mb-3 shadow-sm bg-[#EAF6FF] text-[#073B78]"
                        >
                          <i className={`fas ${getFacilityIcon(fac)}`}></i>
                        </span>
                        <span className="font-bold text-sm text-[#10233F]">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Interactive Gallery */}
              {bus.images && bus.images.length > 0 && (() => {
                const availableCategories = ['all', ...new Set(bus.images.map(img => img.tipe_gambar || 'other'))];
                const filteredImages = activeCategory === 'all'
                  ? bus.images
                  : bus.images.filter(img => (img.tipe_gambar || 'other') === activeCategory);

                return (
                  <div className="bg-white border border-[#DDEAF6] p-6 md:p-8 rounded-3xl shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-2 border-b border-[#DDEAF6]">
                      <h3 className="text-xl font-extrabold text-[#10233F]">
                        Galeri & Detail Fasilitas
                      </h3>
                      <span className="text-xs font-semibold text-[#64748B]">
                        Menampilkan {filteredImages.length} dari {bus.images.length} foto
                      </span>
                    </div>

                    {/* Category Filter Buttons */}
                    {availableCategories.length > 2 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {availableCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                              activeCategory === cat
                                ? 'text-white shadow-sm'
                                : 'hover:opacity-85'
                            }`}
                            style={activeCategory === cat
                              ? { background: '#0B5CA8', borderColor: '#0B5CA8' }
                              : { background: '#F3FAFF', color: '#64748B', borderColor: '#DDEAF6' }
                            }
                          >
                            {cat === 'all' ? 'Semua Foto' : getCategoryLabel(cat)}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="group overflow-hidden rounded-2xl bg-white border border-[#DDEAF6] hover:shadow-md transition-all duration-300"
                        >
                          <div className="aspect-[16/10] overflow-hidden relative bg-[#F3FAFF]">
                            <img
                              src={img.path}
                              alt={img.label || getCategoryLabel(img.tipe_gambar)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { e.target.src = '/images/default-bus.jpg'; }}
                            />
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              <span className={`backdrop-blur-sm border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getCategoryBadgeClass(img.tipe_gambar)}`}>
                                {getCategoryLabel(img.tipe_gambar)}
                              </span>
                              {img.is_cover === 1 && (
                                <span className="bg-green-100 text-green-800 border border-green-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                  Cover
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-extrabold text-base mb-1 text-[#10233F]">
                              {img.label || getCategoryLabel(img.tipe_gambar)}
                            </h4>
                            <p className="text-xs md:text-sm leading-relaxed text-[#64748B]">
                              {getFacilityDescription(img.label || getCategoryLabel(img.tipe_gambar))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Right Column: Sticky Pricing & Action Widget */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#DDEAF6] shadow-md rounded-3xl p-6 sticky top-24 space-y-6">
                <div>
                  <h4 className="font-extrabold text-lg mb-2 text-[#10233F]">Sewa Unit Ini</h4>
                  <p className="text-xs leading-relaxed text-[#64748B]">
                    Dapatkan armada bus premium terbaik untuk mengawal kegiatan penting Anda bersama Mafina Trans.
                  </p>
                </div>

                <div className="py-4 space-y-3 border-t border-b border-[#DDEAF6]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#64748B]">Kapasitas Maksimal</span>
                    <span className="font-bold text-[#10233F]">{bus.kapasitas} Kursi</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#64748B]">Tipe Armada</span>
                    <span
                      className="font-bold uppercase text-xs px-2.5 py-1 rounded bg-[#EAF6FF] text-[#0B5CA8]"
                    >
                      {bus.tipe.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#64748B]">Sopir & BBM</span>
                    <span className="font-bold text-green-600">Sudah Termasuk</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${siteData.whatsapp.number}?text=${encodeURIComponent(`Halo Mafina Trans, saya tertarik untuk menyewa armada ${bus.nama_bus} kapasitas ${bus.kapasitas} kursi${bus.diskon ? ` dengan promo ${bus.diskon}` : ''}. Boleh tanya ketersediaan jadwalnya?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>Sewa via WhatsApp</span>
                  </a>
                  
                  <Link
                    to="/price-list"
                    className="w-full font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-[#DDEAF6] text-[#64748B] hover:bg-[#F3FAFF]"
                  >
                    <i className="fas fa-tags"></i>
                    <span>Cek Daftar Harga Lengkap</span>
                  </Link>
                </div>

                <div className="rounded-2xl p-4 text-center border border-amber-200 bg-amber-50/50">
                  <p className="text-xs leading-relaxed text-amber-800">
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

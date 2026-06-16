import React from 'react';
import { Link } from 'react-router-dom';

const LayananKami = () => {
  const services = [
    {
      id: 1,
      title: 'Sewa Bus Pariwisata',
      icon: 'fa-bus',
      desc: 'Sewa bus pariwisata premium dengan driver profesional untuk kenyamanan perjalanan wisata rombongan Anda.',
      link: '/bus-wisata',
      highlighted: true,
    },
    {
      id: 2,
      title: 'Pricelist Tour',
      icon: 'fa-map-marked-alt',
      desc: 'Pilihan paket perjalanan wisata menarik dengan harga sewa terbaik, supir profesional, dan BBM gratis.',
      link: '/paket-wisata',
      highlighted: false,
    },
    {
      id: 3,
      title: 'Private Trip / Drop',
      icon: 'fa-car-side',
      desc: 'Layanan drop-off bandara, stasiun, hotel, atau perjalanan dinas luar kota dengan armada premium.',
      link: '/kontak',
      highlighted: false,
    },
    {
      id: 4,
      title: 'Antar Jemput Rombongan',
      icon: 'fa-users',
      desc: 'Layanan antar jemput rutin untuk karyawan kantor, ziarah keagamaan, pernikahan, atau rombongan khusus.',
      link: '/kontak',
      highlighted: false,
    },
    {
      id: 5,
      title: 'Travel Sekolah / Kampus',
      icon: 'fa-graduation-cap',
      desc: 'Solusi transportasi aman untuk study tour sekolah, kunjungan industri, outing, dan kegiatan mahasiswa.',
      link: '/kontak',
      highlighted: false,
    },
    {
      id: 6,
      title: 'Corporate Trip',
      icon: 'fa-briefcase',
      desc: 'Perjalanan bisnis, gathering perusahaan, outbound, rapat kerja, dan retreat karyawan dengan layanan profesional.',
      link: '/kontak',
      highlighted: false,
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#0B5CA8] font-bold text-xs uppercase tracking-widest bg-[#EAF6FF] px-4 py-2 rounded-full">
            Layanan Terbaik Kami
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10233F] mt-4">
            Solusi Perjalanan Terbaik Bersama Mafina Trans
          </h2>
          <div className="w-16 h-1 bg-[#FFD23F] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 border ${
                svc.highlighted
                  ? 'bg-[#073B78] text-white border-[#062D5F] shadow-xl shadow-[#073B78]/25'
                  : 'bg-white text-[#10233F] border-[#DDEAF6] shadow-md hover:shadow-xl'
              }`}
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner ${
                    svc.highlighted
                      ? 'bg-[#FFD23F] text-[#10233F]'
                      : 'bg-[#F3FAFF] text-[#073B78]'
                  }`}
                >
                  <i className={`fas ${svc.icon}`}></i>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${svc.highlighted ? 'text-white' : 'text-[#10233F]'}`}>
                  {svc.title}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-6 ${svc.highlighted ? 'text-white/80' : 'text-[#64748B]'}`}>
                  {svc.desc}
                </p>
              </div>

              <Link
                to={svc.link}
                className={`inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
                  svc.highlighted
                    ? 'text-[#FFD23F] hover:text-white'
                    : 'text-[#0B5CA8] hover:text-[#073B78]'
                }`}
              >
                Selengkapnya <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LayananKami;

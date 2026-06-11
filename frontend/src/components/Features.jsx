import React from 'react';

const Features = () => {
  const items = [
    {
      id: 1,
      title: 'Driver Profesional',
      icon: 'fa-user-tie',
      desc: 'Pengemudi handal, berpengalaman, ramah, dan berlisensi resmi siap mengawal kenyamanan dan keselamatan perjalanan Anda.',
      highlighted: false,
    },
    {
      id: 2,
      title: 'Armada Terawat',
      icon: 'fa-tools',
      desc: 'Seluruh unit bus pariwisata kami selalu dalam kondisi bersih, wangi, AC dingin, dan rutin diservis secara berkala.',
      highlighted: true,
    },
    {
      id: 3,
      title: 'Harga Transparan',
      icon: 'fa-wallet',
      desc: 'Penawaran harga jujur dan transparan tanpa ada biaya tambahan tersembunyi. Solusi hemat untuk rombongan Anda.',
      highlighted: false,
    },
    {
      id: 4,
      title: 'Layanan Responsif',
      icon: 'fa-headset',
      desc: 'Tim Customer Service kami siap melayani konsultasi rute, ketersediaan unit, hingga pemesanan dengan cepat dan responsif.',
      highlighted: false,
    },
    {
      id: 5,
      title: 'Penjemputan Fleksibel',
      icon: 'fa-map-pin',
      desc: 'Layanan penjemputan gratis untuk wilayah Kota Tangerang serta penjemputan fleksibel di Jabodetabek.',
      highlighted: true,
    },
    {
      id: 6,
      title: 'Cocok untuk Rombongan',
      icon: 'fa-bus-alt',
      desc: 'Pilihan kapasitas unit bervariasi mulai dari Hiace, Elf, Medium, hingga Big Bus yang ideal untuk rombongan pariwisata.',
      highlighted: false,
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-[#F3FAFF]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#0B5CA8] font-bold text-xs uppercase tracking-widest bg-[#EAF6FF] px-4 py-2 rounded-full">
            Keunggulan Kami
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10233F] mt-4">
            Mengapa Memilih Sewa Bus Mafina Trans?
          </h2>
          <div className="w-16 h-1 bg-[#FFD23F] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((feat) => (
            <div
              key={feat.id}
              className={`rounded-3xl p-8 transition-all duration-300 hover:scale-[1.03] border flex flex-col justify-between ${
                feat.highlighted
                  ? 'bg-[#073B78] text-white border-[#062D5F] shadow-lg shadow-[#073B78]/25'
                  : 'bg-white text-[#10233F] border-[#DDEAF6] shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm ${
                    feat.highlighted
                      ? 'bg-[#FFD23F] text-[#10233F]'
                      : 'bg-[#F3FAFF] text-[#073B78]'
                  }`}
                >
                  <i className={`fas ${feat.icon}`}></i>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${feat.highlighted ? 'text-white' : 'text-[#10233F]'}`}>
                  {feat.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${feat.highlighted ? 'text-white/80' : 'text-[#64748B]'}`}>
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
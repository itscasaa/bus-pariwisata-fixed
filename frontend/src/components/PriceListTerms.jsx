import React, { useState } from 'react';
import siteData from '../data/siteData';

const PriceListTerms = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const termsData = [
    {
      title: 'Harga & Biaya',
      icon: 'fas fa-money-bill-wave',
      items: [
        'Harga <strong>SUDAH TERMASUK</strong> biaya bahan bakar dan jasa supir.',
        'Harga <strong>BELUM TERMASUK</strong> biaya tol, parkir, makan kru, retribusi jalan, akomodasi/penginapan kru bus, serta TIP pengemudi dan asisten. Paket sewa bisa dibuat <strong>All In</strong> sesuai dengan kebutuhan perjalanan Anda.'
      ]
    },
    {
      title: 'Pembayaran & Pembatalan',
      icon: 'fas fa-credit-card',
      items: [
        'Pemesanan baru <strong>DIANGGAP SAH</strong> apabila sudah melakukan pembayaran uang muka (DP). Pembayaran uang muka minimum sebesar <strong>50%</strong> dari total harga sewa.',
        'Pembayaran sewa harus sudah dilunasi paling lambat <strong>3 hari sebelum keberangkatan</strong>.',
        'Uang sewa / DP yang telah dibayarkan <strong>tidak dapat dikembalikan</strong> apabila terjadi pembatalan sepihak dari pihak penyewa.',
        'Pembatalan sepihak dalam waktu <strong>3 hari sebelum keberangkatan</strong> dikenakan cancellation fee sebesar <strong>100%</strong> dari harga sewa.'
      ]
    },
    {
      title: 'Waktu Pemakaian',
      icon: 'fas fa-clock',
      items: [
        'Perhitungan penggunaan bus 1 hari adalah mulai pukul <strong>05.00</strong> sampai pukul <strong>23.00</strong>.',
        'Batas pemakaian bus dalam kota maksimum <strong>12 jam</strong>, terhitung mulai dari jam penjemputan.',
        'Batas pemakaian bus luar kota paling pagi pukul <strong>05.00</strong> sampai maksimum pukul <strong>23.00</strong>.',
        'Pemakaian melebihi 12 jam untuk dalam kota atau melebihi pukul 23.00 untuk luar kota dikenakan biaya tambahan (<strong>overtime charge</strong>) sesuai dengan tarif sewa yang berlaku.'
      ]
    },
    {
      title: 'Tanggung Jawab & Keamanan',
      icon: 'fas fa-shield-alt',
      items: [
        'Kehilangan barang berharga atau barang tertukar di dalam bus <strong>bukan tanggung jawab</strong> pengelola bus dan kru armada.',
        'Pengemudi berhak menolak melewati jalan yang dinilai tidak memadai, dilarang oleh petugas lalu lintas, atau membahayakan keselamatan penumpang dan armada.',
        'Penyewa bertanggung jawab penuh apabila terjadi kerusakan pada kendaraan/bus akibat dari kelalaian atau tindakan penyewa.'
      ]
    },
    {
      title: 'Area Penjemputan',
      icon: 'fas fa-map-marked-alt',
      items: [
        'Penjemputan untuk area di dalam wilayah <strong>Kota Tangerang GRATIS</strong> tanpa dikenakan biaya tambahan.',
        'Penjemputan untuk daerah Bekasi, Jakarta, Depok, Bogor, dan area lain di luar Tangerang dikenakan biaya tambahan (charge) sesuai dengan jarak penjemputan.'
      ]
    }
  ];

  return (
    <div className="mt-14 max-w-4xl mx-auto px-4 pb-16">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#10233F]">
          Syarat & Ketentuan Sewa Bus
        </h2>
        <p className="text-sm lg:text-base mt-2 text-[#64748B]">
          Harap membaca ketentuan berikut sebelum melakukan pemesanan armada Mafina Trans.
        </p>
        <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-[#0B5CA8]"></div>
      </div>

      {/* Accordion List */}
      <div className="bg-white border border-[#DDEAF6] rounded-3xl overflow-hidden shadow-sm divide-y divide-[#DDEAF6]">
        {termsData.map((section, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div key={idx} className="transition-all duration-200 border-[#DDEAF6]">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between px-6 py-4.5 text-left font-bold transition-all duration-200"
                style={{
                  color: isOpen ? '#0B5CA8' : '#10233F',
                  background: isOpen ? '#F3FAFF' : 'transparent'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg" style={{ color: isOpen ? '#0B5CA8' : '#64748B' }}>
                    <i className={section.icon}></i>
                  </span>
                  <span className="text-sm lg:text-base font-extrabold">{section.title}</span>
                </div>
                <span className={`transform transition-transform duration-200 text-sm ${isOpen ? 'rotate-180' : ''}`} style={{ color: isOpen ? '#0B5CA8' : '#64748B' }}>
                  <i className="fas fa-chevron-down"></i>
                </span>
              </button>

              <div
                className={`transition-all overflow-hidden duration-300 ${
                  isOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
                style={isOpen ? { borderTop: '1px solid #DDEAF6', background: '#FCFDFE' } : {}}
              >
                <div className="px-6 py-5">
                  <ul className="space-y-3.5">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex gap-2.5 items-start text-xs lg:text-sm leading-relaxed text-[#64748B]">
                        <span className="text-green-500 mt-1 flex-shrink-0">
                          <i className="fas fa-check-circle"></i>
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div
        className="mt-10 p-6 lg:p-8 rounded-3xl shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{ background: 'linear-gradient(135deg, #073B78 0%, #0B5CA8 100%)' }}
      >
        <div className="max-w-xl">
          <h3 className="font-extrabold text-lg lg:text-xl text-white">
            Butuh paket All In atau konsultasi harga?
          </h3>
          <p className="text-xs lg:text-sm mt-2 leading-relaxed text-white/80">
            Hubungi tim Mafina Trans untuk menyesuaikan kebutuhan perjalanan, titik penjemputan, dan estimasi biaya terbaik.
          </p>
        </div>
        <div className="flex-shrink-0">
          <a
            href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20konsultasi%20harga%20sewa%20bus%20pariwisata.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#FFD23F] hover:bg-[#F6B800] text-[#10233F] font-extrabold text-sm rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <i className="fab fa-whatsapp text-lg"></i>
            Konsultasi via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PriceListTerms;

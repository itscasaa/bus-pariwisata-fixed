import React from 'react';
import { Link } from 'react-router-dom';
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

const BusCard = ({ bus }) => {
  return (
    <div className="group bg-white border border-[#DDEAF6] shadow-sm hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <Link to={`/bus/${bus.id}`} className="aspect-[4/3] overflow-hidden relative bg-[#F3FAFF] block">
        <img
          src={bus.gambar_utama || bus.gambar}
          alt={bus.nama_bus}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = '/images/default-bus.jpg'; }}
        />
        {bus.diskon && (
          <div className="absolute top-4 right-4 bg-[#ba1a1a] text-white text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            Diskon {bus.diskon}
          </div>
        )}
      </Link>

      {/* Body */}
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
          <h3 className="font-extrabold text-[#10233F] text-base md:text-lg hover:text-[#0B5CA8] transition-colors duration-300 line-clamp-1 mb-3">
            {bus.nama_bus}
          </h3>
        </Link>

        {bus.fasilitas && bus.fasilitas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {bus.fasilitas.slice(0, 3).map((fac, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg flex items-center gap-1 bg-[#F3FAFF] text-[#64748B] border border-[#DDEAF6]"
              >
                <i className={`fas ${getFacilityIcon(fac)}`}></i>
                {fac}
              </span>
            ))}
            {bus.fasilitas.length > 3 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#EAF6FF] text-[#0B5CA8]">
                +{bus.fasilitas.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-[#DDEAF6]">
          <Link
            to={`/bus/${bus.id}`}
            className="font-bold text-xs py-2.5 rounded-xl text-center transition-all bg-[#F3FAFF] text-[#073B78] hover:bg-[#EAF6FF]"
          >
            Lihat Detail
          </Link>
          <a
            href={`https://wa.me/${siteData.whatsapp.number}?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20menanyakan%20sewa%20untuk%20armada%20${encodeURIComponent(bus.nama_bus)}%20kapasitas%20${bus.kapasitas}%20kursi${bus.diskon ? `%20dengan%20promo%20${encodeURIComponent(bus.diskon)}` : ''}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#128C7E] hover:bg-[#0b655b] text-white font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
          >
            <i className="fab fa-whatsapp text-base"></i>
            Pesan Bus
          </a>
        </div>
      </div>
    </div>
  );
};

export default BusCard;

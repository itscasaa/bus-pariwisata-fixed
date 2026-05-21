import React from 'react';
import siteData from '../data/siteData';
import { Link } from 'react-router-dom';

const Destinations = () => {
  return (
    <section className="py-16 lg:py-20 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Destinasi Populer
            </h2>
            <div className="w-16 h-1 bg-[var(--color-primary)] mt-2 rounded-full"></div>
          </div>
          <Link
            to="/paket-wisata"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-semibold text-sm flex items-center gap-1 transition-colors duration-200"
          >
            View All <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {siteData.destinations.map((dest, i) => (
            <div
              key={i}
              className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:text-[var(--color-primary)] transition-colors duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-base lg:text-lg">
                  {dest.name}
                </h3>
                <p className="text-white/80 text-xs">{dest.tours} tours</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
import React from 'react';
import siteData from '../data/siteData';

const PromoBanner = () => {
  return (
    <section className="py-16 lg:py-20 bg-white/80 backdrop-blur-md text-white">
      <div className="container mx-auto px-4">
        <div
          className="rounded-2xl overflow-hidden shadow-xl"
          style={{ backgroundColor: '#2d8ae0' }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-16 py-10 lg:py-14 gap-6">
            {/* Left */}
            <div className="text-center lg:text-left">
              <h3 className="text-white/90 text-lg font-semibold mb-1">
                {siteData.promo.title}
              </h3>
              <p className="text-white text-3xl lg:text-4xl font-extrabold">
                {siteData.promo.discount}
              </p>
            </div>

            {/* Center - Logo */}
            <div className="flex-shrink-0">
              <img
                src={siteData.promo.image}
                alt="Promo"
                className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white/60 object-cover shadow-lg bg-white"
              />
            </div>

            {/* Right */}
            <div>
              <button className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-[#2d8ae0] transition-all duration-300">
                {siteData.promo.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
import React from 'react';
import siteData from '../data/siteData';

const Partners = () => {
  return (
    <section className="py-16 lg:py-20 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Partner Kami
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Scrolling Partner Logos */}
        <div className="overflow-hidden">
          <div className="flex gap-8 lg:gap-12 animate-scroll">
            {/* Duplicate the list for seamless scroll */}
            {[...siteData.partners, ...siteData.partners].map((name, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-gray-100 hover:bg-primary/10 rounded-xl px-6 py-3 lg:px-8 lg:py-4 transition-all duration-300"
              >
                <span className="text-gray-600 font-semibold text-sm lg:text-base whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
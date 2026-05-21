import React from 'react';
import siteData from '../data/siteData';

const Features = () => {
  return (
    <section className="py-16 lg:py-20 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteData.features.map((feature, i) => (
            <div
              key={i}
              className="bg-white/50 border border-[var(--color-primary)]/20 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center backdrop-blur-md"
            >
              <div className="w-16 h-16 mb-6 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                <i className={`fas ${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[var(--color-primary)] transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
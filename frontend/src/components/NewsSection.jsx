import React from 'react';
import siteData from '../data/siteData';
import { Link } from 'react-router-dom';

const NewsSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              News & Info
            </h2>
            <div className="w-16 h-1 bg-[#1d6ec5] mt-2 rounded-full"></div>
          </div>
          <Link
            to="/news"
            className="text-[#1d6ec5] hover:text-blue-600 font-semibold text-sm flex items-center gap-1 transition-colors duration-200"
          >
            Read More <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {siteData.news.map((item, i) => (
            <div
              key={i}
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                  <i className="far fa-calendar-alt"></i>
                  {item.date}
                </p>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#1d6ec5] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
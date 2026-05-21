import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import siteData from '../data/siteData';

const Testimonials = () => {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Review Customer
          </h2>
          <div className="w-16 h-1 bg-[#1d6ec5] mx-auto mt-2 rounded-full"></div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {siteData.testimonials.map((test, i) => (
            <SwiperSlide key={i}>
              <div className="bg-gray-50 rounded-xl p-6 lg:p-8 shadow-md h-full">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#1d6ec5]/20 flex items-center justify-center text-[#1d6ec5] font-bold text-xl flex-shrink-0">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{test.name}</h4>
                    <p className="text-gray-500 text-sm">{test.role}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex text-[#1d6ec5] mb-3">
                  {[...Array(5)].map((_, s) => (
                    <i
                      key={s}
                      className={`fas fa-star ${
                        s < test.rating ? 'text-[#1d6ec5]' : 'text-gray-300'
                      } text-sm mr-0.5`}
                    ></i>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &ldquo;{test.text}&rdquo;
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
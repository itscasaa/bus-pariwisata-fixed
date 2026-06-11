import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import siteData from '../data/siteData';

const Testimonials = () => {
  const [useSwiper, setUseSwiper] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setUseSwiper(true);
      window.removeEventListener('scroll', handleScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timer = setTimeout(() => {
      setUseSwiper(true);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const renderStaticGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
      {siteData.testimonials.slice(0, 3).map((test, i) => (
        <div key={i} className="bg-white border border-[#DDEAF6] shadow-sm rounded-3xl p-6 lg:p-8 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
          <div>
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#EAF6FF] flex items-center justify-center text-[#073B78] font-extrabold text-xl flex-shrink-0 border border-[#DDEAF6] shadow-inner">
                {test.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-extrabold text-[#10233F]">{test.name}</h4>
                <p className="text-[#64748B] text-xs">{test.role}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex text-[#FFD23F] mb-4">
              {[...Array(5)].map((_, s) => (
                <i
                  key={s}
                  className={`fas fa-star ${
                    s < test.rating ? 'text-[#FFD23F]' : 'text-gray-200'
                  } text-sm mr-0.5`}
                ></i>
              ))}
            </div>

            {/* Text */}
            <p className="text-[#64748B] text-sm leading-relaxed italic">
              &ldquo;{test.text}&rdquo;
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 lg:py-20 bg-[#F3FAFF]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#0B5CA8] font-bold text-xs uppercase tracking-widest bg-[#EAF6FF] px-4 py-2 rounded-full">
            Testimoni
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#10233F] mt-4">
            Apa Kata Mereka?
          </h2>
          <div className="w-16 h-1 bg-[#FFD23F] mx-auto mt-3 rounded-full"></div>
        </div>

        {useSwiper ? (
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
                <div className="bg-white border border-[#DDEAF6] shadow-sm rounded-3xl p-6 lg:p-8 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
                  <div>
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-[#EAF6FF] flex items-center justify-center text-[#073B78] font-extrabold text-xl flex-shrink-0 border border-[#DDEAF6] shadow-inner">
                        {test.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#10233F]">{test.name}</h4>
                        <p className="text-[#64748B] text-xs">{test.role}</p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex text-[#FFD23F] mb-4">
                      {[...Array(5)].map((_, s) => (
                        <i
                          key={s}
                          className={`fas fa-star ${
                            s < test.rating ? 'text-[#FFD23F]' : 'text-gray-200'
                          } text-sm mr-0.5`}
                        ></i>
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-[#64748B] text-sm leading-relaxed italic">
                      &ldquo;{test.text}&rdquo;
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          renderStaticGrid()
        )}
      </div>
    </section>
  );
};

export default Testimonials;
import React, { useState, useEffect } from 'react';
import { API_PUB } from '../config/api';

const StatisticsCards = () => {
  const [stats, setStats] = useState({
    totalArmada: 0,
    totalDestinasi: 0,
    totalBerita: 0,
    totalFoto: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch buses count
        const busesRes = await fetch(`${API_PUB}/buses.php`);
        const busesData = await busesRes.json();
        const totalArmada = busesData.status === 'success' ? busesData.data.length : 0;

        // Fetch price list count
        const priceRes = await fetch(`${API_PUB}/price_list.php`);
        const priceData = await priceRes.json();
        const totalDestinasi = priceData.status === 'success' ? priceData.data.length : 0;

        // Fetch news count
        const newsRes = await fetch(`${API_PUB}/news.php`);
        const newsData = await newsRes.json();
        const totalBerita = newsData.status === 'success' ? newsData.data.length : 0;

        // Calculate total photos from buses
        let totalFoto = 0;
        if (busesData.status === 'success') {
          busesData.data.forEach(bus => {
            if (bus.images && Array.isArray(bus.images)) {
              totalFoto += bus.images.length;
            }
          });
        }

        setStats({
          totalArmada,
          totalDestinasi,
          totalBerita,
          totalFoto,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Armada',
      value: stats.totalArmada,
      icon: 'directions_bus',
      circleBg: 'bg-blue-600 text-white',
      circleTextColor: 'text-white',
      trend: '+12.5%',
      trendType: 'up',
    },
    {
      title: 'Total Destinasi',
      value: stats.totalDestinasi,
      icon: 'map',
      circleBg: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
      circleTextColor: 'text-slate-650',
      trend: '+3.2%',
      trendType: 'up',
    },
    {
      title: 'Total Berita',
      value: stats.totalBerita,
      icon: 'newspaper',
      circleBg: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
      circleTextColor: 'text-slate-650',
      trend: '-1.4%',
      trendType: 'down',
    },
    {
      title: 'Foto Fasilitas',
      value: stats.totalFoto,
      icon: 'photo_library',
      circleBg: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
      circleTextColor: 'text-slate-650',
      trend: '+15.7%',
      trendType: 'up',
    },
  ];

  if (loading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-zinc-200/60 p-6 rounded-[24px] animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="h-4 bg-slate-100 rounded w-24"></div>
              <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-8 bg-slate-100 rounded w-16 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-20"></div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const isUp = card.trendType === 'up';
        return (
          <div
            key={index}
            className="bg-white border border-zinc-200/60 p-6 rounded-[24px] hover:border-zinc-350 hover:shadow-custom transition-all duration-300 relative group flex flex-col justify-between"
            style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}
          >
            {/* Top row */}
            <div className="flex justify-between items-start mb-6">
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-wider">{card.title}</p>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${card.circleBg} ${card.circleTextColor}`}>
                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
              </div>
            </div>

            {/* Bottom row */}
            <div>
              <div className="flex items-baseline gap-2.5">
                <h3 className="text-4xl font-extrabold text-zinc-800 tracking-tight">{card.value}</h3>
                {card.trend && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${
                    isUp 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-red-50 text-red-650 border-red-100'
                  }`}>
                    <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'wght' 700" }}>
                      {isUp ? 'trending_up' : 'trending_down'}
                    </span>
                    {card.trend}
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-[11px] mt-2 font-medium">Bulan ini vs bulan lalu</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatisticsCards;

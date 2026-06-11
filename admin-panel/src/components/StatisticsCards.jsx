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
      color: 'primary',
      bgColor: 'bg-primary-container/10',
      textColor: 'text-primary',
      trend: '+12%',
    },
    {
      title: 'Total Destinasi',
      value: stats.totalDestinasi,
      icon: 'map',
      color: 'secondary',
      bgColor: 'bg-secondary-container/10',
      textColor: 'text-secondary',
    },
    {
      title: 'Total Berita',
      value: stats.totalBerita,
      icon: 'newspaper',
      color: 'tertiary',
      bgColor: 'bg-tertiary-fixed-dim/20',
      textColor: 'text-tertiary',
    },
    {
      title: 'Foto Fasilitas',
      value: stats.totalFoto,
      icon: 'photo_library',
      color: 'error',
      bgColor: 'bg-error-container/20',
      textColor: 'text-error',
    },
  ];

  if (loading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-card-gap">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-lowest p-unit-lg rounded-[24px] custom-shadow animate-pulse">
            <div className="h-12 w-12 bg-surface-container rounded-2xl mb-4"></div>
            <div className="h-4 bg-surface-container rounded w-24 mb-2"></div>
            <div className="h-8 bg-surface-container rounded w-16"></div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-card-gap">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-surface-container-lowest p-unit-lg rounded-[24px] custom-shadow hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-2xl flex items-center justify-center ${card.textColor}`}>
              <span className="material-symbols-outlined text-3xl">{card.icon}</span>
            </div>
            {card.trend && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {card.trend}
              </span>
            )}
          </div>
          <p className="text-outline text-label-sm uppercase tracking-wider">{card.title}</p>
          <h3 className="text-display-lg text-on-surface mt-1">{card.value}</h3>
        </div>
      ))}
    </section>
  );
};

export default StatisticsCards;

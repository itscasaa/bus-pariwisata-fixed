import React from 'react';

const StatisticsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Armada',
      value: stats.totalArmada,
      icon: 'directions_bus',
      bgColor: 'bg-primary-container/10',
      iconColor: 'text-primary',
      trend: '+12%',
      trendColor: 'text-primary',
    },
    {
      title: 'Total Destinasi',
      value: stats.totalDestinasi,
      icon: 'map',
      bgColor: 'bg-secondary-container/10',
      iconColor: 'text-secondary',
      trend: null,
      trendColor: '',
    },
    {
      title: 'Total Berita',
      value: stats.totalBerita,
      icon: 'newspaper',
      bgColor: 'bg-tertiary-fixed-dim/20',
      iconColor: 'text-tertiary',
      trend: null,
      trendColor: '',
    },
    {
      title: 'Foto Fasilitas',
      value: stats.totalFoto,
      icon: 'photo_library',
      bgColor: 'bg-error-container/20',
      iconColor: 'text-error',
      trend: null,
      trendColor: '',
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-card-gap">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-surface-container-lowest p-unit-lg rounded-[24px] custom-shadow hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
        >
          {/* Header with Icon & Trend */}
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-2xl flex items-center justify-center ${card.iconColor}`}>
              <span className="material-symbols-outlined text-3xl">{card.icon}</span>
            </div>
            {card.trend && (
              <span className={`text-xs font-bold ${card.trendColor} bg-primary/10 px-2 py-1 rounded-full`}>
                {card.trend}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="text-outline font-label-sm text-label-sm uppercase tracking-wider">
            {card.title}
          </p>

          {/* Value */}
          <h3 className="text-display-lg font-display-lg text-on-surface mt-1">
            {card.value}
          </h3>
        </div>
      ))}
    </section>
  );
};

export default StatisticsCards;

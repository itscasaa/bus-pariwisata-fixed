import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: 'add_circle',
      label: 'Tambah Armada',
      color: 'bg-primary text-white hover:bg-secondary-container',
      onClick: () => navigate('/armada/create'),
    },
    {
      icon: 'sell',
      label: 'Tambah Harga',
      color: 'bg-surface-container-low text-primary border border-outline-variant/30 hover:bg-surface-container',
      onClick: () => navigate('/price-list/create'),
    },
    {
      icon: 'post_add',
      label: 'Tambah Berita',
      color: 'bg-surface-container-low text-primary border border-outline-variant/30 hover:bg-surface-container',
      onClick: () => navigate('/news/create'),
    },
    {
      icon: 'rocket_launch',
      label: 'Lihat Website',
      color: 'bg-surface-container-low text-primary border border-outline-variant/30 hover:bg-surface-container',
      onClick: () => window.open('http://localhost/bus_pariwisata', '_blank'),
    },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-[24px] custom-shadow p-unit-lg">
      <h3 className="text-headline-sm text-on-surface mb-6">Aksi Cepat</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] transition-all hover:scale-105 active:scale-95 group ${action.color}`}
          >
            <span className={`material-symbols-outlined text-2xl transition-transform ${
              index === 0 ? 'group-hover:rotate-12' : 
              index === 2 ? 'group-hover:-rotate-12' : 
              index === 3 ? 'group-hover:translate-x-1' : 
              'group-hover:scale-110'
            }`}>
              {action.icon}
            </span>
            <span className="text-xs font-bold">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;

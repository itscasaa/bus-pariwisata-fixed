import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: 'add_circle',
      label: 'Tambah Armada',
      onClick: () => navigate('/admin/armada/create'),
      primary: true,
    },
    {
      icon: 'sell',
      label: 'Tambah Harga',
      onClick: () => navigate('/admin/price-list/create'),
      primary: false,
    },
    {
      icon: 'post_add',
      label: 'Tambah Berita',
      onClick: () => navigate('/admin/news/create'),
      primary: false,
    },
    {
      icon: 'rocket_launch',
      label: 'Lihat Website',
      onClick: () => window.open('/', '_blank'),
      primary: false,
    },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-[24px] custom-shadow p-unit-lg">
      <h3 className="text-headline-sm font-headline-sm text-on-surface mb-6">Aksi Cepat</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] transition-all hover:scale-105 active:scale-95 group ${
              action.primary
                ? 'bg-primary text-white hover:bg-secondary-container'
                : 'bg-surface-container-low text-primary border border-outline-variant/30 hover:bg-surface-container'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${
                action.primary ? 'group-hover:rotate-12' : 'group-hover:scale-110'
              } transition-transform`}
            >
              {action.icon}
            </span>
            <span className="text-xs font-bold text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;

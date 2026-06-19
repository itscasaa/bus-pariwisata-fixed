import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: 'add_circle',
      label: 'Tambah Armada',
      color: 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-550 shadow-sm',
      onClick: () => navigate('/armada/tambah'),
    },
    {
      icon: 'sell',
      label: 'Tambah Harga',
      color: 'bg-zinc-50 border border-zinc-200 text-zinc-750 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm',
      onClick: () => navigate('/price-list/tambah'),
    },
    {
      icon: 'post_add',
      label: 'Tambah Berita',
      color: 'bg-zinc-50 border border-zinc-200 text-zinc-750 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm',
      onClick: () => navigate('/news/tambah'),
    },
    {
      icon: 'rocket_launch',
      label: 'Lihat Website',
      color: 'bg-zinc-50 border border-zinc-200 text-zinc-750 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm',
      onClick: () => window.open('https://mafinatrans.duckdns.org', '_blank'),
    },
  ];

  return (
    <section className="bg-white border border-zinc-200/60 rounded-[24px] p-6" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)' }}>
      <h3 className="text-lg font-black text-zinc-800 mb-6">Aksi Cepat</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-[20px] transition-all hover:scale-105 active:scale-95 group cursor-pointer font-bold ${action.color}`}
          >
            <span className={`material-symbols-outlined text-2xl transition-transform ${
              index === 0 ? 'group-hover:rotate-12' : 
              index === 2 ? 'group-hover:-rotate-12' : 
              index === 3 ? 'group-hover:translate-x-1' : 
              'group-hover:scale-110'
            }`}>
              {action.icon}
            </span>
            <span className="text-xs">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;

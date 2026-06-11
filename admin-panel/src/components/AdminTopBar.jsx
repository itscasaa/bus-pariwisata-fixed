import React, { useState, useEffect } from 'react';

const AdminTopBar = () => {
  const [currentDate, setCurrentDate] = useState('');
  const adminUser = localStorage.getItem('admin_nama') || 'Admin User';

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      setCurrentDate(now.toLocaleDateString('id-ID', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center w-full pt-unit-lg px-unit-xl bg-transparent">
      <div>
        <h2 className="text-headline-md font-black text-on-surface">Dashboard Utama</h2>
        <p className="text-body-md text-outline">{currentDate || 'Loading date...'}</p>
      </div>

      <div className="flex items-center gap-unit-lg">
        {/* Search Bar (hidden on mobile) */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Cari data armada..."
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-primary text-body-md"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
            <div className="text-right">
              <p className="text-label-sm font-bold text-on-surface">{adminUser}</p>
              <p className="text-label-sm text-outline">Super Admin</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminUser)}&background=4f46e5&color=fff&size=128`}
              alt="Admin User Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-container"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;

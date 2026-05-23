import React, { useState } from 'react';

const AdminTopBar = ({ currentDateTime }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <header className="flex justify-between items-center w-full pt-unit-lg px-unit-xl bg-transparent border-b border-outline-variant/10">
      {/* Left Section: Title & Date */}
      <div>
        <h2 className="font-headline-md text-headline-md font-black text-on-surface">
          Dashboard Utama
        </h2>
        <p className="font-body-md text-body-md text-outline">
          {formatDateTime(currentDateTime)}
        </p>
      </div>

      {/* Right Section: Search, Notifications, Profile */}
      <div className="flex items-center gap-unit-lg">
        {/* Search Bar (Hidden on Mobile) */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari data armada..."
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-primary text-body-md outline-none transition-all"
          />
        </div>

        {/* Notification & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
            <div className="text-right hidden sm:block">
              <p className="font-label-sm text-label-sm font-bold text-on-surface">
                Admin User
              </p>
              <p className="font-label-sm text-label-sm text-outline">Super Admin</p>
            </div>
            <img
              alt="Admin User Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP74OrvHF3EAYhL2RtXdePICybbGXDapLrMV1wstL0336ty_NuBK3dR1Z67T69bRTBnRYeVtO1aZCOlPCuZAr_5RXoosIkZ8VSLok9Z1hIUITMxcH-wcosua9Td-Tj8CX-X4j3hzKpgo6oi0vJsvkXoeH_LpE3hyH-LOBMeXX1i8lSV9YKMr6MvFSjnqP8RHwy1THTpsuNoOvn0HRnXHPa15FU_-0ZKmWty5Xr-6vKPhoOCHez4CSW_Dedyb9ViLo352BhXTz3vTg"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;

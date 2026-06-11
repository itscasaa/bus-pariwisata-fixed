import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './Admin/AdminSidebar';
import AdminTopBar from './Admin/AdminTopBar';
import StatisticsCards from './Admin/StatisticsCards';
import ArmadaTable from './Admin/ArmadaTable';
import QuickActions from './Admin/QuickActions';
import BeritaTerbaru from './Admin/BeritaTerbaru';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalArmada: 24,
    totalDestinasi: 156,
    totalBerita: 42,
    totalFoto: 89,
  });

  useEffect(() => {
    // Inject Material Symbols stylesheet dynamically to optimize public landing page load
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    document.head.appendChild(link);

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-surface dark:bg-surface-container">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="ml-sidebar-width min-h-screen w-full">
        {/* Top Bar */}
        <AdminTopBar currentDateTime={currentDateTime} />

        {/* Main Content Area */}
        <main className="p-unit-xl space-y-gutter">
          {/* Statistics Cards */}
          <StatisticsCards stats={stats} />

          {/* Bottom Layout: Armada List & Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
            {/* Armada Bus Panel */}
            <ArmadaTable />

            {/* Right Column */}
            <div className="space-y-card-gap">
              {/* Quick Actions */}
              <QuickActions />

              {/* Berita Terbaru */}
              <BeritaTerbaru />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

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

  // Update date time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
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

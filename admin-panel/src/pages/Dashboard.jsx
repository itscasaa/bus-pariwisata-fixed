import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopBar from '../components/AdminTopBar';
import StatisticsCards from '../components/StatisticsCards';
import ArmadaTable from '../components/ArmadaTable';
import QuickActions from '../components/QuickActions';
import BeritaTerbaru from '../components/BeritaTerbaru';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-sidebar-width flex-1 min-h-screen">
        {/* Top Bar */}
        <AdminTopBar />

        {/* Main Content Area */}
        <main className="p-unit-xl space-y-gutter">
          {/* Statistics Cards */}
          <StatisticsCards />

          {/* Bottom Layout: Armada Table & Right Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
            {/* Armada Table (2 columns on large screens) */}
            <ArmadaTable />

            {/* Right Sidebar (1 column on large screens) */}
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

export default Dashboard;

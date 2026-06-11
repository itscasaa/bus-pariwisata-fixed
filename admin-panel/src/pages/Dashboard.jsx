import React from 'react';
import PageHeader from '../components/PageHeader';
import StatisticsCards from '../components/StatisticsCards';
import ArmadaTable from '../components/ArmadaTable';
import QuickActions from '../components/QuickActions';
import BeritaTerbaru from '../components/BeritaTerbaru';

const Dashboard = () => {
  return (
    <main className="flex-1 p-4 lg:p-unit-xl space-y-6">
      <PageHeader title="Dashboard" subtitle="Ringkasan data operasional Mafina Trans" />

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Bottom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Armada Table (spans 2 cols) */}
        <ArmadaTable />

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <BeritaTerbaru />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;


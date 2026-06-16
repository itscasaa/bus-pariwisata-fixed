import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Destinations from './components/Destinations';
import PromoBanner from './components/PromoBanner'; // Static import because it is small and has CTA
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import API_BASE from './config/api';
import MaintenancePage from './components/MaintenancePage';

// Below-the-fold homepage components (Lazy loaded)
const BusFleet = lazy(() => import('./components/BusFleet'));
const DiscountSection = lazy(() => import('./components/DiscountSection'));
const NewsSection = lazy(() => import('./components/NewsSection'));
const ContactCTA = lazy(() => import('./components/ContactCTA'));
const Testimonials = lazy(() => import('./components/Testimonials'));

// Lazy load non-homepage page components
const PriceListPage = lazy(() => import('./components/PriceListPage'));
const DiscountPage = lazy(() => import('./components/DiscountPage'));
const NewsPage = lazy(() => import('./components/NewsPage'));
const BusDetailPage = lazy(() => import('./components/BusDetailPage'));
const ArmadaPage = lazy(() => import('./components/ArmadaPage'));
const KontakPage = lazy(() => import('./components/KontakPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const HomePage = () => (
  <>
    <Hero />
    <Features />
    <Destinations />
    <Suspense fallback={<div className="py-12 text-center text-gray-500">Memuat armada...</div>}>
      <BusFleet />
    </Suspense>
    <Suspense fallback={<div className="py-12 text-center text-gray-500">Memuat promo...</div>}>
      <DiscountSection />
    </Suspense>
    <PromoBanner />
    <Suspense fallback={<div className="py-12 text-center text-gray-500">Memuat berita...</div>}>
      <NewsSection />
    </Suspense>
    <Suspense fallback={<div className="py-12 text-center text-gray-500">Memuat kontak...</div>}>
      <ContactCTA />
    </Suspense>
    <Suspense fallback={<div className="py-12 text-center text-gray-500">Memuat testimoni...</div>}>
      <Testimonials />
    </Suspense>
  </>
);

const App = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the current route is an admin page to allow admin access
    const isAdminPath = window.location.pathname.startsWith('/admin');
    if (isAdminPath) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/settings.php`)
      .then(res => {
        if (!res.ok) throw new Error('Network response error');
        return res.json();
      })
      .then(res => {
        if (res.status === 'success' && res.data && res.data.maintenance_mode) {
          setMaintenance(true);
          setMaintenanceMessage(res.data.maintenance_message);
        }
      })
      .catch(err => {
        console.error('Error fetching maintenance settings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf8ff]">
        <div className="w-10 h-10 border-4 border-[#3525cd] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (maintenance) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Suspense fallback={null}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/price-list" element={<PriceListPage />} />
                  <Route path="/bus-wisata" element={<ArmadaPage />} />
                  <Route path="/armada" element={<ArmadaPage />} />
                  <Route path="/discount" element={<DiscountPage />} />
                  <Route path="/diskon" element={<DiscountPage />} />
                  <Route path="/paket-wisata" element={<DiscountPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/kontak" element={<KontakPage />} />
                  <Route path="/bus/:id" element={<BusDetailPage />} />
                </Routes>
                <Footer />
                <WhatsAppButton />
              </>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
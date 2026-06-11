import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Destinations from './components/Destinations';
import PromoBanner from './components/PromoBanner'; // Static import because it is small and has CTA
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Below-the-fold homepage components (Lazy loaded)
const BusFleet = lazy(() => import('./components/BusFleet'));
const TourPackages = lazy(() => import('./components/TourPackages'));
const NewsSection = lazy(() => import('./components/NewsSection'));
const ContactCTA = lazy(() => import('./components/ContactCTA'));
const Testimonials = lazy(() => import('./components/Testimonials'));

// Lazy load non-homepage page components
const PriceListPage = lazy(() => import('./components/PriceListPage'));
const PaketWisataPage = lazy(() => import('./components/PaketWisataPage'));
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
    <Suspense fallback={<div className="py-12 text-center text-gray-500">Memuat paket...</div>}>
      <TourPackages />
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
                  <Route path="/paket-wisata" element={<PaketWisataPage />} />
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
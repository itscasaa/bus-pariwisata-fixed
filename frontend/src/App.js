import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Destinations from './components/Destinations';
import BusFleet from './components/BusFleet';
import PromoBanner from './components/PromoBanner';
import TourPackages from './components/TourPackages';
import Testimonials from './components/Testimonials';
import PriceListPage from './components/PriceListPage';
import PaketWisataPage from './components/PaketWisataPage';
import NewsPage from './components/NewsPage';
import BusDetailPage from './components/BusDetailPage';
import ArmadaPage from './components/ArmadaPage';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/AdminDashboard';

const HomePage = () => (
  <>
    <Hero />
    <Features />
    <Destinations />
    <BusFleet />
    <PromoBanner />
    <TourPackages />
    <Testimonials />
  </>
);

const App = () => {
  return (
    <div className="min-h-screen bg-white">
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
                <Route path="/paket-wisata" element={<PaketWisataPage />} />
                <Route path="/news" element={<NewsPage />} />
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
    </div>
  );
};

export default App;
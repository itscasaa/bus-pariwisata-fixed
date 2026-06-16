import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Armada from './pages/Armada';
import { TambahArmada, EditArmada } from './pages/TambahArmada';
import PriceList from './pages/PriceList';
import { TambahHarga, EditHarga } from './pages/TambahHarga';
import Discount, { TambahDiscount, EditDiscount } from './pages/Discount';
import News, { TambahNews, EditNews } from './pages/News';
import ArmadaGallery from './pages/ArmadaGallery';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('admin_token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('admin_token');
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const App = () => {
  return (
    <div className="min-h-screen bg-[#fcf8ff]">
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          
          <Route path="armada" element={<Armada />} />
          <Route path="armada/tambah" element={<TambahArmada />} />
          <Route path="armada/edit/:id" element={<EditArmada />} />
          <Route path="armada/:id/images" element={<ArmadaGallery />} />
          
          <Route path="price-list" element={<PriceList />} />
          <Route path="price-list/tambah" element={<TambahHarga />} />
          <Route path="price-list/edit/:id" element={<EditHarga />} />
          
          <Route path="discount" element={<Discount />} />
          <Route path="discount/tambah" element={<TambahDiscount />} />
          <Route path="discount/edit/:id" element={<EditDiscount />} />
          
          <Route path="news" element={<News />} />
          <Route path="news/tambah" element={<TambahNews />} />
          <Route path="news/edit/:id" element={<EditNews />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;


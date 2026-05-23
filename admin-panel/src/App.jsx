import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Armada from './pages/Armada';
import { TambahArmada } from './pages/TambahArmada';
import { EditArmada } from './pages/TambahArmada';
import PriceList from './pages/PriceList';
import { TambahHarga } from './pages/TambahHarga';
import { EditHarga } from './pages/TambahHarga';
import News from './pages/News';
import { TambahNews } from './pages/News';
import { EditNews } from './pages/News';
import Login from './pages/Login';
import './index.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="armada" element={<Armada />} />
          <Route path="armada/tambah" element={<TambahArmada />} />
          <Route path="armada/edit/:id" element={<EditArmada />} />
          <Route path="price-list" element={<PriceList />} />
          <Route path="price-list/tambah" element={<TambahHarga />} />
          <Route path="price-list/edit/:id" element={<EditHarga />} />
          <Route path="news" element={<News />} />
          <Route path="news/tambah" element={<TambahNews />} />
          <Route path="news/edit/:id" element={<EditNews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

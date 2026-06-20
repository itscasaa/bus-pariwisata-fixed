import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ADM } from '../config/api';
import logoImg from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_ADM}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        localStorage.setItem('admin_token', data.data.token);
        localStorage.setItem('admin_nama', data.data.nama || 'Administrator');
        navigate('/', { replace: true });
      } else {
        setError(data.message || 'Username atau password salah');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 bg-[#090d16] font-sans relative overflow-hidden">
      
      {/* Global Background Glow Ornaments */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[260px] h-[260px] rounded-full bg-yellow-500/5 blur-[80px] pointer-events-none" />
      
      <div 
        className="w-full max-w-[1000px] bg-[#111827]/90 backdrop-blur-md rounded-[32px] overflow-hidden flex flex-col lg:flex-row border border-zinc-800/80 shadow-2xl lg:min-h-[600px] relative z-10"
        style={{
          boxShadow: '0 0 50px -10px rgba(37, 99, 235, 0.12), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        
        {/* Left Column: Premium Visual Card (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 30% 20%, #1e40af 0%, #073b78 50%, #090d16 100%)'
          }}
        >
          {/* Subtle background overlay details */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Glowing blur effects */}
          <div className="absolute top-1/4 left-1/4 w-[160px] h-[160px] rounded-full bg-blue-500/20 blur-[60px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[140px] h-[140px] rounded-full bg-yellow-500/10 blur-[50px]" />


          {/* Vertical light-beam lines ornament covering the entire left card */}
          <div className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 100%)',
              maskImage: 'linear-gradient(to right, black 1px, transparent 1px)',
              WebkitMaskImage: 'linear-gradient(to right, black 1px, transparent 1px)',
              maskSize: '16px 100%',
              WebkitMaskSize: '16px 100%',
            }}
          />

          {/* Logo brand at the top */}
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img src={logoImg} alt="Mafina Trans Logo" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <span className="font-extrabold text-white text-lg tracking-wider">MAFINA TRANS</span>
          </div>

          {/* Visual tag & title at the bottom */}
          <div className="z-10 text-left">
            <span className="bg-blue-600/35 border border-blue-400/30 text-blue-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3.5">
              Portal Admin
            </span>
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Sewa Bus Pariwisata<br />Terpercaya & Nyaman
            </h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              Kelola armada, harga sewa, paket wisata, dan berita terbaru Mafina Trans dengan sistem dasbor admin terpusat.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 py-10 px-6 lg:p-14 flex flex-col justify-center bg-[#111827]/80 relative overflow-hidden">
          
          {/* Vertical light-beam lines ornament covering the entire card background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0.02) 100%)',
              maskImage: 'linear-gradient(to right, black 1px, transparent 1px)',
              WebkitMaskImage: 'linear-gradient(to right, black 1px, transparent 1px)',
              maskSize: '14px 100%',
              WebkitMaskSize: '14px 100%',
            }}
          />
          {/* Radial highlight in center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full bg-blue-500/10 blur-[50px] pointer-events-none" />

          {/* Header on mobile view (shows logo since left card is hidden) */}
          <div className="lg:hidden flex flex-col items-center mb-8 text-center relative pt-8 pb-4">
            <div className="w-16 h-16 flex items-center justify-center mb-3 overflow-hidden z-10">
              <img src={logoImg} alt="Mafina Trans Logo" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.6))' }} />
            </div>
            <h1 className="font-black text-white text-xl tracking-wide z-10">MAFINA TRANS</h1>
            <p className="text-zinc-500 text-xs mt-0.5 z-10">Admin Dashboard</p>
          </div>

          <div className="text-left mb-8 hidden lg:block">
            <h2 className="text-2xl font-black text-white tracking-tight">Selamat Datang</h2>
            <p className="text-zinc-400 text-sm mt-1.5 font-medium">Silakan login untuk melanjutkan ke panel admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left z-10">
            {/* Username */}
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  style={{ fontSize: '20px' }}>person</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full pl-11 pr-4 py-3 bg-[#1f2937] border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  style={{ fontSize: '20px' }}>lock</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full pl-11 pr-4 py-3 bg-[#1f2937] border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border"
                style={{ background: '#fef2f210', color: '#f87171', borderColor: '#f8717130', fontSize: '13px', fontWeight: '500' }}>
                <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>error</span>
                <div>{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] border-none shadow-lg cursor-pointer bg-blue-600 hover:bg-blue-700 text-sm"
              style={{
                background: loading ? '#2563eb80' : 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 hidden lg:block">
            <p style={{ fontSize: '11px', color: '#6b7280' }}>
              © 2026 Mafina Trans. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

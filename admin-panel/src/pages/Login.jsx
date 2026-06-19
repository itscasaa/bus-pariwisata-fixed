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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo Card */}
        <div className="bg-white rounded-[24px] p-8 mb-5 text-center shadow-custom">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-200/60 shadow-sm p-2 overflow-hidden">
            <img src={logoImg} alt="Mafina Trans Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-bold text-blue-600 mb-1" style={{ fontSize: '22px' }}>Mafina Trans</h1>
          <p className="text-zinc-500 font-semibold" style={{ fontSize: '13px' }}>Admin Dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-[24px] p-8 shadow-custom border border-zinc-200/40">
          <h2 className="font-bold text-zinc-800 mb-1" style={{ fontSize: '20px' }}>Selamat Datang</h2>
          <p className="text-zinc-400 mb-6 font-semibold" style={{ fontSize: '13px' }}>Silakan login untuk melanjutkan</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-zinc-500 uppercase mb-2 font-bold"
                style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  style={{ fontSize: '20px' }}>person</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all rounded-xl text-zinc-700 placeholder-zinc-400 focus:outline-none"
                  style={{ fontSize: '14px' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-zinc-500 uppercase mb-2 font-bold"
                style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  style={{ fontSize: '20px' }}>lock</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all rounded-xl text-zinc-700 placeholder-zinc-400 focus:outline-none"
                  style={{ fontSize: '14px' }}
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', fontSize: '13px', fontWeight: '500' }}>
                <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] border-none shadow-sm cursor-pointer"
              style={{
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
                fontSize: '14px',
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
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-5 text-center p-3 rounded-xl bg-blue-50/70 border border-blue-100/50">
            <p style={{ fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>
              Default: <span className="font-bold text-blue-600">admin</span>
              {' / '}
              <span className="font-bold text-blue-600">admin123</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-5">
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            © 2025 Mafina Trans. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config/api';

const AdminLogin = () => {
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

    // Normalize endpoint URL (replace /api at the end of API_BASE with /admin/api/login.php)
    const adminApiUrl = `${API_BASE.replace(/\/api$/, '')}/admin/api/login.php`;

    try {
      const response = await fetch(adminApiUrl, {
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
        navigate('/admin/dashboard', { replace: true });
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
      style={{ background: 'linear-gradient(135deg, #062D5F 0%, #041E42 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo Card */}
        <div className="bg-white rounded-[24px] p-8 mb-5 text-center shadow-lg">
          <div className="w-16 h-16 bg-[#062D5F] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-200 shadow-sm p-2 text-white text-2xl">
            <i className="fas fa-bus"></i>
          </div>
          <h1 className="font-bold text-[#062D5F] mb-1 text-2xl">Mafina Trans</h1>
          <p className="text-zinc-500 font-semibold text-sm">Portal Admin</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-[24px] p-8 shadow-lg border border-zinc-200/40">
          <h2 className="font-bold text-zinc-800 mb-1 text-xl">Selamat Datang</h2>
          <p className="text-zinc-400 mb-6 font-semibold text-sm">Silakan login untuk melanjutkan</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-zinc-500 uppercase mb-2 font-bold text-xs">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-[#0B5CA8] focus:ring-1 focus:ring-[#0B5CA8]/20 transition-all rounded-xl text-zinc-700 placeholder-zinc-400 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-zinc-500 uppercase mb-2 font-bold text-xs">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-[#0B5CA8] focus:ring-1 focus:ring-[#0B5CA8]/20 transition-all rounded-xl text-zinc-700 placeholder-zinc-400 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] border-none shadow-sm cursor-pointer"
              style={{
                background: loading ? '#93c5fd' : '#0B5CA8',
                fontSize: '14px',
              }}
            >
              {loading ? 'Memverifikasi...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

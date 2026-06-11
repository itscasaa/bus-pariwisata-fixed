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
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #3525cd 0%, #4e45d5 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo Card */}
        <div className="bg-surface-container-lowest rounded-[24px] p-8 mb-5 text-center"
          style={{ boxShadow: '0px 20px 50px rgba(0,0,0,0.12)' }}>
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg p-2 overflow-hidden">
            <img src={logoImg} alt="Mafina Trans Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-bold text-primary mb-1" style={{ fontSize: '22px' }}>Mafina Trans</h1>
          <p className="text-outline" style={{ fontSize: '14px' }}>Admin Dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-surface-container-lowest rounded-[24px] p-8"
          style={{ boxShadow: '0px 20px 50px rgba(0,0,0,0.12)' }}>
          <h2 className="font-bold text-on-surface mb-1" style={{ fontSize: '20px' }}>Selamat Datang</h2>
          <p className="text-outline mb-6" style={{ fontSize: '14px' }}>Silakan login untuk melanjutkan</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-outline uppercase mb-2"
                style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.05em' }}>
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                  style={{ fontSize: '20px' }}>person</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-on-surface"
                  style={{
                    background: '#f5f2ff',
                    border: 'none',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.boxShadow = '0 0 0 2px #3525cd'}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-outline uppercase mb-2"
                style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.05em' }}>
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                  style={{ fontSize: '20px' }}>lock</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-on-surface"
                  style={{
                    background: '#f5f2ff',
                    border: 'none',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.boxShadow = '0 0 0 2px #3525cd'}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ background: '#ffdad6', color: '#ba1a1a', fontSize: '14px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              style={{
                background: loading ? '#7c6fcd' : 'linear-gradient(135deg, #3525cd, #4e45d5)',
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
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
          <div className="mt-5 text-center p-3 rounded-xl" style={{ background: '#f5f2ff' }}>
            <p style={{ fontSize: '12px', color: '#777587' }}>
              Default: <span className="font-bold" style={{ color: '#3525cd' }}>admin</span>
              {' / '}
              <span className="font-bold" style={{ color: '#3525cd' }}>admin123</span>
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

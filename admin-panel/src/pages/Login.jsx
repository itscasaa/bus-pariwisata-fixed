import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TODO: Implement real authentication with PHP backend
    // For now, simple validation
    if (formData.username === 'admin' && formData.password === 'admin123') {
      // Simulate API call delay
      setTimeout(() => {
        localStorage.setItem('admin_token', 'dummy_token');
        navigate('/dashboard');
      }, 1000);
    } else {
      setTimeout(() => {
        setError('Username atau password salah');
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Card */}
        <div className="bg-surface-container-lowest rounded-[24px] custom-shadow-lg p-8 mb-6 text-center">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl">directions_bus</span>
          </div>
          <h1 className="text-headline-md font-bold text-primary mb-1">Surya Tour Trans</h1>
          <p className="text-body-md text-outline">Admin Dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-surface-container-lowest rounded-[24px] custom-shadow-lg p-8">
          <h2 className="text-headline-sm font-bold text-on-surface mb-2">Selamat Datang</h2>
          <p className="text-body-md text-outline mb-6">Silakan login untuk melanjutkan</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-label-sm text-outline uppercase mb-2">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                  person
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md text-on-surface"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-label-sm text-outline uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-body-md text-on-surface"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-container text-error px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                <span className="text-body-md">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 text-center">
            <p className="text-label-sm text-outline">
              Default: <span className="font-bold text-primary">admin</span> / <span className="font-bold text-primary">admin123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-body-md text-white/80">
            © 2025 Surya Tour Trans. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

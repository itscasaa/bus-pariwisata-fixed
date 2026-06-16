import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import siteData from '../data/siteData';
import API_BASE from '../config/api';

const KontakPage = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    judul: '',
    pesan: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    // Simple client-side validation
    if (!formData.nama || !formData.email || !formData.judul || !formData.pesan) {
      setError('Semua field wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setSuccess('Terima kasih! Pesan Anda berhasil dikirim dan akan segera kami proses.');
        setFormData({
          nama: '',
          email: '',
          judul: '',
          pesan: '',
        });
      } else {
        setError(data.message || 'Gagal mengirim pesan. Silakan coba kembali.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Silakan hubungi kami langsung via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  // Format WhatsApp Link
  const waUrl = `https://wa.me/${siteData.whatsapp.number}?text=${encodeURIComponent(
    'Halo Mafina Trans, saya ingin bertanya tentang sewa bus pariwisata.'
  )}`;

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* ===== HERO BANNER ===== */}
      <div className="relative text-white py-28 md:py-36 overflow-hidden text-center bg-[#062D5F]">
        {/* Background Image */}
        <img 
          src="/images/kontakperson.webp" 
          alt="Kontak Kami Banner" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: 'center', zIndex: 1 }}
        />
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: 'linear-gradient(180deg, rgba(6, 45, 95, 0.82) 0%, rgba(4, 30, 66, 0.92) 100%)',
            zIndex: 2
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,210,63,0.1),transparent)] pointer-events-none" style={{ zIndex: 3 }}></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">Kontak Kami</h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-0">
            Hubungi Mafina Trans untuk konsultasi perjalanan, pemesanan bus pariwisata, atau informasi promo terbaru untuk kebutuhan Anda.
          </p>
        </div>
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <section className="py-16 bg-transparent min-h-[60vh]">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CONTACT DETAILS & CTAs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#DDEAF6] p-6 lg:p-8 rounded-3xl space-y-6 shadow-sm">
                <h2 className="text-xl font-extrabold pb-3 border-b border-[#DDEAF6] text-[#10233F]">
                  Informasi Kontak
                </h2>

                {/* WhatsApp / Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 bg-[#F3FAFF] text-[#0B5CA8]">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                      WhatsApp / Telepon
                    </h3>
                    <p className="font-extrabold mt-0.5 text-[#10233F] text-base">
                      <a href={`tel:${siteData.footer.contact.phone.replace(/[^0-9]/g, '')}`} className="hover:text-[#0B5CA8] transition">
                        {siteData.footer.contact.phone}
                      </a>
                    </p>
                    <p className="text-xs mt-0.5 text-[#64748B]">
                      Hubungi WA: <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-semibold">{siteData.footer.contact.phone}</a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 bg-[#F3FAFF] text-[#0B5CA8]">
                    <i className="far fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                      Email Resmi
                    </h3>
                    <p className="font-extrabold mt-0.5 text-[#10233F] text-base">
                      <a href={`mailto:${siteData.footer.contact.email}`} className="hover:text-[#0B5CA8] transition underline">
                        {siteData.footer.contact.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Office Location */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 bg-[#F3FAFF] text-[#0B5CA8]">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                      Alamat Kantor
                    </h3>
                    <p className="font-semibold mt-0.5 text-[#10233F]">
                      {siteData.footer.contact.address}, Banten, Indonesia
                    </p>
                  </div>
                </div>

                {/* Operational Hours */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 bg-[#F3FAFF] text-[#0B5CA8]">
                    <i className="far fa-clock"></i>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                      Jam Operasional
                    </h3>
                    <p className="font-extrabold mt-0.5 text-[#10233F]">
                      Senin - Minggu
                    </p>
                    <p className="text-xs mt-0.5 text-[#64748B]">
                      08.00 - 22.00 WIB
                    </p>
                  </div>
                </div>
              </div>

              {/* QUICK CTAs CARD */}
              <div className="bg-white border border-[#DDEAF6] p-6 lg:p-8 rounded-3xl space-y-4 shadow-sm">
                <h2 className="text-lg font-extrabold pb-3 border-b border-[#DDEAF6] text-[#10233F]">
                  Tautan Cepat
                </h2>
                <div className="flex flex-col gap-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#0b655b] text-white font-extrabold py-3.5 px-4 rounded-2xl transition shadow-sm text-sm"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    Chat WhatsApp Sekarang
                  </a>
                  
                  <Link
                    to="/paket-wisata"
                    className="flex items-center justify-center gap-2 font-extrabold py-3 px-4 rounded-2xl border border-[#DDEAF6] hover:border-[#0B5CA8] text-[#0B5CA8] hover:bg-[#F3FAFF] transition text-sm"
                  >
                    <i className="fas fa-tags"></i>
                    Lihat Pricelist Tour
                  </Link>

                  <Link
                    to="/bus-wisata"
                    className="flex items-center justify-center gap-2 font-extrabold py-3 px-4 rounded-2xl border border-[#DDEAF6] hover:border-[#0B5CA8] text-[#0B5CA8] hover:bg-[#F3FAFF] transition text-sm"
                  >
                    <i className="fas fa-bus"></i>
                    Lihat Armada Bus
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#DDEAF6] p-6 lg:p-8 rounded-3xl shadow-sm">
                <h2 className="text-2xl font-extrabold mb-2 text-[#10233F]">
                  Kirim Pesan
                </h2>
                <p className="text-sm mb-6 text-[#64748B]">
                  Punya pertanyaan atau ingin sewa bus pariwisata? Silakan isi form di bawah ini, tim kami akan merespons dalam waktu singkat.
                </p>

                {/* Alerts */}
                {success && (
                  <div className="flex gap-3 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-6 text-sm items-start">
                    <i className="fas fa-check-circle text-lg text-[#128C7E] mt-0.5 flex-shrink-0"></i>
                    <div>{success}</div>
                  </div>
                )}

                {error && (
                  <div className="flex gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 text-sm items-start">
                    <i className="fas fa-exclamation-circle text-lg text-red-500 mt-0.5 flex-shrink-0"></i>
                    <div>{error}</div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="nama" className="text-sm font-semibold text-[#64748B]">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        placeholder="Masukkan nama Anda"
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDEAF6] focus:border-[#0B5CA8] focus:ring-2 focus:ring-[#0B5CA8]/10 focus:outline-none transition disabled:bg-gray-50 text-sm text-[#10233F]"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-semibold text-[#64748B]">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contoh@email.com"
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDEAF6] focus:border-[#0B5CA8] focus:ring-2 focus:ring-[#0B5CA8]/10 focus:outline-none transition disabled:bg-gray-50 text-sm text-[#10233F]"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="judul" className="text-sm font-semibold text-[#64748B]">
                      Subjek / Keperluan
                    </label>
                    <input
                      type="text"
                      id="judul"
                      name="judul"
                      value={formData.judul}
                      onChange={handleChange}
                      placeholder="Contoh: Sewa Bus Pariwisata 3 Hari"
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl border border-[#DDEAF6] focus:border-[#0B5CA8] focus:ring-2 focus:ring-[#0B5CA8]/10 focus:outline-none transition disabled:bg-gray-50 text-sm text-[#10233F]"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="pesan" className="text-sm font-semibold text-[#64748B]">
                      Pesan Detail
                    </label>
                    <textarea
                      id="pesan"
                      name="pesan"
                      value={formData.pesan}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Tuliskan detail kebutuhan perjalanan Anda, rute tujuan, tanggal sewa, dan jumlah penumpang..."
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl border border-[#DDEAF6] focus:border-[#0B5CA8] focus:ring-2 focus:ring-[#0B5CA8]/10 focus:outline-none transition disabled:bg-gray-50 text-sm text-[#10233F]"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-[#10233F] font-extrabold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-[#FFD23F] hover:bg-[#F6B800]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#10233F] border-t-transparent rounded-full animate-spin"></div>
                        Mengirim Pesan...
                      </>
                    ) : (
                      <>
                        <i className="far fa-paper-plane"></i>
                        Kirim Pesan Sekarang
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default KontakPage;

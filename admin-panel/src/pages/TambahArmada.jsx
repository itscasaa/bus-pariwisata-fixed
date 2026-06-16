import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM, API_BASE } from '../config/api';

const TIPE_OPTIONS = [
  { value: 'big_bus', label: 'Executive Class (Big Bus)' },
  { value: 'medium_bus', label: 'VIP Class (Medium Bus)' },
  { value: 'elf', label: 'Standard Class (Elf)' },
  { value: 'hiace', label: 'Microbus (Hiace)' }
];

// ===== TAMBAH ARMADA =====
export function TambahArmada() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nama_bus: '',
    tipe: 'big_bus',
    kapasitas: '',
    harga_sewa: '',
    diskon: '',
    gambar_utama: '',
    deskripsi: '',
    fasilitas_str: 'Seat 3-2, 2 Unit LCD TV, Dispenser, AC, Audio Set, Android Entertainment System, Karaoke + Microphone, Cooler Box, Port USB, Kompartemen Bagasi Atas + Bawah, Lampu Baca'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successBusId, setSuccessBusId] = useState(null); // For success flow screen

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file foto utama melebihi batas 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validations (Task 6)
    if (!form.nama_bus.trim()) return setError('Nama Bus wajib diisi.');
    if (!form.tipe) return setError('Tipe Bus wajib diisi.');
    if (!form.kapasitas || Number(form.kapasitas) <= 0) return setError('Kapasitas Penumpang wajib diisi.');
    if (!form.harga_sewa || Number(form.harga_sewa) <= 0) return setError('Harga Sewa wajib diisi.');
    if (!selectedFile) return setError('Foto Utama wajib dipilih untuk armada baru.');

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nama_bus', form.nama_bus);
      formData.append('tipe', form.tipe);
      formData.append('kapasitas', form.kapasitas);
      formData.append('harga_sewa', form.harga_sewa);
      formData.append('diskon', form.diskon);
      formData.append('gambar_utama', form.gambar_utama);
      formData.append('deskripsi', form.deskripsi);
      
      // Comma-separated to JSON array (Task 3)
      const facilitiesArray = form.fasilitas_str
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      formData.append('fasilitas_json', JSON.stringify(facilitiesArray));
      
      formData.append('gambar_file', selectedFile);

      const res = await fetch(`${API_ADM}/tambah_armada.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        const newId = data.data && data.data.id ? data.data.id : null;
        if (newId) {
          setSuccessBusId(newId);
        } else {
          // Fallback if no ID returned
          navigate('/armada');
        }
      } else {
        setError(data.message || 'Gagal menyimpan armada.');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  // If successfully created (Task 7)
  if (successBusId) {
    return (
      <main className="flex-1">
        <PageHeader title="Tambah Armada Baru" subtitle="Armada Berhasil Disimpan" />
        <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl max-w-xl mx-auto mt-10">
          <div className="bg-surface-container-lowest rounded-[24px] card-shadow border border-outline-variant p-8 text-center flex flex-col items-center gap-5">
            <div className="w-20 h-20 bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[48px] font-black">check</span>
            </div>
            <h3 className="text-headline-sm text-on-surface font-extrabold">Armada Berhasil Ditambahkan!</h3>
            <p className="text-outline text-sm leading-relaxed">
              Spesifikasi bus <strong>{form.nama_bus}</strong> dan foto utama telah tersimpan. Langkah berikutnya adalah melengkapi galeri foto unit (kabin, kursi, fasilitas) agar promosi di website lebih menarik.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <button
                type="button"
                onClick={() => navigate(`/armada/${successBusId}/images`)}
                className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' }}
              >
                <span className="material-symbols-outlined">photo_library</span>
                Kelola Galeri Foto
              </button>
              <button
                type="button"
                onClick={() => navigate('/armada')}
                className="flex-1 py-3 px-4 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-outline-variant"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Kembali ke Armada
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageHeader 
        title="Tambah Armada Baru" 
        subtitle="Lengkapi spesifikasi armada bus, upload foto utama, dan tambahkan fasilitas unit Anda." 
      />

      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/armada')} 
          className="flex items-center gap-2 text-outline hover:text-primary mb-6 transition-colors text-body-md font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span> Kembali ke Kelola Armada
        </button>

        {/* Step Guide (Task 2) */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-[20px] p-5 mb-6">
          <h4 className="font-bold text-[#3525cd] text-sm mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">info</span>
            Alur Pembuatan Data Armada Bus
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Isi Data Armada', desc: 'Lengkapi spesifikasi dasar seperti nama, kapasitas, harga, dan fasilitas bus.' },
              { step: '2', title: 'Upload Foto Utama', desc: 'Unggah satu foto bus terbaik sebagai cover utama unit di katalog.' },
              { step: '3', title: 'Simpan & Kelola Galeri', desc: 'Setelah selesai, Anda diarahkan untuk menambahkan galeri foto lainnya.' }
            ].map(item => (
              <div key={item.step} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/80 flex gap-3 shadow-sm">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">{item.step}</span>
                <div>
                  <h5 className="font-bold text-on-surface text-[12px] mb-0.5">{item.title}</h5>
                  <p className="text-outline text-[11px] leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[18px]">error</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: specifications */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Spesifikasi Utama */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                1. Informasi Utama Armada
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nama Bus" required hint="Contoh: Mafina Executive 45 Seat">
                  <input 
                    type="text" 
                    value={form.nama_bus} 
                    onChange={handleFieldChange('nama_bus')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface"
                    placeholder="Masukkan nama bus..." 
                    required 
                  />
                </Field>

                <Field label="Tipe Kelas Bus" required hint="Pilih kategori kelas bus">
                  <div className="relative">
                    <select 
                      value={form.tipe} 
                      onChange={handleFieldChange('tipe')} 
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none font-semibold text-on-surface"
                    >
                      {TIPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                      expand_more
                    </span>
                  </div>
                </Field>

                <Field label="Kapasitas Penumpang" required hint="Masukkan jumlah kursi penumpang (angka)">
                  <input 
                    type="number" 
                    value={form.kapasitas} 
                    onChange={handleFieldChange('kapasitas')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface" 
                    placeholder="Contoh: 45" 
                    min="1"
                    required 
                  />
                </Field>

                <Field label="Harga Sewa Harian (Rp)" required hint="Masukkan harga tanpa titik atau koma">
                  <input 
                    type="number" 
                    value={form.harga_sewa} 
                    onChange={handleFieldChange('harga_sewa')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface" 
                    placeholder="Contoh: 3500000" 
                    min="1"
                    required 
                  />
                </Field>

                <Field label="Tag Diskon (opsional)" hint="Contoh: 10%, Promo, 15% OFF (kosongkan jika tidak ada)">
                  <input 
                    type="text" 
                    value={form.diskon} 
                    onChange={handleFieldChange('diskon')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface" 
                    placeholder="Contoh: 10%" 
                  />
                </Field>
              </div>
            </div>

            {/* Section 2: Deskripsi */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                2. Deskripsi Armada
              </h3>
              <Field label="Deskripsi Singkat" hint="Jelaskan keunggulan, rute rekomendasi, atau kenyamanan armada secara singkat">
                <textarea 
                  value={form.deskripsi} 
                  onChange={handleFieldChange('deskripsi')} 
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none font-medium text-on-surface" 
                  rows={4} 
                  placeholder="Contoh: Bus pariwisata eksekutif kelas VIP dengan bodi luar garapan karoseri terkemuka..." 
                />
              </Field>
            </div>

            {/* Section 3: Fasilitas */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">featured_play_list</span>
                3. Fasilitas Bus
              </h3>
              <Field label="Daftar Fasilitas Bus" hint="Pisahkan setiap fasilitas dengan tanda koma (,) agar terformat otomatis">
                <textarea 
                  value={form.fasilitas_str} 
                  onChange={handleFieldChange('fasilitas_str')} 
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none font-medium text-on-surface" 
                  rows={3} 
                  placeholder="Contoh: AC, TV LCD, Dispenser, Android TV, Karaoke, USB Charger, Lampu Baca" 
                />
              </Field>
            </div>
          </div>

          {/* Right Column: Upload & Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Section 4: Foto Utama Cover */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">photo_camera</span>
                4. Foto Utama / Cover
              </h3>
              
              <div className="space-y-4">
                {/* Upload Card container (Task 4) */}
                <div 
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all hover:bg-surface-container-low flex flex-col items-center justify-center gap-3 ${
                    previewUrl ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-lowest'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />

                  {previewUrl ? (
                    <div className="w-full space-y-3">
                      <div className="aspect-[3/2] rounded-xl overflow-hidden bg-surface-dim relative shadow">
                        <img src={previewUrl} alt="Preview utama" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-bold">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Foto Terpilih: {selectedFile?.name}
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20">
                        <span className="material-symbols-outlined text-[14px]">cached</span>
                        Ganti Foto
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>add_a_photo</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-[13px]">Pilih Foto Utama Bus</p>
                        <p className="text-[11px] text-outline mt-0.5 leading-snug">Klik di sini untuk mengupload dari galeri perangkat Anda</p>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-outline leading-relaxed">
                  Foto utama akan tampil sebagai cover armada bus di halaman katalog utama admin dan website publik. Format yang didukung: JPG, JPEG, PNG, WEBP (maksimal 5MB).
                </p>
              </div>
            </div>

            {/* Section 5: Submit / Action Panel */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-body-md hover:opacity-90 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  boxShadow: '0 4px 15px rgba(79,70,229,0.2)',
                }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Simpan & Buat Armada
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/armada')}
                className="w-full py-3 px-4 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-outline-variant"
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

// ===== EDIT ARMADA =====
export function EditArmada() {
  const navigate = useNavigate();
  const { id } = useParams(); // Using react-router-dom useParams (Task 10)
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Determine the ID safely (react-router-dom or pathname)
    const busId = id || window.location.pathname.split('/').pop();
    
    fetch(`${API_PUB}/buses.php?id=${busId}`)
      .then(r => r.json())
      .then(d => {
        const bus = d.data;
        if (bus) {
          // Format facilities array to comma string (Task 10)
          const fasStr = Array.isArray(bus.fasilitas) ? bus.fasilitas.join(', ') : '';
          
          setForm({
            nama_bus: bus.nama_bus,
            tipe: bus.tipe || 'big_bus',
            kapasitas: bus.kapasitas,
            harga_sewa: bus.harga_sewa,
            diskon: bus.diskon || '',
            gambar_utama: bus.gambar_utama || '',
            deskripsi: bus.deskripsi || '',
            fasilitas_str: fasStr
          });
        } else {
          setError('Data armada tidak ditemukan.');
        }
      })
      .catch(() => setError('Gagal mengambil data dari server.'));
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file foto utama melebihi batas 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!form.nama_bus.trim()) return setError('Nama Bus wajib diisi.');
    if (!form.tipe) return setError('Tipe Bus wajib diisi.');
    if (!form.kapasitas || Number(form.kapasitas) <= 0) return setError('Kapasitas Penumpang wajib diisi.');
    if (!form.harga_sewa || Number(form.harga_sewa) <= 0) return setError('Harga Sewa wajib diisi.');

    setLoading(true);

    const busId = id || window.location.pathname.split('/').pop();

    try {
      const formData = new FormData();
      formData.append('nama_bus', form.nama_bus);
      formData.append('tipe', form.tipe);
      formData.append('kapasitas', form.kapasitas);
      formData.append('harga_sewa', form.harga_sewa);
      formData.append('diskon', form.diskon);
      formData.append('gambar_utama', form.gambar_utama);
      formData.append('deskripsi', form.deskripsi);
      
      // Comma-separated to JSON array (Task 3)
      const facilitiesArray = form.fasilitas_str
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      formData.append('fasilitas_json', JSON.stringify(facilitiesArray));
      
      if (selectedFile) {
        formData.append('gambar_file', selectedFile);
      }

      const res = await fetch(`${API_ADM}/edit_armada.php?id=${busId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        navigate('/armada');
      } else {
        setError(data.message || 'Gagal menyimpan perubahan.');
      }
    } catch {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  if (error && !form) {
    return (
      <main className="flex-1 p-6 text-center">
        <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span> {error}
        </div>
        <div className="mt-4">
          <button onClick={() => navigate('/armada')} className="px-4 py-2 bg-primary text-white rounded-xl font-bold">Kembali</button>
        </div>
      </main>
    );
  }

  if (!form) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageHeader 
        title="Edit Detail Armada" 
        subtitle={`Perbarui spesifikasi, foto utama, dan fasilitas untuk bus ${form.nama_bus}`} 
      />

      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/armada')} 
          className="flex items-center gap-2 text-outline hover:text-primary mb-6 transition-colors text-body-md font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span> Kembali ke Kelola Armada
        </button>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[18px]">error</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Spesifikasi Utama */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                1. Informasi Utama Armada
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nama Bus" required hint="Contoh: Mafina Executive 45 Seat">
                  <input 
                    type="text" 
                    value={form.nama_bus} 
                    onChange={handleFieldChange('nama_bus')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface"
                    placeholder="Zahra Ayu..." 
                    required 
                  />
                </Field>

                <Field label="Tipe Kelas Bus" required hint="Kategori kelas bus">
                  <div className="relative">
                    <select 
                      value={form.tipe} 
                      onChange={handleFieldChange('tipe')} 
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none font-semibold text-on-surface"
                    >
                      {TIPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                      expand_more
                    </span>
                  </div>
                </Field>

                <Field label="Kapasitas Penumpang" required hint="Jumlah kursi penumpang (angka)">
                  <input 
                    type="number" 
                    value={form.kapasitas} 
                    onChange={handleFieldChange('kapasitas')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface" 
                    placeholder="45" 
                    min="1"
                    required 
                  />
                </Field>

                <Field label="Harga Sewa Harian (Rp)" required hint="Harga sewa per hari (tanpa titik/koma)">
                  <input 
                    type="number" 
                    value={form.harga_sewa} 
                    onChange={handleFieldChange('harga_sewa')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface" 
                    placeholder="4500000" 
                    min="1"
                    required 
                  />
                </Field>

                <Field label="Tag Diskon (opsional)" hint="Contoh: 10%, Promo, 15% OFF (kosongkan jika tidak ada)">
                  <input 
                    type="text" 
                    value={form.diskon} 
                    onChange={handleFieldChange('diskon')} 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface" 
                    placeholder="Contoh: 10%" 
                  />
                </Field>
              </div>
            </div>

            {/* Section 2: Deskripsi */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                2. Deskripsi Armada
              </h3>
              <Field label="Deskripsi Singkat" hint="Deskripsikan keunggulan spesifikasi bus secara ringkas">
                <textarea 
                  value={form.deskripsi} 
                  onChange={handleFieldChange('deskripsi')} 
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none font-medium text-on-surface" 
                  rows={4} 
                  placeholder="Deskripsi singkat bus..." 
                />
              </Field>
            </div>

            {/* Section 3: Fasilitas */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">featured_play_list</span>
                3. Fasilitas Bus
              </h3>
              <Field label="Fasilitas Kenyamanan" hint="Pisahkan setiap fasilitas dengan tanda koma (,)">
                <textarea 
                  value={form.fasilitas_str} 
                  onChange={handleFieldChange('fasilitas_str')} 
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none font-medium text-on-surface" 
                  rows={3} 
                  placeholder="AC, LCD TV, Android TV, Karaoke, USB Charger..." 
                />
              </Field>
            </div>
          </div>

          {/* Right Column: Upload & Action Buttons */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Section 4: Foto Utama Cover */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant">
              <h3 className="text-title-lg text-on-surface font-extrabold mb-4 pb-2 border-b border-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">photo_camera</span>
                4. Foto Utama / Cover
              </h3>
              
              <div className="space-y-4">
                {/* Upload Card (Task 4 & 10) */}
                <div 
                  onClick={triggerFileSelect}
                  className="border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all hover:bg-surface-container-low flex flex-col items-center justify-center gap-3 border-primary bg-primary/5"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />

                  {previewUrl ? (
                    <div className="w-full space-y-3">
                      <div className="aspect-[3/2] rounded-xl overflow-hidden bg-surface-dim relative shadow">
                        <img src={previewUrl} alt="Preview utama baru" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-bold">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Foto Baru Terpilih
                      </div>
                    </div>
                  ) : form.gambar_utama ? (
                    <div className="w-full space-y-3">
                      <div className="aspect-[3/2] rounded-xl overflow-hidden bg-surface-dim relative shadow">
                        <img 
                          src={form.gambar_utama.startsWith('http') ? form.gambar_utama : `${API_BASE}${form.gambar_utama}`} 
                          alt="Cover saat ini" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-outline font-bold">
                        <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                        Foto Cover Saat Ini
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>add_a_photo</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-[13px]">Unggah Foto Utama</p>
                      </div>
                    </>
                  )}

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 mt-1">
                    <span className="material-symbols-outlined text-[14px]">cached</span>
                    Ganti / Upload Foto
                  </span>
                </div>
                
                <p className="text-[10px] text-outline leading-relaxed">
                  Jika Anda memilih foto baru, foto cover lama akan digantikan setelah Anda menekan tombol Simpan Perubahan di bawah.
                </p>
              </div>
            </div>

            {/* Section 5: Submit / Action Panel */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-body-md hover:opacity-90 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  boxShadow: '0 4px 15px rgba(79,70,229,0.2)',
                }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Simpan Perubahan
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/armada')}
                className="w-full py-3 px-4 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-outline-variant"
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

// ===== HELPER FIELD CONTAINER =====
function Field({ label, required, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold uppercase tracking-wider text-outline">
        {label}
        {required && <span className="text-[#ba1a1a] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10.5px] text-outline/80 leading-normal">{hint}</p>}
    </div>
  );
}

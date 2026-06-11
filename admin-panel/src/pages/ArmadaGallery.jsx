import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { API_PUB, API_ADM, API_BASE } from '../config/api';

const CATEGORIES = {
  exterior: { label: 'Eksterior Bus', desc: 'Foto bodi luar dan tampilan eksterior bus', bg: '#dcfce7', color: '#15803d' },
  interior: { label: 'Interior Bus', desc: 'Foto kabin bagian dalam, supir, dan langit-langit', bg: '#dbeafe', color: '#1d4ed8' },
  seat:     { label: 'Kursi Penumpang', desc: 'Foto jok kursi, susunan/layout tempat duduk', bg: '#eae6f4', color: '#464555' },
  facility: { label: 'Fasilitas Bus', desc: 'Foto AC, TV, sound system, dispenser, bagasi, dll.', bg: '#ffedd5', color: '#c2410c' },
  other:    { label: 'Lainnya', desc: 'Foto tambahan atau dokumentasi unit lainnya', bg: '#f3f4f6', color: '#374151' }
};

const getTipeLabel = (tipe) => {
  const mapping = {
    big_bus: 'Executive Class (Big Bus)',
    medium_bus: 'VIP Class (Medium Bus)',
    elf: 'Standard Class (Elf)',
    hiace: 'Microbus (Hiace)'
  };
  return mapping[tipe] || tipe || 'Umum';
};

export default function ArmadaGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [bus, setBus] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    tipe_gambar: 'exterior',
    label: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadPreviews, setUploadPreviews] = useState([]);

  // Fetch bus details and gallery images
  const fetchData = async () => {
    try {
      // 1. Fetch bus details
      const busRes = await fetch(`${API_PUB}/buses.php?id=${id}`);
      if (!busRes.ok) throw new Error('Gagal memuat detail bus.');
      const busData = await busRes.json();
      if (busData.status === 'success') {
        setBus(busData.data);
      } else {
        throw new Error(busData.message || 'Bus tidak ditemukan.');
      }

      // 2. Fetch gallery images
      const imgRes = await fetch(`${API_ADM}/bus_images.php?bus_id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (!imgRes.ok) throw new Error('Gagal memuat galeri foto.');
      const imgData = await imgRes.json();
      if (imgData.status === 'success') {
        setImages(imgData.data || []);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setUploadPreviews(previews);
  };

  const handleUploadSubmit = async (e) => {
    if (e) e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Pilih minimal satu file gambar terlebih dahulu.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('action', 'upload');
      formData.append('bus_id', id);
      formData.append('tipe_gambar', uploadForm.tipe_gambar);
      formData.append('label', uploadForm.label);

      selectedFiles.forEach((file) => {
        formData.append('images[]', file);
      });

      const res = await fetch(`${API_ADM}/bus_images.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg(data.message || 'Gambar berhasil diupload.');
        setSelectedFiles([]);
        setUploadPreviews([]);
        setUploadForm({ tipe_gambar: 'exterior', label: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchData();
      } else {
        setError(data.message || 'Gagal mengupload gambar.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setUploading(false);
    }
  };

  const handleSetCover = async (imageId) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_ADM}/bus_images.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          action: 'set_cover',
          bus_id: id,
          image_id: imageId
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg(data.message || 'Gambar cover berhasil diperbarui.');
        fetchData();
      } else {
        setError(data.message || 'Gagal menetapkan gambar cover.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    }
  };

  const handleDelete = async (imageId, isCover) => {
    if (isCover) {
      alert('Gambar cover aktif tidak boleh dihapus. Silakan tetapkan gambar lain sebagai cover terlebih dahulu.');
      return;
    }
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar ini dari galeri?')) {
      return;
    }

    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_ADM}/bus_images.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          action: 'delete',
          bus_id: id,
          image_id: imageId
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg(data.message || 'Gambar berhasil dihapus.');
        fetchData();
      } else {
        setError(data.message || 'Gagal menghapus gambar.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    }
  };

  const handleUpdateMetadata = async (imageId, tipe, label) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_ADM}/bus_images.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          action: 'update_metadata',
          bus_id: id,
          image_id: imageId,
          tipe_gambar: tipe,
          label: label
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg(data.message || 'Informasi gambar berhasil disimpan.');
        fetchData();
      } else {
        setError(data.message || 'Gagal memperbarui informasi gambar.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    }
  };

  const handleMove = async (index, direction) => {
    const newImages = [...images];
    const temp = newImages[index];
    if (direction === 'up' && index > 0) {
      newImages[index] = newImages[index - 1];
      newImages[index - 1] = temp;
    } else if (direction === 'down' && index < newImages.length - 1) {
      newImages[index] = newImages[index + 1];
      newImages[index + 1] = temp;
    } else {
      return;
    }

    setImages(newImages);

    // Save order
    const ids = newImages.map(img => img.id);
    try {
      const res = await fetch(`${API_ADM}/bus_images.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          action: 'reorder',
          bus_id: id,
          image_ids: ids
        })
      });
      const result = await res.json();
      if (result.status !== 'success') {
        setError(result.message || 'Gagal menyimpan urutan gambar.');
        fetchData();
      }
    } catch (err) {
      setError('Gagal menyimpan urutan gambar.');
      fetchData();
    }
  };

  const focusUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.focus();
      fileInputRef.current.click();
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageHeader 
        title="Kelola Foto Bus" 
        subtitle={bus ? `Galeri Foto & Manajemen Gambar Utama untuk ${bus.nama_bus}` : 'Galeri Foto Bus'} 
      />

      <div className="px-4 lg:px-unit-xl pb-24 lg:pb-unit-xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/armada')} 
          className="flex items-center gap-2 text-outline hover:text-primary mb-6 transition-colors text-body-md font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span> Kembali ke Kelola Armada
        </button>

        {/* 3-Step Guide (Task 8) */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-[20px] p-5 mb-6">
          <h4 className="font-bold text-[#3525cd] text-sm mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">info</span>
            Panduan Cepat Mengelola Galeri Foto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Upload Foto Bus', desc: 'Pilih dan upload satu atau beberapa foto bus sekaligus dari HP/Komputer Anda.' },
              { step: '2', title: 'Pilih Kategori Foto', desc: 'Kelompokkan foto (Eksterior, Interior, Kursi, Fasilitas) agar rapi.' },
              { step: '3', title: 'Tentukan Foto Utama', desc: 'Pilih satu foto terbaik sebagai cover utama yang tampil di halaman depan website.' }
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

        {/* Alerts */}
        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[18px]">error</span> {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-[#dcfce7] text-[#15803d] text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-[18px]">check_circle</span> {successMsg}
          </div>
        )}

        {/* Bus Info & Current Cover Section (Task 2 & 3) */}
        {bus && (
          <div className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant mb-6" style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-[11px] text-outline font-bold uppercase tracking-wider">Unit Bus</span>
                  <p className="font-extrabold text-on-surface text-2xl">{bus.nama_bus}</p>
                </div>
                <div>
                  <span className="text-[11px] text-outline font-bold uppercase tracking-wider">Tipe / Kelas Kelas</span>
                  <div className="mt-1">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(53,37,205,0.08)', color: '#3525cd' }}>
                      {getTipeLabel(bus.tipe)}
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60">
                  <h4 className="font-bold text-on-surface text-xs mb-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                    Foto Utama / Cover Aktif
                  </h4>
                  <p className="text-outline text-[12px] leading-relaxed">
                    Gambar di samping kanan adalah cover utama saat ini. Foto ini akan tampil di bagian depan website publik sebagai promosi utama. Anda bisa memilih foto lain di bawah untuk dijadikan foto utama.
                  </p>
                </div>
              </div>
              {/* Large Cover Image Card */}
              <div className="md:col-span-1">
                <div className="aspect-[3/2] rounded-2xl overflow-hidden bg-surface-dim relative border-2 border-primary shadow-md">
                  <img 
                    src={bus.gambar_utama.startsWith('http') ? bus.gambar_utama : `${API_BASE}${bus.gambar_utama}`} 
                    alt={bus.nama_bus} 
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/300x200/e4e1ee/777587?text=Cover+Utama';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-[#dcfce7] text-[#15803d] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-[#bbf7d0] shadow-sm">
                    <span className="material-symbols-outlined text-[11px] font-black">check</span>
                    FOTO UTAMA AKTIF
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1: Upload Card (Task 5) */}
          <div 
            className="lg:col-span-1 bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant"
            style={{ boxShadow: '0px 10px 30px rgba(0,0,0,0.03)' }}
          >
            <h3 className="text-headline-sm text-on-surface mb-2 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">cloud_upload</span>
              Upload Foto Baru
            </h3>
            <p className="text-xs text-outline mb-5">
              Pilih satu atau beberapa foto bus dari perangkat Anda untuk diupload ke dalam galeri.
            </p>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-body-md font-bold text-on-surface mb-1.5">Pilih Kategori Foto</label>
                <div className="relative">
                  <select
                    value={uploadForm.tipe_gambar}
                    onChange={e => setUploadForm({ ...uploadForm, tipe_gambar: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none font-semibold text-on-surface"
                  >
                    {Object.keys(CATEGORIES).map(key => (
                      <option key={key} value={key}>{CATEGORIES[key].label}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                    expand_more
                  </span>
                </div>
                {/* Category Helper Description (Task 4) */}
                <p className="text-[11px] text-outline mt-1.5 italic bg-surface-container-low/50 p-2 rounded-lg border border-outline-variant/40">
                  Keterangan: {CATEGORIES[uploadForm.tipe_gambar].desc}
                </p>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-body-md font-bold text-on-surface mb-1.5">Caption Foto / Keterangan</label>
                <input
                  type="text"
                  value={uploadForm.label}
                  onChange={e => setUploadForm({ ...uploadForm, label: e.target.value })}
                  placeholder="Contoh: Kursi penumpang reclining empuk, Lampu interior LED..."
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface"
                />
              </div>

              {/* File Input */}
              <div>
                <label className="block text-body-md font-bold text-on-surface mb-1.5">Pilih Gambar</label>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                <p className="text-[10px] text-outline mt-1.5">Format yang didukung: JPG, PNG, WEBP. Maksimal 5MB per gambar.</p>
              </div>

              {/* Previews */}
              {uploadPreviews.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-outline mb-1.5">Preview Foto Terpilih ({uploadPreviews.length}):</label>
                  <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant max-h-32 overflow-y-auto">
                    {uploadPreviews.map((preview, i) => (
                      <div key={i} className="aspect-[3/2] rounded-lg overflow-hidden bg-surface-dim border border-outline-variant">
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-body-md hover:opacity-90 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  boxShadow: '0 4px 15px rgba(79,70,229,0.2)',
                }}
              >
                {uploading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">cloud_upload</span>
                    Upload Foto
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Gallery Grid */}
          <div className="lg:col-span-2 space-y-6">
            {images.length === 0 ? (
              /* Friendly Empty State (Task 9) */
              <div className="bg-surface-container-lowest rounded-[24px] p-10 card-shadow border border-outline-variant text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-outline" style={{ fontSize: '48px' }}>
                    no_photography
                  </span>
                </div>
                <h3 className="text-headline-sm text-on-surface font-extrabold">Belum ada foto galeri untuk bus ini</h3>
                <p className="text-outline text-xs max-w-md leading-relaxed mx-auto">
                  Upload foto exterior, interior, kursi, atau fasilitas bus agar pelanggan bisa melihat detail armada dengan lebih jelas dari website publik.
                </p>
                <button
                  type="button"
                  onClick={focusUpload}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-body-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
                >
                  <span className="material-symbols-outlined">add_a_photo</span>
                  Upload Foto Sekarang
                </button>
              </div>
            ) : (
              /* Grouped Gallery Images (Task 6) */
              Object.keys(CATEGORIES).map(catKey => {
                const catImages = images.filter(img => (img.tipe_gambar || 'other') === catKey);
                const catInfo = CATEGORIES[catKey];
                
                return (
                  <div 
                    key={catKey}
                    className="bg-surface-container-lowest rounded-[24px] p-6 card-shadow border border-outline-variant"
                  >
                    {/* Category Title Header */}
                    <div className="flex justify-between items-center mb-1 pb-2 border-b border-surface-container">
                      <div>
                        <h4 className="font-extrabold text-on-surface text-md flex items-center gap-2">
                          <span className="w-2 h-5 rounded-full bg-primary" />
                          Foto {catInfo.label}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ backgroundColor: catInfo.bg, color: catInfo.color }}>
                            {catImages.length} Foto
                          </span>
                        </h4>
                        <p className="text-[11px] text-outline mt-0.5">{catInfo.desc}</p>
                      </div>
                    </div>

                    {catImages.length === 0 ? (
                      /* Category Empty State */
                      <div className="py-8 text-center text-outline text-[12.5px] italic bg-surface-container-low/40 rounded-xl border border-dashed border-outline-variant/60 mt-3">
                        Belum ada foto untuk kategori ini.
                      </div>
                    ) : (
                      /* Grid of Images in this Category */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                        {catImages.map((img) => {
                          const index = images.findIndex(x => x.id === img.id);
                          return (
                            <div 
                              key={img.id} 
                              className={`relative flex flex-col bg-surface-container rounded-2xl overflow-hidden border transition-all ${
                                img.is_cover ? 'border-primary ring-2 ring-primary/10 shadow-md' : 'border-outline-variant'
                              }`}
                            >
                              {/* Image Thumbnail */}
                              <div className="aspect-[3/2] w-full relative bg-surface-dim overflow-hidden group">
                                <img 
                                  src={img.path.startsWith('http') ? img.path : `${API_BASE}${img.path}`} 
                                  alt={img.label || catInfo.label} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/300x200/e4e1ee/777587?text=Foto';
                                  }}
                                />

                                {/* Badge */}
                                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                  {img.is_cover === 1 ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-[#dcfce7] text-[#15803d] flex items-center gap-0.5 border border-[#bbf7d0] shadow-sm">
                                      <span className="material-symbols-outlined text-[10px] font-black">check</span>
                                      FOTO UTAMA
                                    </span>
                                  ) : (
                                    <span 
                                      className="px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wide border border-black/5"
                                      style={{ backgroundColor: catInfo.bg, color: catInfo.color }}
                                    >
                                      {catInfo.label}
                                    </span>
                                  )}
                                </div>

                                {/* Reorder Controls (Panah) */}
                                <div className="absolute bottom-3 right-3 flex gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() => handleMove(index, 'up')}
                                    disabled={index === 0}
                                    className="w-8 h-8 rounded bg-transparent text-white flex items-center justify-center hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                                    title="Pindah ke Atas/Depan"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMove(index, 'down')}
                                    disabled={index === images.length - 1}
                                    className="w-8 h-8 rounded bg-transparent text-white flex items-center justify-center hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                                    title="Pindah ke Bawah/Belakang"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                                  </button>
                                </div>
                              </div>

                              {/* Form Fields inside Card */}
                              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                  {/* Category Dropdown */}
                                  <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-bold text-outline uppercase w-16">Kategori</label>
                                    <select
                                      defaultValue={img.tipe_gambar}
                                      onChange={(e) => {
                                        img.newTipe = e.target.value;
                                      }}
                                      className="flex-1 px-2.5 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none font-semibold text-on-surface"
                                    >
                                      {Object.keys(CATEGORIES).map(key => (
                                        <option key={key} value={key}>{CATEGORIES[key].label}</option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Caption Input */}
                                  <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-bold text-outline uppercase w-16">Keterangan</label>
                                    <input
                                      type="text"
                                      defaultValue={img.label}
                                      placeholder="Keterangan foto..."
                                      onChange={(e) => {
                                        img.newLabel = e.target.value;
                                      }}
                                      className="flex-1 px-2.5 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none font-medium text-on-surface"
                                    />
                                  </div>
                                </div>

                                {/* Action Buttons (Task 7) */}
                                <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
                                  {/* Save Caption Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const t = img.newTipe !== undefined ? img.newTipe : img.tipe_gambar;
                                      const l = img.newLabel !== undefined ? img.newLabel : img.label;
                                      handleUpdateMetadata(img.id, t, l);
                                    }}
                                    className="w-full py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 flex items-center justify-center gap-1 transition-all"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">save</span>
                                    Simpan Keterangan
                                  </button>

                                  <div className="flex items-center gap-2">
                                    {/* Set Cover Button (Task 3) */}
                                    {img.is_cover !== 1 ? (
                                      <button
                                        type="button"
                                        onClick={() => handleSetCover(img.id)}
                                        className="flex-1 py-1.5 rounded-lg text-xs font-bold text-[#15803d] bg-[#dcfce7] hover:bg-[#bbf7d0] flex items-center justify-center gap-1 transition-all"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">star</span>
                                        Jadikan Foto Utama
                                      </button>
                                    ) : (
                                      <div className="flex-1 py-1.5 rounded-lg text-xs font-bold text-[#15803d] bg-[#dcfce7]/60 flex items-center justify-center gap-1 cursor-default">
                                        <span className="material-symbols-outlined text-[14px]">check</span>
                                        Foto Utama Aktif
                                      </div>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(img.id, img.is_cover === 1)}
                                      disabled={img.is_cover === 1}
                                      className="py-1.5 px-3 rounded-lg text-xs font-bold text-[#ba1a1a] bg-[#ffdad6]/60 hover:bg-[#ffdad6] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-all"
                                      title={img.is_cover === 1 ? "Foto utama aktif tidak boleh dihapus" : "Hapus Foto"}
                                    >
                                      <span className="material-symbols-outlined text-[15px]">delete</span>
                                      Hapus Foto
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

# Panduan Pengujian Sistem Otomatis — Mafina Trans

Dokumentasi ini menjelaskan konfigurasi, arsitektur, cara instalasi, dan langkah-langkah menjalankan pengujian otomatis di situs **Mafina Trans**.

---

## 📋 Daftar Fitur yang Diuji

Sistem pengujian otomatis ini didasarkan pada **Playwright** (untuk E2E & API) dan **tsx** (untuk penyusunan Laporan HTML Kustom).

1. **API Testing (`tests/api/`)**:
   * `GET /api/health.php` — Deteksi ketersediaan database, tabel, dan format JSON.
   * `GET /api/buses.php` — Memeriksa daftar bus dan detail unit berdasarkan ID.
   * `GET /api/price_list.php` — Uji filter destinasi dan hasil pencarian.
   * `POST /api/contact.php` — Uji pengiriman kontak, validasi data kosong/email, dan ketahanan payload XSS / SQL Injection.
   * `POST /api/booking.php` — Uji formulir pemesanan bus dengan prepared statements dan proteksi data input.

2. **Frontend E2E Testing (`tests/e2e/`)**:
   * **Homepage** — Memastikan halaman termuat sempurna tanpa error log, memverifikasi menu navigasi, dan keselarasan brand.
   * **Armada (Bus Fleet)** — Memvalidasi kartu armada, kesesuaian data kapasitas/kursi, dan navigasi detail.
   * **Price List** — Pengujian interaktif tabel harga, pencarian rute, dan skenario pencarian kosong.
   * **Contact Form** — Simulasi pengisian data formulir kontak dan penanganan alert sukses/gagal.
   * **Booking Form** — Membuka modal pemesanan di price list, simulasi pemilihan jenis armada, pengisian tanggal, dan pemicu redirect link WhatsApp.
   * **WhatsApp Floating Button** — Validasi ketersediaan tombol di desktop/mobile dengan format nomor tujuan internasional `6285199802536`.
   * **Admin Protection** — Memverifikasi pembatasan akses dashboard (PHP & React) tanpa login dan penolakan kredensial yang salah.

3. **Uji Keamanan & Integritas Aset**:
   * Deteksi tautan gambar rusak (`broken images` dengan `naturalWidth` 0).
   * Deteksi uncaught exception dan browser console error.
   * Deteksi kegagalan request jaringan penting.
   * Injeksi payload XSS dan SQL Injection dasar.

---

## 🛠️ Instalasi & Prasyarat

### Prerequisites
* **Node.js** versi 18 ke atas.
* Koneksi server backend PHP (Apache/XAMPP) atau URL produksi yang aktif untuk pengujian database.

### Langkah Instalasi
1. Pasang dependensi pengujian di folder utama:
   ```bash
   npm install
   npm install -D @playwright/test tsx
   ```
2. Pasang modul browser bawaan Playwright:
   ```bash
   npx playwright install
   ```

---

## 🚀 Menjalankan Pengujian

Pengujian dapat disesuaikan untuk berbagai lingkungan pengembangan melalui variabel env `BASE_URL`. Jika variabel ini tidak ditentukan, default target adalah `http://localhost:3000`.

### 1. Jalankan Seluruh Tes & Susun Laporan HTML Kustom (Sangat Direkomendasikan)
Menjalankan seluruh pengujian, menyimpan log mentah ke JSON, lalu menyusun dashboard HTML kustom:
```bash
npm run test:full-report
```

### 2. Pengujian dengan Custom Environment
* **Local React Development Server (Port 3000)**:
  ```bash
  BASE_URL=http://localhost:3000 npm run test:full-report
  ```
* **Local Server PHP / XAMPP**:
  ```bash
  BASE_URL=http://localhost/bus_pariwisata npm run test:full-report
  ```
* **Production / Domain Live**:
  ```bash
  BASE_URL=https://mafina-trans.com npm run test:full-report
  ```

* **Untuk Windows (PowerShell)**:
  ```powershell
  $env:BASE_URL="http://localhost/bus_pariwisata"; npm run test:full-report
  ```

### 3. Skrip Pengujian Spesifik Lainnya
* **Hanya Uji API**:
  ```bash
  npm run test:api
  ```
* **Hanya Uji Frontend (E2E)**:
  ```bash
  npm run test:e2e
  ```
* **Jalankan dengan UI Mode Playwright (Interaktif)**:
  ```bash
  npm run test:ui
  ```
* **Jalankan dengan Headed Mode (Membuka browser fisik)**:
  ```bash
  npm run test:headed
  ```
* **Membuka Laporan Bawaan Playwright**:
  ```bash
  npm run test:report
  ```

---

## 📊 Membuka Laporan HTML Kustom

Setelah Anda menjalankan perintah `npm run test:full-report` (atau memicu kompilasi manual lewat `npm run test:html`), laporan interaktif akan disimpan di lokasi berikut:

📁 **Lokasi Laporan**:
```txt
test-results/custom-report/testing-report.html
```

Anda dapat membuka file `testing-report.html` ini langsung menggunakan penjelajah web apa pun (Chrome, Firefox, Safari, Edge) tanpa membutuhkan koneksi internet, server lokal, atau modul CDN tambahan. Laporan ini bersifat mandiri (standalone).

### Isi Laporan Dashboard:
* **Summary Cards**: Jumlah total tes, total lolos, gagal, dilewati, dan persentase kelulusan.
* **Recommendations List**: Rekomendasi solusi praktis yang digenerasikan otomatis berdasarkan kegagalan pengujian yang terdeteksi.
* **API Summary**: Tabel kesehatan backend dan proteksi payload.
* **Aset & Konsol**: Rincian gambar rusak serta daftar pesan error dari konsol browser.
* **Rincian Seluruh Kasus Uji**: Daftar lengkap seluruh modul tes lengkap dengan durasi dan screenshot kegagalan (jika ada).

---

## 🛠️ Pemecahan Masalah (Troubleshooting) & Kerja Alur

1. **API Kembalikan Error 503 / Gagal Terkoneksi ke DB**:
   * Pastikan server database MySQL (misalnya Apache & MySQL di Control Panel XAMPP) dalam status aktif (running).
   * Periksa kredensial di file [koneksi.php](file:///var/www/bus_pariwisata/config/koneksi.php).

2. **Keamanan Rute Admin & Proteksi Sesi (Backend & Frontend)**:
   * **Frontend Protection**: Rute `/admin/dashboard` pada React frontend diamankan dengan `AdminProtectedRoute`. Akses tanpa token akan langsung diarahkan kembali ke halaman `/admin/login`.
   * **Centralized Backend Auth Guard (`config/auth_guard.php`)**:
     * Untuk melindungi data sensitif di sisi server, kami menerapkan modul proteksi terpusat [auth_guard.php](file:///var/www/bus_pariwisata/config/koneksi.php).
     * Modul ini mendeteksi otentikasi melalui:
       1. **PHP Session (`$_SESSION['admin_id']`)** untuk kompatibilitas halaman admin legacy.
       2. **Stateless Bearer Token (`Authorization: Bearer <token>`)** untuk permintaan API React frontend.
     * Jika tidak terotentikasi, API akan menolak akses secara seragam dengan mengembalikan status HTTP **401 Unauthorized** dan payload JSON:
       ```json
       {
         "success": false,
         "status": "error",
         "message": "Unauthorized access"
       }
       ```
     * Mengamankan seluruh endpoint administrative di `/admin/api/*` serta membatasi metode `POST` di `/api/settings.php`.
     * Menghindari kebocoran informasi sensitif (database errors, raw trace) dengan menangkap exception secara aman.
   * **Penonaktifan Endpoint Debug (Leakage Prevention)**:
     * Semua endpoint informasi sistem dan debug (`/api/buses_debug.php`, `/api/price_list_debug.php`, dan `/admin/api/test_info.php`) telah dinonaktifkan sepenuhnya dan mengembalikan HTTP **404 Not Found**.
   * **Uji Keamanan API Otomatis**:
     * `tests/api/admin-auth.api.spec.ts` — Memverifikasi proses login, penanganan kredensial salah, dan pencegahan error SQL/PHP.
     * `tests/api/admin-endpoints.api.spec.ts` — Menguji 12 endpoint administratif untuk memastikan penolakan akses tanpa token, token palsu, token kedaluwarsa, serta penerimaan token yang valid.

3. **Cara Menambah Skenario Tes Baru**:
   * Tambahkan file spesifikasi baru di folder `tests/api/` untuk endpoint backend baru, atau di folder `tests/e2e/` untuk alur halaman baru.
   * Gunakan penamaan `.spec.ts` agar dikenali otomatis oleh skrip pelacak.

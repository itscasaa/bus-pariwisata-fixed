# 🚌 Surya Tour Trans - Bus Pariwisata

Website penyewaan bus pariwisata untuk Surya Tour Trans, Tangerang.

---

## 📁 Struktur Project

```
bus_pariwisata/
│
├── 📂 api/                     # PHP REST API Endpoints
│   ├── buses.php               # GET  /api/buses.php
│   ├── price_list.php          # GET  /api/price_list.php
│   ├── booking.php             # POST /api/booking.php
│   ├── contact.php             # POST /api/contact.php
│   └── health.php              # GET  /api/health.php
│
├── 📂 config/                  # Konfigurasi Backend
│   └── koneksi.php             # Koneksi database MySQL
│
├── 📂 database/                # SQL Setup & Migration
│   ├── bus_setup.sql           # Tabel bus + bus_images
│   ├── price_list_setup.sql    # Tabel price_list
│   ├── admin_setup.sql         # Tabel admin_users + news
│   └── bus_fix.sql             # Patch/fix data
│
├── 📂 frontend/                # React SPA (Website Publik)
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── config/api.js       # API base URL
│   │   ├── data/siteData.js    # Static data
│   │   ├── App.js              # Router utama
│   │   └── index.js            # Entry point
│   ├── public/                 # HTML template
│   ├── assets/images/          # Gambar bus & destinasi
│   ├── dist/                   # Build output
│   └── package.json
│
├── 📂 admin-panel/             # React Admin Dashboard
│   ├── src/
│   │   ├── components/         # Layout, PageHeader, dll
│   │   ├── pages/              # Dashboard, Armada, News, dll
│   │   ├── config/api.js       # API base URL
│   │   ├── App.jsx             # Router admin
│   │   └── index.js            # Entry point
│   ├── public/                 # HTML template
│   └── package.json
│
├── 📂 admin/                   # PHP Admin Panel (Legacy)
│   └── *.php                   # CRUD pages PHP
│
└── project_memory.md           # Dokumentasi project
```

---

## 🚀 Cara Menjalankan

### Prerequisites
- XAMPP (Apache + MySQL)
- Node.js v18+

### 1. Setup Database
```sql
-- Buka phpMyAdmin, buat database: bus_pariwisata
-- Jalankan file SQL berikut secara berurutan:
database/bus_setup.sql
database/price_list_setup.sql
database/admin_setup.sql
```

### 2. Jalankan Frontend (Website Publik)
```bash
cd frontend
npm install
npm start
# Buka: http://localhost:3000
```

### 3. Jalankan Admin Panel (React)
```bash
cd admin-panel
npm install
npm start
# Buka: http://localhost:3004
```

### 4. PHP Backend (API)
- Pastikan XAMPP Apache sudah running
- API tersedia di: `http://localhost/bus_pariwisata/api/`

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/buses.php` | Daftar semua bus |
| GET | `/api/buses.php?id=1` | Detail bus by ID |
| GET | `/api/price_list.php` | Daftar harga |
| GET | `/api/price_list.php?keyword=bandung` | Cari destinasi |
| POST | `/api/booking.php` | Submit booking |
| POST | `/api/contact.php` | Kirim pesan kontak |
| GET | `/api/health.php` | Health check |

---

## 🔐 Credentials

### Admin Panel
- **URL:** http://localhost:3004
- **Username:** admin
- **Password:** admin123

### Database
- **Host:** localhost
- **User:** root
- **Password:** (kosong)
- **Database:** bus_pariwisata

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 7, Tailwind CSS, Swiper |
| Admin Panel | React 18, React Router 7, Tailwind CSS, Material Symbols |
| Backend | PHP 8, MySQL |
| Build Tool | Webpack 5, Babel |
| Icons | FontAwesome 7 (frontend), Material Symbols (admin) |
| Fonts | Poppins (frontend), Inter (admin) |

---

## 📊 Database Schema

### `bus`
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| id | INT PK | Auto increment |
| nama_bus | VARCHAR(100) | Nama bus |
| tipe | VARCHAR(50) | big_bus / medium_bus / elf / hiace |
| kapasitas | INT | Jumlah kursi |
| harga_sewa | BIGINT | Harga per hari |
| gambar_utama | VARCHAR(255) | Path gambar |
| deskripsi | TEXT | Deskripsi bus |
| fasilitas | TEXT | JSON array fasilitas |

### `price_list`
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| id | INT PK | Auto increment |
| nama_destinasi | VARCHAR(200) | Nama tujuan |
| durasi | VARCHAR(50) | Durasi perjalanan |
| harga_hiace | BIGINT | Harga HiAce |
| harga_elf | BIGINT | Harga Elf |
| harga_medium | BIGINT | Harga Medium Bus |
| harga_big | BIGINT | Harga Big Bus |

### `news`
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| id | INT PK | Auto increment |
| judul | VARCHAR(255) | Judul berita |
| slug | VARCHAR(255) | URL slug |
| konten | TEXT | Isi berita |
| gambar | VARCHAR(255) | URL gambar |
| status | ENUM | publish / draft |

---

## 📱 Halaman Website

| Route | Halaman |
|-------|---------|
| `/` | Beranda |
| `/bus-wisata` | Daftar Armada |
| `/bus/:id` | Detail Bus |
| `/price-list` | Daftar Harga |
| `/paket-wisata` | Paket Wisata |
| `/news` | Berita & Info |

---

## 📱 Halaman Admin

| Route | Halaman |
|-------|---------|
| `/` | Dashboard |
| `/armada` | Kelola Armada |
| `/armada/tambah` | Tambah Bus |
| `/armada/edit/:id` | Edit Bus |
| `/price-list` | Kelola Harga |
| `/price-list/tambah` | Tambah Harga |
| `/news` | Kelola Berita |
| `/news/tambah` | Tambah Berita |

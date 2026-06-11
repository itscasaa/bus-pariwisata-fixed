# 🚌 Surya Tour Trans - Admin Dashboard

Admin Panel React untuk mengelola data bus pariwisata, price list, dan berita.

## 🎨 Design System

Dashboard ini menggunakan design system dari `DESIGN (1).md`:
- **Color Palette:** Indigo-Navy spectrum dengan Soft-UI principles
- **Typography:** Inter font family
- **Icons:** Material Symbols (Google Fonts)
- **Shadows:** Ambient shadows (0px 10px 30px rgba(0,0,0,0.03))
- **Rounded Corners:** 24px untuk cards
- **Spacing:** 8px baseline grid

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (port 3004)
npm start

# Build for production
npm build
```

## 📁 Struktur Folder

```
src/
├── components/          # Reusable components
│   ├── AdminSidebar.jsx
│   ├── AdminTopBar.jsx
│   ├── StatisticsCards.jsx
│   ├── ArmadaTable.jsx
│   ├── QuickActions.jsx
│   └── BeritaTerbaru.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   └── Login.jsx
├── config/             # Configuration
│   └── api.js
├── App.js              # Main router
├── index.js            # Entry point
└── index.css           # Global styles
```

## 🔌 API Integration

Dashboard terhubung dengan PHP backend:

### Endpoints yang Digunakan:
- `GET /api/buses.php` - Fetch armada data
- `GET /api/price_list.php` - Fetch price list data
- `POST /api/auth/login.php` - Login (TODO)

### API Base URL:
```javascript
// src/config/api.js
const API_BASE = "http://localhost/bus_pariwisata/api";
```

## 🔐 Login

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Note:** Saat ini menggunakan dummy authentication. Akan diintegrasikan dengan PHP backend.

## 📊 Fitur Dashboard

### 1. Statistics Cards
- Total Armada (fetched from API)
- Total Destinasi (fetched from API)
- Total Berita (static, TODO: API)
- Foto Fasilitas (calculated from bus images)

### 2. Armada Table
- Menampilkan 3 bus terbaru
- Data: Name, Capacity, Type, Price, Status
- Fetched from `/api/buses.php`

### 3. Quick Actions
- Tambah Armada
- Tambah Harga
- Tambah Berita
- Lihat Website

### 4. Berita Terbaru
- Empty state (belum ada berita)
- Ready untuk integrasi API

## 🎯 Komponen Utama

### AdminSidebar
- Fixed sidebar (280px width)
- Navigation menu dengan active state
- Logo section
- Settings & Logout buttons

### AdminTopBar
- Title & current date/time (auto-update setiap menit)
- Search bar (hidden on mobile)
- Notification button
- Profile section

### StatisticsCards
- 4 stat cards dengan icons
- Fetches data dari API
- Loading state & error handling
- Hover effects

### ArmadaTable
- Responsive table
- Fetches dari `/api/buses.php`
- Shows first 3 buses
- Image thumbnails
- Type badges dengan colors

## 🎨 Tailwind Config

Design tokens dari DESIGN.md sudah diimplementasikan:

```javascript
colors: {
  'primary': '#3525cd',
  'primary-container': '#4f46e5',
  'secondary': '#4e45d5',
  'surface': '#fcf8ff',
  'on-surface': '#1b1b24',
  // ... dan banyak lagi
}

fontSize: {
  'display-lg': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
  'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
  'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
  // ... dan lainnya
}

spacing: {
  'sidebar-width': '280px',
  'unit-lg': '1.5rem',
  'gutter': '1.5rem',
  // ... dan lainnya
}
```

## 📱 Responsive Design

- **Mobile:** Sidebar hidden, hamburger menu (TODO)
- **Tablet:** 2 columns layout
- **Desktop:** Full 3 columns layout dengan sidebar

## 🔄 State Management

Saat ini menggunakan React hooks (useState, useEffect). Untuk state management yang lebih kompleks, bisa ditambahkan:
- Context API
- Redux
- Zustand

## 🚧 TODO

- [ ] Implement real PHP authentication
- [ ] Create Armada CRUD pages
- [ ] Create Price List CRUD pages
- [ ] Create News CRUD pages
- [ ] Add mobile hamburger menu
- [ ] Implement search functionality
- [ ] Add notification system
- [ ] Add user profile management
- [ ] Add dark mode toggle
- [ ] Add data export features

## 📝 Notes

1. **Port:** Admin panel runs on port 3004 (frontend runs on 3000)
2. **API:** Make sure XAMPP is running for PHP backend
3. **Database:** Ensure `bus_pariwisata` database is set up
4. **CORS:** PHP APIs already have CORS headers enabled

## 🤝 Contributing

Untuk menambahkan fitur baru:
1. Buat component di `src/components/`
2. Tambahkan route di `src/App.js`
3. Update `project_memory.md`

---

**Built with ❤️ for Surya Tour Trans**

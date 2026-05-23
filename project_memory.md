# 📚 PROJECT MEMORY - Surya Tour Trans Bus Pariwisata

**Last Updated:** May 23, 2026  
**Status:** Active Development  
**Conversation Session:** OPEN

---

## 🏗️ QUICK REFERENCE

### Tech Stack
- **Frontend:** React 18 + React Router 7 + Tailwind CSS 3.4 + Swiper 12
- **Backend:** PHP (MySQL)
- **Database:** MySQL (bus_pariwisata)
- **Build:** Webpack 5 + Babel
- **Icons:** FontAwesome 7
- **Fonts:** Poppins (Google Fonts)

### Project Root
```
c:\xampp\htdocs\bus_pariwisata\
```

### Key Directories
```
frontend/              # React SPA (npm start, npm build)
├── src/
│   ├── components/    # 17 React components
│   ├── config/        # api.js (BASE_URL: http://localhost/bus_pariwisata/api)
│   ├── data/          # siteData.js (static data, WhatsApp: 6289652594745)
│   ├── assets/        # Images & logo
│   ├── App.js         # Main router
│   └── index.js       # Entry point
├── dist/              # Production build
├── package.json       # Dependencies
├── tailwind.config.js
├── webpack.config.js
└── .babelrc

api/                   # PHP REST APIs
├── buses.php          # GET /api/buses.php (with image gallery)
├── price_list.php     # GET /api/price_list.php (with search)
├── booking.php        # POST /api/booking.php
└── contact.php

admin/                 # Admin Panel (PHP)
├── dashboard.php      # Stats & quick actions
├── config.php         # DB connection & helpers
├── armada.php         # Bus CRUD
├── price_list.php     # Price CRUD
├── news.php           # News CRUD
├── index.php          # Login page
└── layout_header.php, layout_footer.php

database/              # SQL Setup Files
├── bus_setup.sql      # 5 buses + bus_images table
├── price_list_setup.sql # 36 destinations
├── admin_setup.sql    # admin_users + news tables
└── bus_fix.sql

config/
├── koneksi.php        # DB connection (localhost, root, no password, db: bus_pariwisata)
└── tambah_pesan.php   # Legacy contact form

assets/
├── style.css          # Legacy CSS
└── javascript/script.js
```

---

## 🎯 FRONTEND PAGES & ROUTES

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Hero + Features + Destinations + BusFleet + Promo + TourPackages + Testimonials |
| `/bus-wisata` | ArmadaPage | Grid listing semua bus dengan detail |
| `/bus/:id` | BusDetailPage | Detail bus dengan image gallery & fasilitas |
| `/price-list` | PriceListPage | Tabel harga dengan search keyword |
| `/paket-wisata` | PaketWisataPage | Paket tour dengan filter kategori (1-10 hari) |
| `/news` | NewsPage | Berita & info (currently empty) |
| `/admin/dashboard` | AdminDashboard | Admin dashboard dengan sidebar, stats, armada table, quick actions |

---

## 🗄️ DATABASE SCHEMA

### Table: `bus`
```sql
id (PK), nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas (JSON)
```
**Data:** 5 buses
- Zahra Ayu (45 kursi, 4.5M)
- Wong Kudus (30 kursi, 3M)
- William (45 kursi, 4.5M)
- White Horse (45 kursi, 5M)
- Starbus (30 kursi, 3.5M)

### Table: `bus_images`
```sql
id (PK), bus_id (FK), path, label, urutan
```
**Purpose:** Gallery images per bus

### Table: `price_list`
```sql
id (PK), nama_destinasi, durasi, harga_hiace, harga_elf, harga_medium, harga_big
```
**Data:** 36 destinations (Transfer, Half Day, Full Day, 2-10 hari)

### Table: `admin_users`
```sql
id (PK), nama, username, password (bcrypt), created_at
```
**Default:** username=admin, password=admin123

### Table: `news`
```sql
id (PK), judul, slug, konten, gambar, status (publish/draft), created_at, updated_at
```

---

## 🔌 API ENDPOINTS

### GET /api/buses.php
**Query Params:** `?id=1` (optional, get single bus)
**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama_bus": "Zahra Ayu",
      "tipe": "big_bus",
      "kapasitas": 45,
      "harga_sewa": 4500000,
      "gambar_utama": "http://localhost/bus_pariwisata/frontend/assets/images/bus1/bu1.jpeg",
      "deskripsi": "...",
      "fasilitas": ["AC", "Reclining Seat", ...],
      "images": [{"path": "...", "label": "...", "urutan": 0}, ...]
    }
  ]
}
```

### GET /api/price_list.php
**Query Params:** `?keyword=bandung` (optional, search destination)
**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama_destinasi": "TRANSFER IN/OUT (One Way)",
      "durasi": "4 Jam",
      "harga_hiace": 1250000,
      "harga_elf": 1350000,
      "harga_medium": 1750000,
      "harga_big": 2250000
    }
  ]
}
```

### POST /api/booking.php
**Body (form-data):**
```
nama, no_hp, email (optional), tanggal, tujuan, jumlah (optional), bus_id (optional)
```
**Response:**
```json
{
  "status": "success|error",
  "message": "Booking berhasil dibuat.",
  "data": []
}
```

---

## 🎨 DESIGN SYSTEM

### Colors
- **Primary:** `#1d6ec5` (main blue)
- **Primary Light:** `#60a5fa`
- **Navy:** `#0d4a8a`
- **White:** `#ffffff`
- **Gray:** `#f4f6f9`, `#f8fbff`
- **Green:** `#22c55e` (WhatsApp)
- **Yellow:** `#fbbf24` (accent)

### Typography
- **Font Family:** Poppins (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800
- **Body:** 14-16px
- **Headings:** 20-48px

### Spacing (Tailwind)
- Container padding: 1rem (mobile), 2rem (desktop)
- Gap: 1.5rem (card-gap)
- Rounded: 0.75rem (md), 1rem (lg), 1.5rem (xl)

### Components
- **Navbar:** Fixed, responsive, with mobile hamburger
- **Hero:** Full-screen with gradient overlay & search bar
- **Cards:** Rounded corners, shadow, hover effects
- **Buttons:** Primary (blue), Secondary (ghost), Green (WhatsApp)
- **Swiper:** Carousel for buses, packages, testimonials
- **WhatsApp Button:** Fixed bottom-right, green, floating

---

## 📊 STATIC DATA (siteData.js)

### WhatsApp Config
```javascript
whatsapp: {
  number: '6289652594745',
  message: 'Halo Mafina Trans, saya ingin bertanya tentang paket wisata'
}
```

### Navigation Links
```javascript
navLinks: [
  { label: 'Home', path: '/' },
  { label: 'Armada', path: '/bus-wisata' },
  { label: 'Paket Wisata', path: '/paket-wisata' },
  { label: 'News & Info', path: '/news' },
  { label: 'Kontak Kami', path: '/kontak' }
]
```

### Tour Packages
- 1 Hari: Bandung, Anyer, Taman Bunga, Kebun Raya, Taman Safari, Maribaya, Taman Mini, Cimory
- 2 Hari: Tangkuban Perahu, Ciwidey, Garut, Lampung, Guci
- 3 Hari: Dieng Yogya, Yogyakarta, Jawa Tengah
- 4 Hari: Bromo, Batu Malang
- 5 Hari: Bali
- 10 Hari: Bali Lombok

### Testimonials
- 5 testimonials (Ahmad Irfan, Chory Aufa, Dwi Nur'Aini, Pipit Dipi, Alfarid Petrus)

---

## 🚀 DEVELOPMENT COMMANDS

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm start            # Dev server (webpack-dev-server)
npm build            # Production build
```

### Backend
- No build needed, PHP runs directly
- Access admin: `http://localhost/bus_pariwisata/admin/`
- API base: `http://localhost/bus_pariwisata/api/`

---

## 🔐 CREDENTIALS

### Admin Panel
- **URL:** `http://localhost/bus_pariwisata/admin/`
- **Username:** admin
- **Password:** admin123

### Database
- **Host:** localhost
- **User:** root
- **Password:** (empty)
- **Database:** bus_pariwisata

---

## 📝 IMPORTANT NOTES

1. **Frontend API Base:** Hardcoded in `frontend/src/config/api.js` → `http://localhost/bus_pariwisata/api`
2. **Image Base:** `http://localhost/bus_pariwisata/frontend/assets/images/`
3. **WhatsApp Integration:** All CTA buttons link to WhatsApp with pre-filled messages
4. **Responsive:** Mobile-first design, breakpoints at 640px, 768px, 1024px
5. **Error Handling:** API returns JSON with status field (success/error)
6. **CORS:** Enabled in PHP APIs (Access-Control-Allow-Origin: *)
7. **News Page:** Currently empty (no news in database)
8. **Booking Table:** May not exist yet (API checks dynamically)
9. **Admin Dashboard:** New React component with Material Symbols icons, design tokens from DESIGN.md
10. **Admin Components:** Modular structure (Sidebar, TopBar, Stats, Table, QuickActions, News)

---

## 🎯 ADMIN DASHBOARD COMPONENTS

### AdminDashboard.jsx (Main Container)
- Manages state for stats & datetime
- Renders Sidebar, TopBar, Stats, Table, QuickActions, News
- Handles logout navigation

### AdminSidebar.jsx
- Fixed sidebar (280px width)
- Navigation menu with active state
- Logo section with bus icon
- Settings & Logout buttons

### AdminTopBar.jsx
- Title & current date/time
- Search bar (hidden on mobile)
- Notification button
- Profile section with avatar

### StatisticsCards.jsx
- 4 stat cards (Total Armada, Destinasi, Berita, Foto)
- Dynamic icons & colors
- Trend indicator (optional)
- Hover effects

### ArmadaTable.jsx
- Fetches buses from `/api/buses.php`
- Displays first 3 buses
- Shows: Name, Capacity, Type, Price, Status
- Responsive table with hover effects

### QuickActions.jsx
- 4 action buttons (Tambah Armada, Harga, Berita, Website)
- Primary button (blue) + secondary buttons
- Navigation to create pages

### BeritaTerbaru.jsx
- Empty state when no news
- Shows icon, message, CTA button
- Ready for news list implementation

---

## 🎨 DESIGN TOKENS ADDED

**Tailwind Config Updated:**
- All colors from DESIGN.md (primary, secondary, tertiary, error, surface, etc.)
- Typography scales (display-lg, headline-md, body-md, label-sm)
- Spacing units (unit-xs, unit-sm, unit-md, unit-lg, unit-xl)
- Border radius (DEFAULT, lg, xl, full)
- Sidebar width (280px)

**CSS Updates:**
- Material Symbols font import
- Custom shadow (.custom-shadow)
- Scrollbar styling
- Admin dashboard specific styles

---

## 🚀 ADMIN PANEL STRUCTURE

### Folder: `admin-panel/`
```
admin-panel/
├── public/
│   └── index.html          # HTML template with Material Symbols
├── src/
│   ├── components/
│   │   ├── AdminSidebar.jsx      # Fixed sidebar with navigation
│   │   ├── AdminTopBar.jsx       # Top bar with search & profile
│   │   ├── StatisticsCards.jsx   # 4 stat cards (fetches from API)
│   │   ├── ArmadaTable.jsx       # Bus table (fetches from API)
│   │   ├── QuickActions.jsx      # 4 action buttons
│   │   └── BeritaTerbaru.jsx     # News section (empty state)
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard page
│   │   └── Login.jsx             # Login page
│   ├── config/
│   │   └── api.js                # API base URL config
│   ├── App.js                    # Main router
│   ├── index.js                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── package.json
├── webpack.config.js
├── tailwind.config.js            # Design tokens from DESIGN.md
├── postcss.config.js
└── .babelrc
```

### Running Admin Panel
```bash
cd admin-panel
npm install
npm start    # Runs on http://localhost:3004
```

### API Integration
- ✅ StatisticsCards fetches from `/api/buses.php` & `/api/price_list.php`
- ✅ ArmadaTable fetches from `/api/buses.php` (shows first 3)
- ⏳ Login will connect to PHP auth API (currently uses dummy auth)
- ⏳ News section ready for API integration

### Design System Applied
- ✅ All colors from DESIGN.md (primary, secondary, tertiary, surface, etc.)
- ✅ Typography scales (display-lg, headline-md, body-md, label-sm)
- ✅ Material Symbols icons (Google Fonts)
- ✅ Inter font family
- ✅ Custom shadows (0px 10px 30px rgba(0,0,0,0.03))
- ✅ Rounded corners (24px for cards)
- ✅ Hover effects & transitions
- ✅ Responsive design (mobile-first)

### Login Credentials
- **Username:** admin
- **Password:** admin123
- **Note:** Currently uses localStorage, will be replaced with PHP session

---

## 🚀 NEXT STEPS

1. ✅ Admin Dashboard React component created
2. ✅ Admin Login page created
3. ⏳ Create Armada CRUD pages
4. ⏳ Create Price List CRUD pages
5. ⏳ Create News CRUD pages
6. ⏳ Implement PHP authentication API
7. ⏳ Connect Login to PHP backend

---

**Session Status:** OPEN ✅  
**Memory Valid Until:** Session Closed

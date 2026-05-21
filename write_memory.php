<?php
$memory = [
  "metadata" => [
    "version" => "1.3.0",
    "lastUpdated" => "2026-05-21T10:00:00Z",
    "projectName" => "Bus Pariwisata - Surya Tour Trans",
    "description" => "Web platform untuk penyewaan bus pariwisata (tour buses rental)",
    "repository" => "https://github.com/Topan221867/bus_pariwisata.git",
    "notes" => "This file serves as the PRIMARY SOURCE OF CONTEXT. Always read this file FIRST before starting any work. Only scan files directly related to requested tasks.",
    "changelog" => [
      "v1.0.0 - Initial project setup",
      "v1.1.0 - API buses.php & price_list.php working",
      "v1.2.0 (2026-05-20): Setup tabel bus + bus_images, insert 5 data bus, update api/buses.php include gambar fasilitas, update BusFleet.jsx pakai gambar_utama dari API",
      "v1.3.0 (2026-05-21): Fix footer duplikat (hapus dari Navbar, rapikan Footer.jsx jadi 3 kolom). Hapus Partners dari beranda & App.js. Fix semua text-white di BusFleet.jsx -> text-gray-800. Update fasilitas 11 item semua bus di DB. Update getFacilityIcon di BusDetailPage.jsx. Buat & update price_list DB kolom durasi sesuai dokumen resmi 2025-2026. Rapikan PriceListPage.jsx tampilan baru dengan kolom Durasi + tombol WA."
    ]
  ],
  "architecture" => [
    "type" => "HYBRID_STACK",
    "frontend" => [
      "framework" => "React 18.0.0",
      "buildTool" => "Webpack 5",
      "language" => "JavaScript/JSX",
      "styling" => "Tailwind CSS 3.4.19 + Bootstrap 5.3.8 + PostCSS",
      "router" => "React Router v7.15.1",
      "devServer" => "webpack-dev-server (port 3003)",
      "publicPath" => "/",
      "historyApiFallback" => true,
      "transpiler" => "Babel @7.29.0"
    ],
    "backend" => [
      "framework" => "PHP (Traditional)",
      "type" => "REST API",
      "database" => "MySQL/MariaDB",
      "databaseName" => "bus_pariwisata",
      "connectionConfig" => [
        "file" => "config/koneksi.php",
        "host" => "localhost",
        "user" => "root",
        "password" => "",
        "charset" => "utf8"
      ],
      "notes" => "Backend uses procedural PHP with prepared statements for security"
    ],
    "runtime" => [
      "php" => "C:\\xampp\\php\\php.exe",
      "shell" => "PowerShell (use ; not && as separator)",
      "server" => "XAMPP Apache"
    ]
  ],
  "directoryStructure" => [
    "root" => [
      "frontend/" => "React SPA application (main UI)",
      "api/" => "PHP REST API endpoints",
      "config/" => "Database configuration (koneksi.php)",
      "database/" => "SQL setup files",
      "pages/" => "Legacy PHP pages (may be unused)",
      "admin/" => "Admin panel (purpose TBD)",
      "assets/" => "Static assets",
      "public/" => "Public static files",
      "componen/" => "PHP components (legacy)",
      "layout/" => "PHP layout templates (legacy)",
      "proses/" => "PHP processing scripts (legacy)",
      "Topan/" => "Unknown - needs investigation"
    ],
    "imageStructure" => [
      "frontend/assets/images/bus1/" => ["bu1.jpeg","bangku_depan.jpeg","bangku_belakang.jpeg"],
      "frontend/assets/images/bus2/" => ["mini_bus2.jpeg","bangku_depan.jpeg","bangku_depan2.jpeg","bangku_belakang.jpeg","supir.jpeg"],
      "frontend/assets/images/bus3/" => ["bus3.jpeg","bangku_depan.jpeg","bangku_depan1.jpeg","bangku_depan2.jpeg","bangku_belakang.jpeg"],
      "frontend/assets/images/bus4/" => ["bus4.jpeg","bangku_depan.jpeg","bangku_belakang.jpeg","bangku_belakang2.jpeg","dispenser.jpeg"],
      "frontend/assets/images/bus5/" => ["bus5.jpeg","depan_bus5.jpeg","bangku_depan.jpeg","bangku_depan2.jpeg","bangku_belakang.jpeg","bangku_belakang2.jpeg"]
    ],
    "databaseFiles" => [
      "database/bus_setup.sql" => "Setup awal tabel bus (referensi)",
      "database/bus_fix.sql" => "Fix ALTER tabel bus (MariaDB compatible CHANGE kolom)",
      "database/update_fasilitas.sql" => "Update fasilitas 11 item + deskripsi 5 bus",
      "database/price_list_setup.sql" => "Setup tabel price_list resmi 2025-2026 (36 destinasi)"
    ]
  ],
  "databaseSchema" => [
    "database" => "bus_pariwisata",
    "tables" => [
      "bus" => [
        "columns" => ["id (PK AI)","nama_bus","tipe","kapasitas","harga_sewa","gambar_utama","deskripsi","fasilitas_json","created_at"],
        "note" => "Kolom gambar lama di-CHANGE jadi gambar_utama via ALTER. fasilitas_json = JSON array string.",
        "data" => [
          ["id"=>1,"nama_bus"=>"Zahra Ayu","tipe"=>"big_bus","kapasitas"=>45,"gambar_utama"=>"bus1/bu1.jpeg"],
          ["id"=>2,"nama_bus"=>"Wong Kudus","tipe"=>"medium_bus","kapasitas"=>30,"gambar_utama"=>"bus2/mini_bus2.jpeg"],
          ["id"=>3,"nama_bus"=>"William","tipe"=>"big_bus","kapasitas"=>45,"gambar_utama"=>"bus3/bus3.jpeg"],
          ["id"=>4,"nama_bus"=>"White Horse","tipe"=>"big_bus","kapasitas"=>45,"gambar_utama"=>"bus4/bus4.jpeg"],
          ["id"=>5,"nama_bus"=>"Starbus","tipe"=>"medium_bus","kapasitas"=>30,"gambar_utama"=>"bus5/bus5.jpeg"]
        ],
        "fasilitas_lengkap" => ["Seat 3-2","2 Unit LCD TV","Dispenser","AC","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]
      ],
      "bus_images" => [
        "columns" => ["id (PK AI)","bus_id (FK->bus.id)","path","label","urutan"],
        "description" => "Gambar fasilitas per bus. path = relatif dari frontend/assets/images/",
        "relasi" => "ON DELETE CASCADE dari bus"
      ],
      "price_list" => [
        "columns" => ["id (PK AI)","nama_destinasi","durasi","harga_hiace","harga_elf","harga_medium","harga_big","created_at"],
        "description" => "Daftar harga resmi 2025-2026. 36 destinasi. Urut by id (bukan alfabet).",
        "note" => "Harga 0 = Hubungi Kami (contoh: MEDAN 10 Hari)",
        "durations" => ["4 Jam","8 Jam","12 Jam","15 Jam","18 Jam","2 Hari","3 Hari","4 Hari","5 Hari","7 Hari","8 Hari","10 Hari"],
        "vehicleTypes" => ["hiace","elf","medium_bus","big_bus"]
      ],
      "booking" => [
        "columns" => ["id","nama","no_hp","email","tanggal","tujuan","jumlah","bus_id (optional)"],
        "description" => "Booking records dari customer via POST /api/booking.php"
      ],
      "pesan_masuk" => [
        "columns" => ["id","nama","email","judul","pesan"],
        "description" => "Pesan dari form kontak via POST /api/contact.php"
      ]
    ]
  ],
  "apiEndpoints" => [
    "base" => "http://localhost/bus_pariwisata/api",
    "endpoints" => [
      "GET /buses.php" => [
        "description" => "Ambil semua bus + gambar fasilitas dari DB",
        "queryParams" => ["id (optional) - ambil bus by id"],
        "returns" => ["id","nama_bus","tipe","kapasitas","harga_sewa","gambar (backward compat)","gambar_utama (URL lengkap)","deskripsi","fasilitas (array)","images (array: path, label, urutan)"],
        "imageBase" => "http://localhost/bus_pariwisata/frontend/assets/images/",
        "note" => "Auto-detect kolom gambar/gambar_utama. Return kedua field untuk backward compat."
      ],
      "GET /price_list.php" => [
        "description" => "Ambil daftar harga, opsional filter keyword",
        "queryParams" => ["keyword (optional) - search nama_destinasi LIKE"],
        "returns" => ["id","nama_destinasi","durasi","harga_hiace","harga_elf","harga_medium","harga_big"],
        "orderBy" => "id ASC (urutan dokumen asli)",
        "note" => "Pakai prepared statement untuk keamanan"
      ],
      "POST /booking.php" => ["required"=>["nama","no_hp","tanggal","tujuan"],"optional"=>["email","jumlah","bus_id"]],
      "POST /contact.php" => ["required"=>["nama","email","judul","pesan"]],
      "GET /health.php" => "API health check",
      "GET /buses_debug.php" => "DEBUG - cek koneksi & struktur tabel bus (hapus jika sudah tidak perlu)",
      "GET /price_list_debug.php" => "DEBUG - cek koneksi & struktur tabel price_list (hapus jika sudah tidak perlu)"
    ]
  ],
  "reactComponents" => [
    "location" => "frontend/src/components/",
    "App.js" => [
      "routes" => [
        "/" => "HomePage (Hero, Features, Destinations, BusFleet, PromoBanner, TourPackages, Testimonials)",
        "/price-list" => "PriceListPage",
        "/bus-wisata" => "ArmadaPage",
        "/paket-wisata" => "PaketWisataPage",
        "/news" => "NewsPage",
        "/bus/:id" => "BusDetailPage"
      ],
      "layout" => "Navbar (top) + Routes + Footer (bottom) + WhatsAppButton",
      "removed" => "Partners - dihapus dari import dan HomePage"
    ],
    "Navbar.jsx" => [
      "status" => "FIXED - footer duplikat sudah dihapus",
      "links" => ["/","/bus-wisata","/paket-wisata","/price-list","/news","/kontak"],
      "features" => ["fixed top","backdrop blur","mobile hamburger menu","active link highlight"]
    ],
    "Footer.jsx" => [
      "status" => "REBUILT - 3 kolom rapi",
      "columns" => ["Info perusahaan + kontak (phone/email/lokasi)","Navigasi (6 link)","Sosial media (icon bulat)"],
      "dataSource" => "siteData.footer.social.* dan siteData.footer.copyright",
      "bottomBar" => "copyright + ikon hati"
    ],
    "BusFleet.jsx" => [
      "status" => "FIXED",
      "fixes" => ["text-white -> text-gray-800 di judul, nama bus live DB, nama bus fallback"],
      "features" => ["Swiper carousel","fetch dari /api/buses.php","fallback static jika error","gambar dari gambar_utama atau gambar"],
      "imageSource" => "bus.gambar_utama || bus.gambar (URL lengkap dari API)"
    ],
    "BusDetailPage.jsx" => [
      "status" => "UPDATED",
      "updates" => ["getFacilityIcon diperluas untuk 11 fasilitas baru","icon: chair,tv,tint,snowflake,volume-up,tablet-alt,microphone,box,plug,suitcase,lightbulb"],
      "features" => ["Swiper gallery + thumbnail","info harga sticky sidebar","tombol WA","galeri fasilitas dengan deskripsi","breadcrumb"]
    ],
    "PriceListPage.jsx" => [
      "status" => "REBUILT - tampilan baru",
      "features" => [
        "Hero gradient biru dengan search bar kuning",
        "Bar keterangan sudah/belum termasuk",
        "Kolom Durasi baru (badge biru)",
        "Harga 0 tampil sebagai 'Hubungi Kami'",
        "Tombol Pesan via WhatsApp (otomatis isi pesan tujuan + durasi)",
        "Footer tabel catatan penting",
        "Reset search button"
      ],
      "dataSource" => "GET /api/price_list.php?keyword=..."
    ],
    "ArmadaPage.jsx" => "Halaman armada lengkap",
    "PaketWisataPage.jsx" => "Halaman paket wisata",
    "NewsPage.jsx" => "Halaman berita",
    "NewsSection.jsx" => "Komponen berita",
    "WhatsAppButton.jsx" => "Floating WA button",
    "Partners.jsx" => "REMOVED dari beranda (file masih ada tapi tidak dipakai)"
  ],
  "knownIssues" => [
    "buses_debug.php dan price_list_debug.php masih ada di /api/ - sebaiknya dihapus setelah selesai testing",
    "Beberapa data MEDAN 10 Hari di price_list harga = 0 (belum ada harga resmi)",
    "Tabel bus: kolom fasilitas (lama) dan fasilitas_json (baru) mungkin keduanya ada - API pakai fasilitas_json",
    "Google Drive MCP: permission error - perlu reconnect di Settings > Connectors"
  ],
  "quickReferences" => [
    "devUrl" => "http://localhost:3003",
    "apiBase" => "http://localhost/bus_pariwisata/api",
    "phpBin" => "C:\\xampp\\php\\php.exe",
    "shell" => "PowerShell - pakai ; bukan && untuk multiple commands",
    "databaseName" => "bus_pariwisata",
    "phpMyAdmin" => "http://localhost/phpmyadmin",
    "whatsappNumber" => "6287785598639",
    "koneksiFile" => "config/koneksi.php",
    "apiConfigFile" => "frontend/src/config/api.js (export API_BASE)",
    "siteDataFile" => "frontend/src/data/siteData.js"
  ]
];

file_put_contents('project_memory.json', json_encode($memory, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
echo "project_memory.json berhasil diupdate ke v1.3.0!\n";
echo "Size: " . filesize('project_memory.json') . " bytes\n";

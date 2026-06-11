-- ============================================================
-- update_fasilitas.sql — Update spesifikasi lengkap 6 bus
-- v3.3.0 - Fasilitas BERBEDA per bus sesuai data aktual
-- Jalankan di phpMyAdmin > database bus_pariwisata > tab SQL
-- ============================================================

USE bus_pariwisata;

-- ------------------------------------------------------------
-- Bus 1 - Big Bus Pratama Trans | 45 kursi
-- Spek unik: Smoking Area + Toilet + Cooler Box
-- ------------------------------------------------------------
UPDATE bus SET
  tipe           = 'big_bus',
  kapasitas      = 45,
  fasilitas_json = '["Seat 3-2","Smoking Area","Toilet","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]',
  deskripsi      = 'Bus besar Pratama Trans dengan kapasitas 45 kursi. Satu-satunya armada yang dilengkapi Smoking Area dan Toilet untuk kenyamanan perjalanan jarak jauh. Fasilitas hiburan lengkap: 2 unit LCD TV, Android Entertainment System, karaoke + microphone, cooler box, Port USB, dan kompartemen bagasi atas & bawah.'
WHERE id = 1;

-- ------------------------------------------------------------
-- Bus 2 - Medium Pratama Trans | 33 kursi
-- Spek: 1 LCD TV (tanpa Cooler Box, Dispenser, Toilet)
-- ------------------------------------------------------------
UPDATE bus SET
  tipe           = 'medium_bus',
  kapasitas      = 33,
  fasilitas_json = '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]',
  deskripsi      = 'Bus medium Pratama Trans dengan kapasitas 33 kursi, cocok untuk perjalanan wisata grup menengah. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.'
WHERE id = 2;

-- ------------------------------------------------------------
-- Bus 3 - Big Bus Pratama Trans | 59 kursi
-- Spek: 2 LCD TV (tanpa Cooler Box, Dispenser)
-- ------------------------------------------------------------
UPDATE bus SET
  tipe           = 'big_bus',
  kapasitas      = 59,
  fasilitas_json = '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]',
  deskripsi      = 'Bus besar Pratama Trans dengan kapasitas 59 kursi dan interior modern. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah untuk kenyamanan rombongan besar.'
WHERE id = 3;

-- ------------------------------------------------------------
-- Bus 4 - Big Bus Pratama Trans | 59 kursi
-- Spek: 2 LCD TV + Dispenser (tanpa Cooler Box)
-- ------------------------------------------------------------
UPDATE bus SET
  tipe           = 'big_bus',
  kapasitas      = 59,
  fasilitas_json = '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]',
  deskripsi      = 'Bus besar Pratama Trans dengan kapasitas 59 kursi, dilengkapi Dispenser air minum, AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah. Pilihan terbaik untuk perjalanan jauh yang nyaman.'
WHERE id = 4;

-- ------------------------------------------------------------
-- Bus 5 - Big Bus Malika Wisata | 59 kursi
-- Spek: 2 LCD TV + Dispenser (tanpa Cooler Box)
-- ------------------------------------------------------------
UPDATE bus SET
  tipe           = 'big_bus',
  kapasitas      = 59,
  fasilitas_json = '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]',
  deskripsi      = 'Bus besar Malika Wisata dengan kapasitas 59 kursi dan desain interior elegan. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.'
WHERE id = 5;

-- ------------------------------------------------------------
-- Bus 6 - Medium Bus Malika Wisata | 31 kursi
-- Spek: 1 LCD TV (tanpa Cooler Box, Dispenser)
-- ------------------------------------------------------------
UPDATE bus SET
  tipe           = 'medium_bus',
  kapasitas      = 31,
  fasilitas_json = '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]',
  deskripsi      = 'Bus medium Malika Wisata dengan kapasitas 31 kursi, armada terbaru yang nyaman untuk wisata grup. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.'
WHERE id = 6;

-- ------------------------------------------------------------
-- Verifikasi hasil
-- ------------------------------------------------------------
SELECT id, nama_bus, tipe, kapasitas, harga_sewa FROM bus ORDER BY id;
SELECT id, nama_bus, LEFT(fasilitas_json, 100) AS fasilitas FROM bus ORDER BY id;
SELECT id, nama_bus, LEFT(deskripsi, 80) AS deskripsi FROM bus ORDER BY id;

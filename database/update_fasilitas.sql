-- ============================================================
-- update_fasilitas.sql — Update fasilitas & deskripsi 6 bus
-- Nama bus disesuaikan dengan bus_fix.sql (Pratama Trans & Malika Wisata)
-- Jalankan di phpMyAdmin > database bus_pariwisata > tab SQL
-- ============================================================

USE bus_pariwisata;

SET @fasilitas = '["Seat 3-2","2 Unit LCD TV","Dispenser","AC","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]';

-- Bus 1 - Pratama Trans (big_bus, 45 kursi)
UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi      = 'Bus besar Pratama Trans dengan kapasitas 45 kursi, dilengkapi fasilitas hiburan lengkap termasuk 2 unit LCD TV, sistem karaoke, dispenser air, dan kompartemen bagasi atas & bawah. Cocok untuk rombongan besar yang menginginkan kenyamanan maksimal dalam perjalanan jauh.'
WHERE id = 1;

-- Bus 2 - Pratama Trans (medium_bus, 33 kursi)
UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi      = 'Bus medium Pratama Trans dengan kapasitas 33 kursi, dilengkapi fasilitas entertainment modern termasuk Android System, karaoke, LCD TV, dan Port USB di setiap baris kursi. Pilihan tepat untuk perjalanan grup menengah yang ingin tetap nyaman dan terhibur sepanjang perjalanan.'
WHERE id = 2;

-- Bus 3 - Pratama Trans (big_bus, 59 kursi)
UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi      = 'Bus besar Pratama Trans dengan kapasitas 59 kursi dan interior modern. Dilengkapi kursi premium Seat 3-2, 2 unit LCD TV, Android Entertainment System, karaoke dengan microphone, serta bagasi atas dan bawah yang luas untuk kenyamanan rombongan.'
WHERE id = 3;

-- Bus 4 - Pratama Trans (big_bus, 59 kursi)
UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi      = 'Bus besar Pratama Trans dengan kapasitas 59 kursi, dilengkapi dispenser air minum terintegrasi, cooler box, karaoke + microphone, Android Entertainment System, dan lampu baca individual di setiap kursi. Armada pilihan terbaik untuk perjalanan jauh yang mewah dan nyaman.'
WHERE id = 4;

-- Bus 5 - Malika Wisata (big_bus, 59 kursi)
UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi      = 'Bus besar Malika Wisata dengan kapasitas 59 kursi dan desain interior elegan. Fasilitas lengkap mencakup Seat 3-2 ergonomis, 2 unit LCD TV, karaoke, Port USB, cooler box, dan kompartemen bagasi ganda. Sempurna untuk wisata grup yang menginginkan perjalanan nyaman dan berkesan.'
WHERE id = 5;

-- Bus 6 - Malika Wisata (big_bus, 59 kursi)
UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi      = 'Bus besar Malika Wisata dengan kapasitas 59 kursi, armada terbaru dengan fasilitas lengkap. Dilengkapi sistem hiburan Android, karaoke, 2 unit LCD TV, AC, dispenser, cooler box, dan kompartemen bagasi atas & bawah untuk kenyamanan maksimal perjalanan wisata rombongan.'
WHERE id = 6;

-- Verifikasi hasil
SELECT id, nama_bus, tipe, kapasitas, LEFT(deskripsi, 60) AS deskripsi_preview, LEFT(fasilitas_json, 50) AS fasilitas_preview
FROM bus
ORDER BY id;

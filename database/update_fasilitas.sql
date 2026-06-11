-- ============================================================
-- Update fasilitas lengkap untuk semua 5 bus
-- Jalankan di phpMyAdmin > tab SQL
-- ============================================================

USE bus_pariwisata;

-- Fasilitas lengkap semua bus (sama, karena ini spesifikasi armada)
SET @fasilitas = '["Seat 3-2","2 Unit LCD TV","Dispenser","AC","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]';

UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi = 'Bus besar Zahra Ayu dengan kapasitas 45 kursi, dilengkapi fasilitas hiburan lengkap termasuk LCD TV, sistem karaoke, dispenser air, dan kompartemen bagasi atas & bawah. Cocok untuk rombongan besar yang menginginkan kenyamanan maksimal dalam perjalanan jauh.'
WHERE id = 1;

UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi = 'Bus medium Wong Kudus dengan kapasitas 30 kursi, dilengkapi fasilitas entertainment modern termasuk Android System, karaoke, LCD TV, dan Port USB di setiap baris kursi. Pilihan tepat untuk perjalanan grup menengah yang ingin tetap nyaman dan terhibur sepanjang perjalanan.'
WHERE id = 2;

UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi = 'Bus besar William dengan kapasitas 45 kursi dan interior modern. Dilengkapi kursi premium Seat 3-2, 2 unit LCD TV, Android Entertainment System, karaoke dengan microphone, serta bagasi atas dan bawah yang luas untuk kenyamanan rombongan.'
WHERE id = 3;

UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi = 'Bus besar White Horse dengan kapasitas 45 kursi, dilengkapi dispenser air minum terintegrasi, cooler box, karaoke + microphone, Android Entertainment System, dan lampu baca individual di setiap kursi. Armada pilihan terbaik untuk perjalanan jauh yang mewah dan nyaman.'
WHERE id = 4;

UPDATE bus SET
  fasilitas_json = @fasilitas,
  deskripsi = 'Bus medium Starbus dengan kapasitas 30 kursi dan desain interior elegan. Fasilitas lengkap mencakup Seat 3-2 ergonomis, LCD TV, karaoke, Port USB, cooler box, dan kompartemen bagasi ganda. Sempurna untuk wisata grup dengan anggaran efisien namun tetap premium.'
WHERE id = 5;

-- Verifikasi
SELECT id, nama_bus, kapasitas, LEFT(fasilitas_json, 80) AS fasilitas_preview FROM bus;

-- ============================================================
-- Update Spesifikasi 6 Bus sesuai data terbaru
-- Jalankan di phpMyAdmin > bus_pariwisata > tab SQL
-- ============================================================

USE bus_pariwisata;

-- ------------------------------------------------------------
-- Bus 1: Big Bus Pratama Trans (45 Seat)
-- ------------------------------------------------------------
UPDATE bus SET
  nama_bus      = 'Pratama Trans',
  tipe          = 'big_bus',
  kapasitas     = 45,
  deskripsi     = 'Big Bus Pratama Trans dengan kapasitas 45 kursi. Dilengkapi Smoking Area dan Toilet untuk kenyamanan perjalanan jauh.',
  fasilitas_json = '["45 Seat","Smoking Area + Toilet","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'
WHERE id = 1;

-- ------------------------------------------------------------
-- Bus 2: Medium Pratama Trans (33 Seat)
-- ------------------------------------------------------------
UPDATE bus SET
  nama_bus      = 'Pratama Trans',
  tipe          = 'medium_bus',
  kapasitas     = 33,
  deskripsi     = 'Medium Bus Pratama Trans dengan kapasitas 33 kursi. Cocok untuk perjalanan grup menengah dengan fasilitas hiburan lengkap.',
  fasilitas_json = '["33 Seat","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'
WHERE id = 2;

-- ------------------------------------------------------------
-- Bus 3: Big Bus Pratama Trans (59 Seat)
-- ------------------------------------------------------------
UPDATE bus SET
  nama_bus      = 'Pratama Trans',
  tipe          = 'big_bus',
  kapasitas     = 59,
  deskripsi     = 'Big Bus Pratama Trans dengan kapasitas 59 kursi. Armada terbesar untuk rombongan besar dengan fasilitas hiburan modern.',
  fasilitas_json = '["59 Seat","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'
WHERE id = 3;

-- ------------------------------------------------------------
-- Bus 4: Big Bus Pratama Trans (59 Seat + Dispenser)
-- ------------------------------------------------------------
UPDATE bus SET
  nama_bus      = 'Pratama Trans',
  tipe          = 'big_bus',
  kapasitas     = 59,
  deskripsi     = 'Big Bus Pratama Trans dengan kapasitas 59 kursi, dilengkapi Dispenser air minum untuk kenyamanan perjalanan jarak jauh.',
  fasilitas_json = '["59 Seat","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'
WHERE id = 4;

-- ------------------------------------------------------------
-- Bus 5: Big Bus Malika Wisata (59 Seat + Dispenser)
-- ------------------------------------------------------------
UPDATE bus SET
  nama_bus      = 'Malika Wisata',
  tipe          = 'big_bus',
  kapasitas     = 59,
  deskripsi     = 'Big Bus Malika Wisata dengan kapasitas 59 kursi, dilengkapi Dispenser air minum dan fasilitas hiburan lengkap untuk perjalanan premium.',
  fasilitas_json = '["59 Seat","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'
WHERE id = 5;

-- ------------------------------------------------------------
-- Bus 6: Medium Bus Malika Wisata (31 Seat)
-- ------------------------------------------------------------
UPDATE bus SET
  nama_bus      = 'Malika Wisata',
  tipe          = 'medium_bus',
  kapasitas     = 31,
  deskripsi     = 'Medium Bus Malika Wisata dengan kapasitas 31 kursi. Pilihan nyaman untuk perjalanan grup dengan fasilitas entertainment modern.',
  fasilitas_json = '["31 Seat","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'
WHERE id = 6;

-- ------------------------------------------------------------
-- Verifikasi
-- ------------------------------------------------------------
SELECT id, nama_bus, tipe, kapasitas, LEFT(fasilitas_json, 60) AS fasilitas_preview
FROM bus ORDER BY id;

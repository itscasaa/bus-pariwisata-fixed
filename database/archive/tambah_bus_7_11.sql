-- ============================================================
-- tambah_bus_7_11.sql — INSERT bus 7-11 + bus_images
-- Lanjutan dari bus 6 (Malika Wisata)
-- Jalankan di phpMyAdmin > database bus_pariwisata > tab SQL
-- ============================================================

USE bus_pariwisata;

-- ------------------------------------------------------------
-- Bus 7 - Big Bus Malika Wisata | 59 kursi
-- Spek: 2 LCD TV + Dispenser (tanpa Cooler Box, Toilet)
-- ------------------------------------------------------------
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(7, 'Malika Wisata', 'big_bus', 59, 3500000,
 'bus7/bus1.jpeg',
 'Bus besar Malika Wisata dengan kapasitas 59 kursi. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'
);

-- ------------------------------------------------------------
-- Bus 8 - Big Bus Malika Wisata | 45 kursi
-- Spek unik: Smoking Room + Toilet + Dispenser + 2 LCD TV
-- ------------------------------------------------------------
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(8, 'Malika Wisata', 'big_bus', 45, 4500000,
 'bus8/bus1.jpeg',
 'Bus besar Malika Wisata dengan kapasitas 45 kursi, dilengkapi Smoking Room dan Toilet untuk kenyamanan perjalanan jarak jauh. Fasilitas: 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","Smoking Room","Toilet","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'
);

-- ------------------------------------------------------------
-- Bus 9 - Big Bus Malika Wisata | 48 kursi
-- Spek: 2 LCD TV + Dispenser (tanpa Cooler Box, Toilet)
-- ------------------------------------------------------------
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(9, 'Malika Wisata', 'big_bus', 48, 3500000,
 'bus9/bus1.jpeg',
 'Bus besar Malika Wisata dengan kapasitas 48 kursi. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'
);

-- ------------------------------------------------------------
-- Bus 10 - Medium Long Malika Wisata | 35 kursi
-- Spek: 1 LCD TV + Dispenser
-- ------------------------------------------------------------
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(10, 'Malika Wisata', 'medium_long', 35, 3000000,
 'bus10/bus1.jpeg',
 'Bus medium long Malika Wisata dengan kapasitas 35 kursi, ideal untuk grup menengah dengan perjalanan jauh. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'
);

-- ------------------------------------------------------------
-- Bus 11 - Medium Bus Malika Wisata | 31 kursi
-- Spek: 1 LCD TV (tanpa Cooler Box, Dispenser)
-- ------------------------------------------------------------
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(11, 'Malika Wisata', 'medium_bus', 31, 3000000,
 'bus11/bus1.jpeg',
 'Bus medium Malika Wisata dengan kapasitas 31 kursi. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'
);

-- ------------------------------------------------------------
-- INSERT bus_images untuk bus 7-11
-- Semua hanya 1 gambar (bus1.jpeg) per folder
-- ------------------------------------------------------------
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(7,  'bus7/bus1.jpeg',  'Eksterior Bus', 0),
(8,  'bus8/bus1.jpeg',  'Eksterior Bus', 0),
(9,  'bus9/bus1.jpeg',  'Eksterior Bus', 0),
(10, 'bus10/bus1.jpeg', 'Eksterior Bus', 0),
(11, 'bus11/bus1.jpeg', 'Eksterior Bus', 0);

-- ------------------------------------------------------------
-- Verifikasi hasil
-- ------------------------------------------------------------
SELECT id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama FROM bus ORDER BY id;
SELECT bi.bus_id, b.nama_bus, bi.path FROM bus_images bi JOIN bus b ON bi.bus_id = b.id WHERE bi.bus_id >= 7 ORDER BY bi.bus_id;
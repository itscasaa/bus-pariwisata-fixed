-- ============================================================
-- bus_pariwisata_FULL.sql
-- Database lengkap untuk deploy (InfinityFree / hosting manapun)
-- Berisi: semua tabel + 11 bus + bus_images + price_list (35 data)
-- Dibuat: 2026-05-22 | Versi: FINAL
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- DROP tabel lama (urutan aman)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS bus_images;
DROP TABLE IF EXISTS bus;
DROP TABLE IF EXISTS price_list;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS pesan_masuk;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- TABEL: bus
-- ============================================================
CREATE TABLE bus (
  id             INT           PRIMARY KEY AUTO_INCREMENT,
  nama_bus       VARCHAR(100)  NOT NULL,
  tipe           VARCHAR(50)   NOT NULL DEFAULT 'big_bus',
  kapasitas      INT           NOT NULL,
  harga_sewa     BIGINT        NOT NULL DEFAULT 0,
  gambar_utama   VARCHAR(255)  NOT NULL DEFAULT '',
  deskripsi      TEXT          NULL,
  fasilitas_json TEXT          NULL,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL: bus_images
-- ============================================================
CREATE TABLE bus_images (
  id       INT           PRIMARY KEY AUTO_INCREMENT,
  bus_id   INT           NOT NULL,
  path     VARCHAR(255)  NOT NULL,
  label    VARCHAR(100)  NULL,
  urutan   INT           DEFAULT 0,
  FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL: price_list
-- ============================================================
CREATE TABLE price_list (
  id             INT           PRIMARY KEY AUTO_INCREMENT,
  nama_destinasi VARCHAR(200)  NOT NULL,
  durasi         VARCHAR(50)   NOT NULL DEFAULT '',
  harga_hiace    BIGINT        NOT NULL DEFAULT 0,
  harga_elf      BIGINT        NOT NULL DEFAULT 0,
  harga_medium   BIGINT        NOT NULL DEFAULT 0,
  harga_big      BIGINT        NOT NULL DEFAULT 0,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL: booking
-- ============================================================
CREATE TABLE booking (
  id       INT           PRIMARY KEY AUTO_INCREMENT,
  nama     VARCHAR(100)  NOT NULL,
  no_hp    VARCHAR(20)   NOT NULL,
  email    VARCHAR(100)  NULL,
  tanggal  VARCHAR(50)   NOT NULL,
  tujuan   VARCHAR(200)  NOT NULL,
  jumlah   INT           NULL,
  bus_id   INT           NULL,
  created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABEL: pesan_masuk
-- ============================================================
CREATE TABLE pesan_masuk (
  id       INT           PRIMARY KEY AUTO_INCREMENT,
  nama     VARCHAR(100)  NOT NULL,
  email    VARCHAR(100)  NOT NULL,
  judul    VARCHAR(200)  NOT NULL,
  pesan    TEXT          NOT NULL,
  created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INSERT: 11 BUS (fasilitas berbeda per bus)
-- ============================================================

-- Bus 1 - Big Bus Pratama Trans | 45 kursi | Smoking Area + Toilet + Cooler Box
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(1, 'Pratama Trans', 'big_bus', 45, 4500000,
 'bus1/bu1.jpeg',
 'Bus besar Pratama Trans dengan kapasitas 45 kursi. Satu-satunya armada yang dilengkapi Smoking Area dan Toilet untuk kenyamanan perjalanan jarak jauh. Fasilitas hiburan lengkap: 2 unit LCD TV, Android Entertainment System, karaoke + microphone, cooler box, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","Smoking Area","Toilet","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]');

-- Bus 2 - Medium Pratama Trans | 33 kursi | 1 LCD TV
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(2, 'Pratama Trans', 'medium_bus', 33, 3000000,
 'bus2/mini_bus2.jpeg',
 'Bus medium Pratama Trans dengan kapasitas 33 kursi, cocok untuk perjalanan wisata grup menengah. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]');

-- Bus 3 - Big Bus Pratama Trans | 59 kursi | 2 LCD TV
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(3, 'Pratama Trans', 'big_bus', 59, 4500000,
 'bus3/bus3.jpeg',
 'Bus besar Pratama Trans dengan kapasitas 59 kursi dan interior modern. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah untuk kenyamanan rombongan besar.',
 '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]');

-- Bus 4 - Big Bus Pratama Trans | 59 kursi | 2 LCD TV + Dispenser
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(4, 'Pratama Trans', 'big_bus', 59, 5000000,
 'bus4/bus4.jpeg',
 'Bus besar Pratama Trans dengan kapasitas 59 kursi, dilengkapi Dispenser air minum, AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah. Pilihan terbaik untuk perjalanan jauh yang nyaman.',
 '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]');

-- Bus 5 - Big Bus Malika Wisata | 59 kursi | 2 LCD TV + Dispenser
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(5, 'Malika Wisata', 'big_bus', 59, 3500000,
 'bus5/bus5.jpeg',
 'Bus besar Malika Wisata dengan kapasitas 59 kursi dan desain interior elegan. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]');

-- Bus 6 - Medium Bus Malika Wisata | 31 kursi | 1 LCD TV
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(6, 'Malika Wisata', 'medium_bus', 31, 3500000,
 'bus6/bus6.jpeg',
 'Bus medium Malika Wisata dengan kapasitas 31 kursi, armada terbaru yang nyaman untuk wisata grup. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]');

-- Bus 7 - Big Bus Malika Wisata | 59 kursi | 2 LCD TV + Dispenser
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(7, 'Malika Wisata', 'big_bus', 59, 3500000,
 'bus7/bus1.jpeg',
 'Bus besar Malika Wisata dengan kapasitas 59 kursi. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]');

-- Bus 8 - Big Bus Malika Wisata | 45 kursi | Smoking Room + Toilet + 2 LCD TV + Dispenser
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(8, 'Malika Wisata', 'big_bus', 45, 4500000,
 'bus8/bus1.jpeg',
 'Bus besar Malika Wisata dengan kapasitas 45 kursi, dilengkapi Smoking Room dan Toilet untuk kenyamanan perjalanan jarak jauh. Fasilitas: 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","Smoking Room","Toilet","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]');

-- Bus 9 - Big Bus Malika Wisata | 48 kursi | 2 LCD TV + Dispenser
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(9, 'Malika Wisata', 'big_bus', 48, 3500000,
 'bus9/bus1.jpeg',
 'Bus besar Malika Wisata dengan kapasitas 48 kursi. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]');

-- Bus 10 - Medium Long Malika Wisata | 35 kursi | 1 LCD TV + Dispenser
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(10, 'Malika Wisata', 'medium_long', 35, 3000000,
 'bus10/bus1.jpeg',
 'Bus medium long Malika Wisata dengan kapasitas 35 kursi, ideal untuk grup menengah dengan perjalanan jauh. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]');

-- Bus 11 - Medium Bus Malika Wisata | 31 kursi | 1 LCD TV
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(11, 'Malika Wisata', 'medium_bus', 31, 3000000,
 'bus11/bus1.jpeg',
 'Bus medium Malika Wisata dengan kapasitas 31 kursi. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.',
 '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]');

-- ============================================================
-- INSERT: bus_images (semua bus)
-- ============================================================

-- Bus 1 - Pratama Trans (bus1/) — 3 gambar
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(1, 'bus1/bu1.jpeg',             'Eksterior Bus',   0),
(1, 'bus1/bangku_depan.jpeg',    'Bangku Depan',    1),
(1, 'bus1/bangku_belakang.jpeg', 'Bangku Belakang', 2);

-- Bus 2 - Pratama Trans (bus2/) — 5 gambar
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(2, 'bus2/mini_bus2.jpeg',       'Eksterior Bus',   0),
(2, 'bus2/supir.jpeg',           'Area Supir',      1),
(2, 'bus2/bangku_depan.jpeg',    'Bangku Depan',    2),
(2, 'bus2/bangku_depan2.jpeg',   'Bangku Depan 2',  3),
(2, 'bus2/bangku_belakang.jpeg', 'Bangku Belakang', 4);

-- Bus 3 - Pratama Trans (bus3/) — 5 gambar
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(3, 'bus3/bus3.jpeg',            'Eksterior Bus',   0),
(3, 'bus3/bangku_depan.jpeg',    'Bangku Depan',    1),
(3, 'bus3/bangku_depan1.jpeg',   'Bangku Depan 1',  2),
(3, 'bus3/bangku_depan2.jpeg',   'Bangku Depan 2',  3),
(3, 'bus3/bangku_belakang.jpeg', 'Bangku Belakang', 4);

-- Bus 4 - Pratama Trans (bus4/) — 5 gambar
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(4, 'bus4/bus4.jpeg',             'Eksterior Bus',     0),
(4, 'bus4/bangku_depan.jpeg',     'Bangku Depan',      1),
(4, 'bus4/bangku_belakang.jpeg',  'Bangku Belakang',   2),
(4, 'bus4/bangku_belakang2.jpeg', 'Bangku Belakang 2', 3),
(4, 'bus4/dispenser.jpeg',        'Dispenser Air',     4);

-- Bus 5 - Malika Wisata (bus5/) — 3 gambar
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(5, 'bus5/bus5.jpeg',          'Eksterior Bus',  0),
(5, 'bus5/bangku_depan.jpeg',  'Bangku Depan',   1),
(5, 'bus5/bangku_depan2.jpeg', 'Bangku Depan 2', 2);

-- Bus 6 - Malika Wisata (bus6/) — 1 gambar
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(6, 'bus6/bus6.jpeg', 'Eksterior Bus', 0);

-- Bus 7-11 - Malika Wisata — masing-masing 1 gambar
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(7,  'bus7/bus1.jpeg',  'Eksterior Bus', 0),
(8,  'bus8/bus1.jpeg',  'Eksterior Bus', 0),
(9,  'bus9/bus1.jpeg',  'Eksterior Bus', 0),
(10, 'bus10/bus1.jpeg', 'Eksterior Bus', 0),
(11, 'bus11/bus1.jpeg', 'Eksterior Bus', 0);

-- ============================================================
-- INSERT: price_list (35 destinasi)
-- harga 0 = Hubungi Kami (ditampilkan di frontend)
-- ============================================================
INSERT INTO price_list (nama_destinasi, durasi, harga_hiace, harga_elf, harga_medium, harga_big) VALUES
('TRANSFER IN/OUT (One Way)',                                                 '4 Jam',   1250000,  1350000,  1750000,  2250000),
('DK HALF DAY',                                                               '8 Jam',   1400000,  1400000,  1900000,  2500000),
('DK FULL DAY',                                                               '12 Jam',  1500000,  1500000,  2000000,  2750000),
('JAKARTA, DEPOK, BEKASI, BSD',                                               '12 Jam',  1500000,  1500000,  2000000,  2750000),
('SENTUL, BOGOR KOTA, TAMBUN, CIKARANG',                                      '12 Jam',  1650000,  1650000,  2500000,  3250000),
('CIAWI, MEGAMENDUNG, TAMAN SAFARI, KARAWANG',                                '15 Jam',  1750000,  1750000,  2750000,  3750000),
('CIBODAS, CIMACAN, CIPANAS',                                                 '15 Jam',  1900000,  1900000,  3000000,  4250000),
('SUKABUMI KOTA',                                                             '15 Jam',  1900000,  1900000,  3000000,  4250000),
('BANTEN',                                                                    '18 Jam',  2000000,  2000000,  3500000,  4500000),
('PURWAKARTA',                                                                '18 Jam',  2000000,  2000000,  3500000,  4500000),
('ANYER, SERANG, CARITA',                                                     '18 Jam',  2000000,  2000000,  3500000,  4500000),
('BANDUNG KOTA, LEMBANG, CIMAHI',                                             '18 Jam',  2250000,  2250000,  3700000,  4750000),
('CIWIDEY, PENGALENGAN, SUMEDANG',                                            '18 Jam',  2400000,  2400000,  4000000,  5250000),
('GARUT, TASIKMALAYA',                                                        '18 Jam',  2500000,  2500000,  4500000,  5750000),
('INDRAMAYU, CIREBON, BREBES, KUNINGAN',                                      '18 Jam',  2500000,  2500000,  4500000,  5750000),
('CIAWI, MEGAMENDUNG, CISARUA, TAMAN SAFARI, KARAWANG',                       '2 Hari',  3250000,  3250000,  5050000,  6750000),
('CIBODAS, CIMACAN, CIPANAS, CILOTO, SUKABUMI KOTA',                          '2 Hari',  3500000,  3500000,  5500000,  7750000),
('PURWAKARTA',                                                                '2 Hari',  3500000,  3500000,  5500000,  7750000),
('ANYER, BANTEN, PANDEGLANG, SERANG, CARITA, SUBANG, CIANJUR',                '2 Hari',  3750000,  3750000,  6250000,  8250000),
('BANDUNG, LEMBANG, CIMAHI, TANGKUBAN PRAHU, CIATER',                         '2 Hari',  4000000,  4000000,  6750000,  8750000),
('GARUT, TASIK, KUNINGAN, CIREBON, CIAMIS, SAWARNA, CILETUH',                 '2 Hari',  4500000,  4500000,  7750000,  10250000),
('LAMPUNG',                                                                   '2 Hari',  6000000,  6000000,  9000000,  12500000),
('GUCI, TEGAL, BREBES, PEKALONGAN, CILACAP, PANGANDARAN, DIENG, WONOSOBO',    '2 Hari',  6000000,  6000000,  9000000,  12500000),
('LAMPUNG',                                                                   '3 Hari',  8250000,  8250000,  12000000, 17000000),
('GUCI, TEGAL, BREBES, PEKALONGAN, CILACAP, PANGANDARAN, DIENG, WONOSOBO',    '3 Hari',  6750000,  6750000,  10000000, 14250000),
('YOGYAKARTA, SEMARANG, DEMAK',                                               '3 Hari',  7500000,  7500000,  11250000, 15650000),
('YOGYAKARTA, SEMARANG, DEMAK',                                               '4 Hari',  9000000,  9000000,  14000000, 19000000),
('SURABAYA, MALANG, BROMO',                                                   '4 Hari',  10000000, 10000000, 15000000, 20500000),
('PALEMBANG',                                                                 '4 Hari',  11000000, 11000000, 16000000, 22500000),
('SURABAYA, MALANG, BROMO',                                                   '5 Hari',  11250000, 11250000, 17500000, 23750000),
('BENGKULU, JAMBI',                                                           '5 Hari',  13750000, 13750000, 20000000, 28250000),
('BALI, LOMBOK',                                                              '7 Hari',  15250000, 15250000, 24500000, 33500000),
('PEKANBARU, RIAU, PADANG',                                                   '8 Hari',  22000000, 22000000, 32000000, 45000000),
('BALI, LOMBOK',                                                              '10 Hari', 22500000, 22500000, 35000000, 47000000),
('MEDAN',                                                                     '10 Hari', 0,        0,        0,        0);

-- ============================================================
-- VERIFIKASI AKHIR
-- ============================================================
SELECT id, nama_bus, tipe, kapasitas, harga_sewa FROM bus ORDER BY id;
SELECT COUNT(*) AS total_bus FROM bus;
SELECT COUNT(*) AS total_images FROM bus_images;
SELECT COUNT(*) AS total_price_list FROM price_list;
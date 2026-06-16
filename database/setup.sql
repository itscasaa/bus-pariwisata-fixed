-- ============================================================
-- database/setup.sql
-- Setup database LENGKAP Surya Tour Trans (FILE TUNGGAL)
-- Versi: FINAL | Kompatibel: XAMPP, InfinityFree, VPS (MySQL/MariaDB)
--
-- Tabel: admin_users, bus, bus_images, price_list,
--        paket_wisata, news, pesan_masuk, booking
--
-- Cara pakai:
--   phpMyAdmin -> pilih database -> tab SQL -> paste & jalankan
--   atau: mysql -u root -p bus_pariwisata < database/setup.sql
--
-- ------------------------------------------------------------
-- !!! PERINGATAN SEBELUM IMPORT KE HOSTING LIVE !!!
--   1. BACKUP database yang ada terlebih dahulu.
--   2. Jangan import sembarangan jika data live penting.
--   3. File ini untuk setup baru ATAU perbaikan terkontrol.
--   4. Untuk perbaikan password admin saja, pakai query UPDATE
--      di bagian paling bawah file ini.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================
-- TABLE: admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama       VARCHAR(100) NOT NULL,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: bus
-- ============================================================
CREATE TABLE IF NOT EXISTS bus (
  id             INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama_bus       VARCHAR(100)  NOT NULL,
  tipe           VARCHAR(50)   NOT NULL DEFAULT 'big_bus',
  kapasitas      INT           NOT NULL DEFAULT 0,
  harga_sewa     BIGINT        NOT NULL DEFAULT 0,
  gambar_utama   VARCHAR(255)  NOT NULL DEFAULT '',
  deskripsi      TEXT          NULL,
  fasilitas_json TEXT          NULL,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: bus_images
-- ============================================================
CREATE TABLE IF NOT EXISTS bus_images (
  id       INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  bus_id   INT           NOT NULL,
  path     VARCHAR(255)  NOT NULL,
  label    VARCHAR(100)  NULL,
  urutan   INT           DEFAULT 0,
  FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: price_list
-- ============================================================
CREATE TABLE IF NOT EXISTS price_list (
  id             INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama_destinasi VARCHAR(200)  NOT NULL,
  durasi         VARCHAR(50)   NOT NULL DEFAULT '',
  harga_hiace    BIGINT        NOT NULL DEFAULT 0,
  harga_elf      BIGINT        NOT NULL DEFAULT 0,
  harga_medium   BIGINT        NOT NULL DEFAULT 0,
  harga_big      BIGINT        NOT NULL DEFAULT 0,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: paket_wisata
-- ============================================================
CREATE TABLE IF NOT EXISTS paket_wisata (
  id         INT                        NOT NULL AUTO_INCREMENT PRIMARY KEY,
  judul      VARCHAR(200)               NOT NULL,
  badge      VARCHAR(100)               NOT NULL DEFAULT '',
  kategori   VARCHAR(50)                NOT NULL DEFAULT '',
  durasi     VARCHAR(100)               NOT NULL DEFAULT '',
  harga      BIGINT                     NOT NULL DEFAULT 0,
  deskripsi  TEXT                       NULL,
  gambar     VARCHAR(255)               NULL,
  status     ENUM('aktif','nonaktif')   NOT NULL DEFAULT 'aktif',
  urutan     INT                        NOT NULL DEFAULT 0,
  created_at TIMESTAMP                  DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP                  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: news
-- Catatan: kolom `ringkas` opsional. API akan menurunkan ringkas
-- dari `konten` jika kolom ini kosong/tidak ada.
-- ============================================================
CREATE TABLE IF NOT EXISTS news (
  id         INT                       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  judul      VARCHAR(255)              NOT NULL,
  slug       VARCHAR(255)              NOT NULL UNIQUE,
  ringkas    TEXT                      NULL,
  konten     TEXT                      NOT NULL,
  gambar     VARCHAR(255)              NULL,
  status     ENUM('publish','draft')   NOT NULL DEFAULT 'publish',
  created_at TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: pesan_masuk
-- ============================================================
CREATE TABLE IF NOT EXISTS pesan_masuk (
  id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  judul      VARCHAR(200) NOT NULL DEFAULT '',
  pesan      TEXT         NOT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: booking
-- ============================================================
CREATE TABLE IF NOT EXISTS booking (
  id         INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama       VARCHAR(100)  NOT NULL,
  no_hp      VARCHAR(20)   NOT NULL,
  email      VARCHAR(100)  NULL,
  tanggal    VARCHAR(50)   NOT NULL,
  tujuan     VARCHAR(200)  NOT NULL,
  jumlah     INT           NULL,
  bus_id     INT           NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SEED: admin_users
-- username: admin | password: admin123
-- Hash bcrypt untuk 'admin123' (terverifikasi dengan password_verify).
-- PENTING: Ganti password setelah deploy production!
-- ============================================================
INSERT INTO admin_users (id, nama, username, password)
VALUES (1, 'Administrator', 'mafina_admin_pariwisata', '$2y$10$RR5g4gN3iQHuCLXu6uyvAenAS.Y9ZUByvG9ULmWCT.q9qe3JNHOX.')
ON DUPLICATE KEY UPDATE id = id;

-- ============================================================
-- SEED: bus (11 armada — data final)
-- Path gambar disimpan relatif (mis. 'bus1/bu1.jpeg').
-- API (api/buses.php) menormalkan menjadi '/images/bus1/bu1.jpeg'.
-- ============================================================
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(1,  'Pratama Trans', 'big_bus',     45, 4500000, 'bus1/bu1.jpeg',      'Bus besar Pratama Trans dengan kapasitas 45 kursi. Dilengkapi Smoking Area dan Toilet untuk kenyamanan perjalanan jarak jauh. Fasilitas hiburan lengkap: 2 unit LCD TV, Android Entertainment System, karaoke + microphone, cooler box, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","Smoking Area","Toilet","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'),
(2,  'Pratama Trans', 'medium_bus',  33, 3000000, 'bus2/mini_bus2.jpeg','Bus medium Pratama Trans dengan kapasitas 33 kursi. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'),
(3,  'Pratama Trans', 'big_bus',     59, 4500000, 'bus3/bus3.jpeg',     'Bus besar Pratama Trans dengan kapasitas 59 kursi dan interior modern. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'),
(4,  'Pratama Trans', 'big_bus',     59, 5000000, 'bus4/bus4.jpeg',     'Bus besar Pratama Trans dengan kapasitas 59 kursi, dilengkapi Dispenser air minum, AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'),
(5,  'Malika Wisata', 'big_bus',     59, 3500000, 'bus5/bus5.jpeg',     'Bus besar Malika Wisata dengan kapasitas 59 kursi dan desain interior elegan. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'),
(6,  'Malika Wisata', 'medium_bus',  31, 3500000, 'bus6/bus6.jpeg',     'Bus medium Malika Wisata dengan kapasitas 31 kursi, armada terbaru yang nyaman untuk wisata grup. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]'),
(7,  'Malika Wisata', 'big_bus',     59, 3500000, 'bus7/bus1.jpeg',     'Bus besar Malika Wisata dengan kapasitas 59 kursi. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'),
(8,  'Malika Wisata', 'big_bus',     45, 4500000, 'bus8/bus1.jpeg',     'Bus besar Malika Wisata dengan kapasitas 45 kursi, dilengkapi Smoking Room dan Toilet. Fasilitas: 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","Smoking Room","Toilet","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'),
(9,  'Malika Wisata', 'big_bus',     48, 3500000, 'bus9/bus1.jpeg',     'Bus besar Malika Wisata dengan kapasitas 48 kursi. Dilengkapi AC, 2 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","2 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'),
(10, 'Malika Wisata', 'medium_long', 35, 3000000, 'bus10/bus1.jpeg',    'Bus medium long Malika Wisata dengan kapasitas 35 kursi. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Dispenser air minum, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca","Dispenser"]'),
(11, 'Malika Wisata', 'medium_bus',  31, 3000000, 'bus11/bus1.jpeg',    'Bus medium Malika Wisata dengan kapasitas 31 kursi. Dilengkapi AC, 1 unit LCD TV, Android Entertainment System, karaoke + microphone, Port USB, dan kompartemen bagasi atas & bawah.', '["Seat 3-2","AC","1 Unit LCD TV","Audio Set","Android Entertainment System","Karaoke + Microphone","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]')
ON DUPLICATE KEY UPDATE id = id;

-- ============================================================
-- SEED: bus_images
-- ============================================================
INSERT IGNORE INTO bus_images (bus_id, path, label, urutan) VALUES
(1, 'bus1/bu1.jpeg',             'Eksterior Bus',   0),
(1, 'bus1/bangku_depan.jpeg',    'Bangku Depan',    1),
(1, 'bus1/bangku_belakang.jpeg', 'Bangku Belakang', 2),
(2, 'bus2/mini_bus2.jpeg',       'Eksterior Bus',   0),
(2, 'bus2/supir.jpeg',           'Area Supir',      1),
(2, 'bus2/bangku_depan.jpeg',    'Bangku Depan',    2),
(2, 'bus2/bangku_depan2.jpeg',   'Bangku Depan 2',  3),
(2, 'bus2/bangku_belakang.jpeg', 'Bangku Belakang', 4),
(3, 'bus3/bus3.jpeg',            'Eksterior Bus',   0),
(3, 'bus3/bangku_depan.jpeg',    'Bangku Depan',    1),
(3, 'bus3/bangku_depan1.jpeg',   'Bangku Depan 1',  2),
(3, 'bus3/bangku_depan2.jpeg',   'Bangku Depan 2',  3),
(3, 'bus3/bangku_belakang.jpeg', 'Bangku Belakang', 4),
(4, 'bus4/bus4.jpeg',             'Eksterior Bus',     0),
(4, 'bus4/bangku_depan.jpeg',     'Bangku Depan',      1),
(4, 'bus4/bangku_belakang.jpeg',  'Bangku Belakang',   2),
(4, 'bus4/bangku_belakang2.jpeg', 'Bangku Belakang 2', 3),
(4, 'bus4/dispenser.jpeg',        'Dispenser Air',     4),
(5, 'bus5/bus5.jpeg',             'Eksterior Bus',  0),
(5, 'bus5/bangku_depan.jpeg',     'Bangku Depan',   1),
(5, 'bus5/bangku_depan2.jpeg',    'Bangku Depan 2', 2),
(6,  'bus6/bus6.jpeg',  'Eksterior Bus', 0),
(7,  'bus7/bus1.jpeg',  'Eksterior Bus', 0),
(8,  'bus8/bus1.jpeg',  'Eksterior Bus', 0),
(9,  'bus9/bus1.jpeg',  'Eksterior Bus', 0),
(10, 'bus10/bus1.jpeg', 'Eksterior Bus', 0),
(11, 'bus11/bus1.jpeg', 'Eksterior Bus', 0);

-- ============================================================
-- SEED: paket_wisata (16 paket)
-- Path gambar '/images/destinasi/...' (sudah production-safe).
-- ============================================================
INSERT INTO paket_wisata (id, judul, badge, kategori, durasi, harga, deskripsi, gambar, status, urutan) VALUES
(1,  'Bandung',              'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2200000, 'Jelajahi keindahan Bandung, mulai dari belanja di factory outlet hingga menikmati udara sejuk pegunungan.',                           '/images/destinasi/bandung.jpeg',           'aktif', 1),
(2,  'Taman Bunga Nusantara','PAKET 1 HARI',  '1 Hari',  '1 Hari',          2500000, 'Nikmati keindahan taman bunga terbesar di Indonesia dengan koleksi bunga dari seluruh dunia.',                                        '/images/destinasi/bunga_nusantara.jpeg',   'aktif', 2),
(3,  'Kebun Raya Bogor',     'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2300000, 'Wisata alam yang menyegarkan di kebun raya dengan koleksi tumbuhan langka dan udara pegunungan yang sejuk.',                         '/images/destinasi/kebun_cibodas.jpeg',     'aktif', 3),
(4,  'Anyer',                'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2600000, 'Nikmati keindahan pantai Anyer dengan pasir putih dan sunset yang memukau.',                                                          '/images/destinasi/anyer.jpeg',             'aktif', 4),
(5,  'Taman Safari',         'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2700000, 'Petualangan seru bersama satwa liar di Taman Safari dengan berbagai atraksi menarik.',                                               '/images/destinasi/taman_safari.jpeg',      'aktif', 5),
(6,  'Maribaya Bandung',     'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2200000, 'Wisata alam dengan pemandian air hangat, curug, dan hutan pinus yang asri.',                                                         '/images/destinasi/maribaya_bandung.jpeg',  'aktif', 6),
(7,  'Taman Mini',           'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2500000, 'Jelajahi kebudayaan Indonesia dalam satu tempat di Taman Mini Indonesia Indah.',                                                     '/images/destinasi/taman_mini.jpeg',        'aktif', 7),
(8,  'Cimory Dierland Bogor','PAKET 1 HARI',  '1 Hari',  '1 Hari',          2300000, 'Wisata kuliner dan dairy farm di Cimory dengan pemandangan pegunungan yang indah.',                                                  '/images/destinasi/bogor-cimory.jpeg',      'aktif', 8),
(9,  'Tangkuban Perahu',     'PAKET 2 HARI',  '2 Hari',  '2 Hari 1 Malam',  2400000, 'Kunjungi kawah gunung berapi aktif yang legendaris dengan pemandangan alam yang spektakuler.',                                      '/images/destinasi/tangkuban_perahu.jpeg',  'aktif', 9),
(10, 'Dieng Yogya',          'PAKET 3 HARI',  '3 Hari',  '3 Hari 2 Malam',  4500000, 'Jelajahi keajaiban Dieng Plateau dan budaya Yogyakarta dalam satu perjalanan.',                                                     '/images/destinasi/dieng-yogya.jpeg',       'aktif', 10),
(11, 'Yogyakarta',           'PAKET 3 HARI',  '3 Hari',  '3 Hari 2 Malam',  6500000, 'Borobudur, Prambanan, Malioboro, dan wisata budaya Yogyakarta dengan penginapan hotel bintang 3.',                                  '/images/destinasi/yogyakarta.jpeg',        'aktif', 11),
(12, 'Jawa Tengah',          'PAKET 4 HARI',  '4 Hari',  '4 Hari',          8000000, 'Perjalanan lintas Jawa Tengah mengunjungi candi-candi megah dan budaya lokal.',                                                     '/images/destinasi/jawatengah.jpeg',        'aktif', 12),
(13, 'Bromo Batu Malang',    'PAKET 4 HARI',  '4 Hari',  '4 Hari',          6800000, 'Saksikan sunrise Gunung Bromo dan nikmati wisata Batu Malang yang sejuk.',                                                          '/images/destinasi/bromo-batu_malang.jpeg', 'aktif', 13),
(14, 'Batu Malang',          'PAKET 4 HARI',  '4 Hari',  '4 Hari',          6500000, 'Nikmati udara sejuk dan wisata alam di kota wisata Batu Malang.',                                                                   '/images/destinasi/batu_malang.jpeg',       'aktif', 14),
(15, 'Bali',                 'PAKET 5 HARI',  '5 Hari',  '5 Hari 4 Malam',  7500000, 'Nikmati keindahan pantai, pura, dan budaya Bali dengan akomodasi hotel terbaik.',                                                   '/images/destinasi/bali.jpeg',              'aktif', 15),
(16, 'Bali Lombok',          'PAKET 10 HARI', '10 Hari', '10 Hari 9 Malam', 5500000, 'Jelajahi keindahan Bali dan Lombok dalam satu paket perjalanan yang tak terlupakan.',                                               '/images/destinasi/bali-lombok.jpeg',       'aktif', 16)
ON DUPLICATE KEY UPDATE id = id;

-- ============================================================
-- SEED: price_list (daftar harga lengkap)
-- ============================================================
INSERT INTO price_list (id, nama_destinasi, durasi, harga_hiace, harga_elf, harga_medium, harga_big) VALUES
(1,  'TRANSFER IN/OUT (One Way)',                                              '4 Jam',   1250000,  1350000,  1750000,  2250000),
(2,  'DK HALF DAY',                                                            '8 Jam',   1400000,  1400000,  1900000,  2500000),
(3,  'DK FULL DAY',                                                            '12 Jam',  1500000,  1500000,  2000000,  2750000),
(4,  'JAKARTA, DEPOK, BEKASI, BSD',                                            '12 Jam',  1500000,  1500000,  2000000,  2750000),
(5,  'SENTUL, BOGOR KOTA, TAMBUN, CIKARANG',                                   '12 Jam',  1650000,  1650000,  2500000,  3250000),
(6,  'CIAWI, MEGAMENDUNG, TAMAN SAFARI, KARAWANG',                             '15 Jam',  1750000,  1750000,  2750000,  3750000),
(7,  'CIBODAS, CIMACAN, CIPANAS',                                              '15 Jam',  1900000,  1900000,  3000000,  4250000),
(8,  'SUKABUMI KOTA',                                                          '15 Jam',  1900000,  1900000,  3000000,  4250000),
(9,  'BANTEN',                                                                 '18 Jam',  2000000,  2000000,  3500000,  4500000),
(10, 'PURWAKARTA',                                                             '18 Jam',  2000000,  2000000,  3500000,  4500000),
(11, 'ANYER, SERANG, CARITA',                                                  '18 Jam',  2000000,  2000000,  3500000,  4500000),
(12, 'BANDUNG KOTA, LEMBANG, CIMAHI',                                          '18 Jam',  2250000,  2250000,  3700000,  4750000),
(13, 'CIWIDEY, PENGALENGAN, SUMEDANG',                                         '18 Jam',  2400000,  2400000,  4000000,  5250000),
(14, 'GARUT, TASIKMALAYA',                                                     '18 Jam',  2500000,  2500000,  4500000,  5750000),
(15, 'INDRAMAYU, CIREBON, BREBES, KUNINGAN',                                   '18 Jam',  2500000,  2500000,  4500000,  5750000),
(16, 'CIAWI, MEGAMENDUNG, CISARUA, TAMAN SAFARI, KARAWANG',                    '2 Hari',  3250000,  3250000,  5050000,  6750000),
(17, 'CIBODAS, CIMACAN, CIPANAS, CILOTO, SUKABUMI KOTA',                       '2 Hari',  3500000,  3500000,  5500000,  7750000),
(18, 'PURWAKARTA (2 Hari)',                                                    '2 Hari',  3500000,  3500000,  5500000,  7750000),
(19, 'ANYER, BANTEN, PANDEGLANG, SERANG, CARITA, SUBANG, CIANJUR',             '2 Hari',  3750000,  3750000,  6250000,  8250000),
(20, 'BANDUNG, LEMBANG, CIMAHI, TANGKUBAN PRAHU, CIATER',                      '2 Hari',  4000000,  4000000,  6750000,  8750000),
(21, 'GARUT, TASIK, KUNINGAN, CIREBON, CIAMIS, SAWARNA, CILETUH',             '2 Hari',  4500000,  4500000,  7750000,  10250000),
(22, 'LAMPUNG (2 Hari)',                                                       '2 Hari',  6000000,  6000000,  9000000,  12500000),
(23, 'GUCI, TEGAL, BREBES, PEKALONGAN, CILACAP, PANGANDARAN, DIENG, WONOSOBO (2H)', '2 Hari', 6000000, 6000000, 9000000, 12500000),
(24, 'LAMPUNG (3 Hari)',                                                       '3 Hari',  8250000,  8250000,  12000000, 17000000),
(25, 'GUCI, TEGAL, BREBES, PEKALONGAN, CILACAP, PANGANDARAN, DIENG, WONOSOBO (3H)', '3 Hari', 6750000, 6750000, 10000000, 14250000),
(26, 'YOGYAKARTA, SEMARANG, DEMAK (3 Hari)',                                   '3 Hari',  7500000,  7500000,  11250000, 15650000),
(27, 'YOGYAKARTA, SEMARANG, DEMAK (4 Hari)',                                   '4 Hari',  9000000,  9000000,  14000000, 19000000),
(28, 'SURABAYA, MALANG, BROMO (4 Hari)',                                       '4 Hari',  10000000, 10000000, 15000000, 20500000),
(29, 'PALEMBANG',                                                              '4 Hari',  11000000, 11000000, 16000000, 22500000),
(30, 'SURABAYA, MALANG, BROMO (5 Hari)',                                       '5 Hari',  11250000, 11250000, 17500000, 23750000),
(31, 'BENGKULU, JAMBI',                                                        '5 Hari',  13750000, 13750000, 20000000, 28250000),
(32, 'BALI, LOMBOK (7 Hari)',                                                  '7 Hari',  15250000, 15250000, 24500000, 33500000),
(33, 'PEKANBARU, RIAU, PADANG',                                                '8 Hari',  22000000, 22000000, 32000000, 45000000),
(34, 'BALI, LOMBOK (10 Hari)',                                                 '10 Hari', 22500000, 22500000, 35000000, 47000000),
(35, 'MEDAN',                                                                  '10 Hari', 0,        0,        0,        0)
ON DUPLICATE KEY UPDATE id = id;

-- ============================================================
-- TABLE: settings
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  setting_key   VARCHAR(50)  NOT NULL PRIMARY KEY,
  setting_value TEXT         NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
('maintenance_mode', '0'),
('maintenance_message', 'Website sedang dalam pemeliharaan berkala untuk meningkatkan layanan kami. Silakan hubungi kami via WhatsApp untuk info pemesanan.');

-- ============================================================
-- Verifikasi akhir
-- ============================================================
SELECT 'Setup selesai!' AS status;
SELECT TABLE_NAME, TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('bus','bus_images','price_list','paket_wisata','admin_users','news','pesan_masuk','booking','settings')
ORDER BY TABLE_NAME;

-- ============================================================
-- PERBAIKAN PASSWORD ADMIN
-- Jika user admin sudah ada tapi login gagal, jalankan:
--
-- UPDATE admin_users
-- SET password = '$2y$10$/B2.1xWl5qFkwKb6Sf4mPe/J.17colIRufCC3PngjOGkTlmCWLhiS'
-- WHERE username = 'admin';
--
-- (hash di atas terverifikasi untuk password 'admin123')
-- ============================================================


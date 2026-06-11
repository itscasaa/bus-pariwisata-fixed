-- ============================================================
-- Surya Tour Trans - Setup Tabel paket_wisata
-- Jalankan di phpMyAdmin > bus_pariwisata > tab SQL
-- ============================================================

USE bus_pariwisata;

-- ------------------------------------------------------------
-- 1. Buat tabel paket_wisata
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paket_wisata (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  judul       VARCHAR(200)  NOT NULL,
  badge       VARCHAR(100)  NOT NULL COMMENT 'contoh: PAKET 1 HARI',
  kategori    VARCHAR(50)   NOT NULL COMMENT 'contoh: 1 Hari, 2 Hari, 3 Hari',
  durasi      VARCHAR(100)  NOT NULL COMMENT 'contoh: 1 Hari, 2 Hari 1 Malam',
  harga       BIGINT        NOT NULL DEFAULT 0,
  deskripsi   TEXT          NULL,
  gambar      VARCHAR(255)  NULL     COMMENT 'URL gambar atau path relatif',
  status      ENUM('aktif','nonaktif') DEFAULT 'aktif',
  urutan      INT           DEFAULT 0 COMMENT 'urutan tampil di halaman',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2. Insert data dari siteData.js (16 paket)
-- ------------------------------------------------------------
INSERT INTO paket_wisata (judul, badge, kategori, durasi, harga, deskripsi, gambar, urutan) VALUES
-- 1 Hari
('Bandung',              'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2200000, 'Jelajahi keindahan Bandung, mulai dari belanja di factory outlet hingga menikmati udara sejuk pegunungan.',                                                    '/images/destinasi/bandung.jpeg',          1),
('Taman Bunga Nusantara','PAKET 1 HARI',  '1 Hari',  '1 Hari',          2500000, 'Nikmati keindahan taman bunga terbesar di Indonesia dengan koleksi bunga dari seluruh dunia.',                                                                  '/images/destinasi/bunga_nusantara.jpeg',  2),
('Kebun Raya Bogor',     'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2300000, 'Wisata alam yang menyegarkan di kebun raya dengan koleksi tumbuhan langka dan udara pegunungan yang sejuk.',                                                    '/images/destinasi/kebun_cibodas.jpeg',    3),
('Anyer',                'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2600000, 'Nikmati keindahan pantai Anyer dengan pasir putih dan sunset yang memukau.',                                                                                    '/images/destinasi/anyer.jpeg',            4),
('Taman Safari',         'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2700000, 'Petualangan seru bersama satwa liar di Taman Safari dengan berbagai atraksi menarik.',                                                                          '/images/destinasi/taman_safari.jpeg',     5),
('Maribaya Bandung',     'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2200000, 'Wisata alam dengan pemandian air hangat, curug, dan hutan pinus yang asri.',                                                                                    '/images/destinasi/maribaya_bandung.jpeg', 6),
('Taman Mini',           'PAKET 1 HARI',  '1 Hari',  '1 Hari',          2500000, 'Jelajahi kebudayaan Indonesia dalam satu tempat di Taman Mini Indonesia Indah.',                                                                                '/images/destinasi/taman_mini.jpeg',       7),
('Cimory Dierland Bogor','PAKET 1 HARI',  '1 Hari',  '1 Hari',          2300000, 'Wisata kuliner dan dairy farm di Cimory dengan pemandangan pegunungan yang indah.',                                                                             '/images/destinasi/bogor-cimory.jpeg',     8),
-- 2 Hari
('Tangkuban Perahu',     'PAKET 2 HARI',  '2 Hari',  '2 Hari 1 Malam',  2400000, 'Kunjungi kawah gunung berapi aktif yang legendaris dengan pemandangan alam yang spektakuler.',                                                                  '/images/destinasi/tangkuban_perahu.jpeg', 9),
-- 3 Hari
('Dieng Yogya',          'PAKET 3 HARI',  '3 Hari',  '3 Hari 2 Malam',  4500000, 'Jelajahi keajaiban Dieng Plateau dan budaya Yogyakarta dalam satu perjalanan.',                                                                                 '/images/destinasi/dieng-yogya.jpeg',      10),
('Yogyakarta',           'PAKET 3 HARI',  '3 Hari',  '3 Hari 2 Malam',  6500000, 'Borobudur, Prambanan, Malioboro, dan wisata budaya Yogyakarta dengan penginapan hotel bintang 3.',                                                              '/images/destinasi/yogyakarta.jpeg',       11),
-- 4 Hari
('Jawa Tengah',          'PAKET 4 HARI',  '4 Hari',  '4 Hari',          8000000, 'Perjalanan lintas Jawa Tengah mengunjungi candi-candi megah dan budaya lokal.',                                                                                 '/images/destinasi/jawatengah.jpeg',       12),
('Bromo Batu Malang',    'PAKET 4 HARI',  '4 Hari',  '4 Hari',          6800000, 'Saksikan sunrise Gunung Bromo dan nikmati wisata Batu Malang yang sejuk.',                                                                                      '/images/destinasi/bromo-batu_malang.jpeg',13),
('Batu Malang',          'PAKET 4 HARI',  '4 Hari',  '4 Hari',          6500000, 'Nikmati udara sejuk dan wisata alam di kota wisata Batu Malang.',                                                                                               '/images/destinasi/batu_malang.jpeg',      14),
-- 5 Hari
('Bali',                 'PAKET 5 HARI',  '5 Hari',  '5 Hari 4 Malam',  7500000, 'Nikmati keindahan pantai, pura, dan budaya Bali dengan akomodasi hotel terbaik.',                                                                               '/images/destinasi/bali.jpeg',             15),
-- 10 Hari
('Bali Lombok',          'PAKET 10 HARI', '10 Hari', '10 Hari 9 Malam', 5500000, 'Jelajahi keindahan Bali dan Lombok dalam satu paket perjalanan yang tak terlupakan.',                                                                           '/images/destinasi/bali-lombok.jpeg',      16);

-- ------------------------------------------------------------
-- Verifikasi
-- ------------------------------------------------------------
SELECT id, judul, kategori, durasi, harga, status FROM paket_wisata ORDER BY urutan;
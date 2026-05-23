-- ============================================================
-- bus_fix.sql — Setup lengkap tabel bus & bus_images
-- Disesuaikan dengan file gambar yang ada di project
-- Jalankan di phpMyAdmin > database bus_pariwisata > tab SQL
-- ============================================================

USE bus_pariwisata;

-- ------------------------------------------------------------
-- 1. Bersihkan data lama (urutan penting: images dulu, baru bus)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS bus_images;
DROP TABLE IF EXISTS bus;

-- ------------------------------------------------------------
-- 2. Buat tabel bus
-- ------------------------------------------------------------
CREATE TABLE bus (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  nama_bus       VARCHAR(100)  NOT NULL,
  tipe           VARCHAR(50)   NOT NULL DEFAULT 'big_bus',
  kapasitas      INT           NOT NULL,
  harga_sewa     BIGINT        NOT NULL DEFAULT 0,
  gambar_utama   VARCHAR(255)  NOT NULL DEFAULT '',
  deskripsi      TEXT          NULL,
  fasilitas_json TEXT          NULL,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3. Buat tabel bus_images
-- ------------------------------------------------------------
CREATE TABLE bus_images (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  bus_id   INT          NOT NULL,
  path     VARCHAR(255) NOT NULL,
  label    VARCHAR(100) NULL,
  urutan   INT          DEFAULT 0,
  FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4. INSERT 6 data bus
-- Fasilitas lengkap sesuai spesifikasi armada
-- ------------------------------------------------------------
SET @fasilitas = '["Seat 3-2","2 Unit LCD TV","Dispenser","AC","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]';

INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(1, 'Pratama Trans', 'big_bus',    45, 4500000,
 'bus1/bu1.jpeg',
 'Bus besar Pratama Trans kapasitas 45 kursi, dilengkapi smoking area, toilet, AC, dan fasilitas hiburan lengkap. Cocok untuk rombongan besar.',
 @fasilitas),

(2, 'Pratama Trans', 'medium_bus', 33, 3000000,
 'bus2/mini_bus2.jpeg',
 'Bus medium Pratama Trans kapasitas 33 kursi, nyaman untuk perjalanan grup sedang dengan fasilitas entertainment modern.',
 @fasilitas),

(3, 'Pratama Trans', 'big_bus',    59, 4500000,
 'bus3/bus3.jpeg',
 'Bus besar Pratama Trans kapasitas 59 kursi, interior modern dengan bangku premium dan sistem hiburan lengkap.',
 @fasilitas),

(4, 'Pratama Trans', 'big_bus',    59, 5000000,
 'bus4/bus4.jpeg',
 'Bus besar Pratama Trans kapasitas 59 kursi, dilengkapi dispenser air minum, AC, dan kompartemen bagasi luas untuk perjalanan jauh.',
 @fasilitas),

(5, 'Malika Wisata', 'big_bus',    59, 3500000,
 'bus5/bus5.jpeg',
 'Bus besar Malika Wisata kapasitas 59 kursi, desain elegan dengan bangku yang luas dan fasilitas hiburan modern.',
 @fasilitas),

(6, 'Malika Wisata', 'big_bus',    59, 3500000,
 'bus6/bus6.jpeg',
 'Bus besar Malika Wisata kapasitas 59 kursi, armada terbaru dengan fasilitas lengkap untuk kenyamanan perjalanan wisata.',
 @fasilitas);

-- ------------------------------------------------------------
-- 5. INSERT gambar fasilitas (disesuaikan file yang benar-benar ada)
-- ------------------------------------------------------------

-- Bus 1 - Pratama Trans (bus1/)
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(1, 'bus1/bu1.jpeg',             'Eksterior Bus',   0),
(1, 'bus1/bangku_depan.jpeg',    'Bangku Depan',    1),
(1, 'bus1/bangku_belakang.jpeg', 'Bangku Belakang', 2);

-- Bus 2 - Pratama Trans (bus2/) — medium bus
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(2, 'bus2/mini_bus2.jpeg',       'Eksterior Bus',   0),
(2, 'bus2/supir.jpeg',           'Area Supir',      1),
(2, 'bus2/bangku_depan.jpeg',    'Bangku Depan',    2),
(2, 'bus2/bangku_depan2.jpeg',   'Bangku Depan 2',  3),
(2, 'bus2/bangku_belakang.jpeg', 'Bangku Belakang', 4);

-- Bus 3 - Pratama Trans (bus3/) — big bus 59 kursi
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(3, 'bus3/bus3.jpeg',             'Eksterior Bus',   0),
(3, 'bus3/bangku_depan.jpeg',     'Bangku Depan',    1),
(3, 'bus3/bangku_depan1.jpeg',    'Bangku Depan 1',  2),
(3, 'bus3/bangku_depan2.jpeg',    'Bangku Depan 2',  3),
(3, 'bus3/bangku_belakang.jpeg',  'Bangku Belakang', 4);

-- Bus 4 - Pratama Trans (bus4/) — big bus dengan dispenser
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(4, 'bus4/bus4.jpeg',             'Eksterior Bus',     0),
(4, 'bus4/bangku_depan.jpeg',     'Bangku Depan',      1),
(4, 'bus4/bangku_belakang.jpeg',  'Bangku Belakang',   2),
(4, 'bus4/bangku_belakang2.jpeg', 'Bangku Belakang 2', 3),
(4, 'bus4/dispenser.jpeg',        'Dispenser Air',     4);

-- Bus 5 - Malika Wisata (bus5/)
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(5, 'bus5/bus5.jpeg',            'Eksterior Bus',   0),
(5, 'bus5/bangku_depan.jpeg',    'Bangku Depan',    1),
(5, 'bus5/bangku_depan2.jpeg',   'Bangku Depan 2',  2);

-- Bus 6 - Malika Wisata (bus6/)
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(6, 'bus6/bus6.jpeg',            'Eksterior Bus',   0);

-- ------------------------------------------------------------
-- Verifikasi hasil
-- ------------------------------------------------------------
SELECT id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama FROM bus ORDER BY id;

SELECT bi.bus_id, b.nama_bus, bi.label, bi.path, bi.urutan
FROM bus_images bi
JOIN bus b ON bi.bus_id = b.id
ORDER BY bi.bus_id, bi.urutan;

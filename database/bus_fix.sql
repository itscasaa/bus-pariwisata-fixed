USE bus_pariwisata;

-- Fix rename kolom (MariaDB compatible)
ALTER TABLE bus CHANGE gambar gambar_utama VARCHAR(255) NOT NULL DEFAULT '';

-- Tambah kolom yang kurang
ALTER TABLE bus
  ADD COLUMN IF NOT EXISTS tipe         VARCHAR(50) NOT NULL DEFAULT 'big_bus' AFTER nama_bus,
  ADD COLUMN IF NOT EXISTS deskripsi    TEXT NULL AFTER gambar_utama,
  ADD COLUMN IF NOT EXISTS fasilitas_json TEXT NULL AFTER deskripsi,
  ADD COLUMN IF NOT EXISTS created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER fasilitas_json;

-- Buat tabel bus_images
CREATE TABLE IF NOT EXISTS bus_images (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  bus_id   INT NOT NULL,
  path     VARCHAR(255) NOT NULL,
  label    VARCHAR(100) NULL,
  urutan   INT DEFAULT 0,
  FOREIGN KEY (bus_id) REFERENCES bus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert 5 data bus
INSERT INTO bus (id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json) VALUES
(1, 'Zahra Ayu',   'big_bus',    45, 4500000, 'bus1/bu1.webp',        'Bus besar Zahra Ayu dengan kapasitas 45 kursi, cocok untuk rombongan besar.', '["AC","Reclining Seat","Audio System","Bagasi Luas"]'),
(2, 'Wong Kudus',  'medium_bus', 30, 3000000, 'bus2/mini_bus2.webp',  'Bus medium Wong Kudus nyaman untuk perjalanan grup sedang.',                  '["AC","Reclining Seat","Audio System","Bantal & Selimut"]'),
(3, 'William',     'big_bus',    45, 4500000, 'bus3/bus3.webp',       'Bus besar William dengan interior modern dan bangku premium.',                 '["AC","Reclining Seat","TV/Monitor","Audio System","Bagasi Luas"]'),
(4, 'White Horse', 'big_bus',    45, 5000000, 'bus4/bus4.webp',       'Bus besar White Horse dilengkapi dispenser air minum untuk perjalanan jauh.', '["AC","Reclining Seat","TV/Monitor","Dispenser Air","Audio System","Bagasi Luas"]'),
(5, 'Starbus',     'medium_bus', 30, 3500000, 'bus5/bus5.webp',       'Bus medium Starbus dengan desain elegan dan bangku yang luas.',               '["AC","Reclining Seat","Audio System","Bantal & Selimut","Bagasi Luas"]');

-- Insert gambar fasilitas
INSERT INTO bus_images (bus_id, path, label, urutan) VALUES
(1, 'bus1/bu1.webp',             'Eksterior Bus',     0),
(1, 'bus1/bangku_depan.webp',    'Bangku Depan',      1),
(1, 'bus1/bangku_belakang.webp', 'Bangku Belakang',   2),
(2, 'bus2/mini_bus2.webp',       'Eksterior Bus',     0),
(2, 'bus2/bangku_depan.webp',    'Bangku Depan',      1),
(2, 'bus2/bangku_depan2.webp',   'Bangku Depan 2',    2),
(2, 'bus2/bangku_belakang.webp', 'Bangku Belakang',   3),
(2, 'bus2/supir.webp',           'Area Supir',        4),
(3, 'bus3/bus3.webp',            'Eksterior Bus',     0),
(3, 'bus3/bangku_depan.webp',    'Bangku Depan',      1),
(3, 'bus3/bangku_depan1.webp',   'Bangku Depan 1',    2),
(3, 'bus3/bangku_depan2.webp',   'Bangku Depan 2',    3),
(3, 'bus3/bangku_belakang.webp', 'Bangku Belakang',   4),
(4, 'bus4/bus4.webp',            'Eksterior Bus',     0),
(4, 'bus4/bangku_depan.webp',    'Bangku Depan',      1),
(4, 'bus4/bangku_belakang.webp', 'Bangku Belakang',   2),
(4, 'bus4/bangku_belakang2.webp','Bangku Belakang 2', 3),
(4, 'bus4/dispenser.webp',       'Dispenser Air',     4),
(5, 'bus5/bus5.webp',            'Eksterior Bus',     0),
(5, 'bus5/depan_bus5.webp',      'Depan Bus',         1),
(5, 'bus5/bangku_depan.webp',    'Bangku Depan',      2),
(5, 'bus5/bangku_depan2.webp',   'Bangku Depan 2',    3),
(5, 'bus5/bangku_belakang.webp', 'Bangku Belakang',   4),
(5, 'bus5/bangku_belakang2.webp','Bangku Belakang 2', 5);
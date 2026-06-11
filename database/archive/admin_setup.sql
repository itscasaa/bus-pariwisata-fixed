-- ============================================================
-- Admin Panel - Setup Tabel admin_users + news
-- Jalankan di phpMyAdmin > bus_pariwisata > tab SQL
-- ============================================================

USE bus_pariwisata;

-- ------------------------------------------------------------
-- 1. Tabel admin_users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  nama       VARCHAR(100) NOT NULL,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default login: username=admin | password=admin123
INSERT INTO admin_users (nama, username, password) VALUES
('Administrator', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE id=id;

-- ------------------------------------------------------------
-- 2. Tabel news
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS news (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  judul      VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  konten     TEXT         NOT NULL,
  gambar     VARCHAR(255) NULL,
  status     ENUM('publish','draft') DEFAULT 'publish',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Verifikasi
-- ------------------------------------------------------------
SELECT 'Tabel admin_users:' AS info;
SELECT id, nama, username FROM admin_users;

SELECT 'Tabel news:' AS info;
SHOW COLUMNS FROM news;

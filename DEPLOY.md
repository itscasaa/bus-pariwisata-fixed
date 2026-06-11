# DEPLOY.md — Surya Tour Trans
## Panduan Deploy ke InfinityFree / Shared Hosting & VPS

---

## Struktur htdocs Final

```
htdocs/
├── index.html           ← hasil build React
├── bundle.js            ← hasil build React
├── .htaccess
├── images/
│   ├── bus1/
│   │   ├── bu1.jpeg
│   │   └── ...
│   ├── bus2/ ... bus11/
│   └── destinasi/
│       ├── bandung.jpeg
│       ├── bali.jpeg
│       ├── bromo-batu_malang.jpeg
│       └── ... (16 gambar destinasi)
├── api/
│   ├── buses.php
│   ├── paket_wisata.php
│   ├── price_list.php
│   ├── news.php
│   ├── contact.php
│   ├── booking.php
│   └── health.php
├── admin/
│   ├── index.php
│   ├── dashboard.php
│   ├── armada.php
│   ├── paket_wisata.php
│   ├── price_list.php
│   ├── news.php
│   ├── pesan.php
│   ├── logout.php
│   └── api/
│       └── paket_wisata.php
├── config/
│   └── koneksi.php
└── database/
    └── setup.sql
```

---

## A. Deploy ke InfinityFree / Shared Hosting

### 1. Build Frontend React

```bash
cd frontend
npm install
npm run build
```

Output ada di `frontend/dist/`.

### 2. Upload File

Gunakan FileZilla / cPanel File Manager:

| Sumber lokal           | Upload ke htdocs       |
|------------------------|------------------------|
| `frontend/dist/`       | `htdocs/` (isi saja)   |
| `api/`                 | `htdocs/api/`          |
| `admin/`               | `htdocs/admin/`        |
| `config/`              | `htdocs/config/`       |
| `images/`              | `htdocs/images/`       |
| `database/`            | `htdocs/database/`     |
| `.htaccess`            | `htdocs/.htaccess`     |
| `database/setup.sql`   | (untuk phpMyAdmin)     |

> ⚠️ **PENTING — Lokasi gambar:** Gambar **wajib** diupload ke `htdocs/images/`
> (mis. `htdocs/images/bus1/bu1.jpeg`, `htdocs/images/destinasi/bandung.jpeg`).
> API mengembalikan path `/images/...`, jadi jika gambar hanya ada di
> `htdocs/frontend/assets/images/` maka URL gambar akan **404**.
> Mengupload ke `htdocs/frontend/assets/images/` saja **TIDAK cukup**.

### 3. Buat Database

Di cPanel InfinityFree → MySQL Databases:
1. Buat database baru, contoh: `if0_xxxxx_busdb`
2. Buat user database
3. Attach user ke database (All Privileges)

### 4. Import SQL

Di phpMyAdmin:
1. Pilih database yang baru dibuat
2. Tab **SQL** → paste isi `database/setup.sql` → Execute
   
   atau Tab **Import** → pilih file `setup.sql`

### 5. Edit config/koneksi.php

Edit file `htdocs/config/koneksi.php`:

```php
$host = 'sqlXXX.infinityfree.com';  // cek di cPanel
$user = 'if0_xxxxx';
$pass = 'password_db_kamu';
$db   = 'if0_xxxxx_busdb';
```

### 6. Test

Buka di browser:

- `https://domain-kamu.com/api/health.php` → harus `"database":"connected"`
- `https://domain-kamu.com/api/paket_wisata.php` → harus ada `judul`
- `https://domain-kamu.com/admin/` → login dengan admin / admin123

---

## B. Deploy ke VPS (Ubuntu + Apache)

### 1. Instalasi Server

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install apache2 php php-mysqli mysql-server unzip -y
sudo systemctl enable apache2 mysql
```

### 2. Buat Database

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE surya_tour_trans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'surya_user'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD_KUAT';
GRANT ALL PRIVILEGES ON surya_tour_trans.* TO 'surya_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Import SQL

```bash
mysql -u surya_user -p surya_tour_trans < /path/to/database/setup.sql
```

### 4. Upload Proyek

```bash
sudo mkdir -p /var/www/surya-tour-trans
sudo chown -R $USER:$USER /var/www/surya-tour-trans
```

Upload file (rsync / scp / git):

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ user@IP_SERVER:/var/www/surya-tour-trans/
```

### 5. Build & Deploy Frontend

```bash
cd /var/www/surya-tour-trans/frontend
npm install
npm run build
cp -r dist/* /var/www/surya-tour-trans/
```

### 6. Edit config/koneksi.php

```php
$host = 'localhost';
$user = 'surya_user';
$pass = 'GANTI_PASSWORD_KUAT';
$db   = 'surya_tour_trans';
```

### 7. Konfigurasi Virtual Host Apache

```bash
sudo nano /etc/apache2/sites-available/surya-tour.conf
```

```apache
<VirtualHost *:80>
    ServerName domain-kamu.com
    ServerAlias www.domain-kamu.com
    DocumentRoot /var/www/surya-tour-trans

    <Directory /var/www/surya-tour-trans>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/surya-error.log
    CustomLog ${APACHE_LOG_DIR}/surya-access.log combined
</VirtualHost>
```

```bash
sudo a2ensite surya-tour.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 8. Permission Upload Images

```bash
sudo chown -R www-data:www-data /var/www/surya-tour-trans/images
sudo chmod -R 755 /var/www/surya-tour-trans/images
```

### 9. SSL (Opsional tapi Dianjurkan)

```bash
sudo apt install certbot python3-certbot-apache -y
sudo certbot --apache -d domain-kamu.com
```

---

## C. Development Lokal (XAMPP)

1. Taruh proyek di: `C:/xampp/htdocs/bus_pariwisata/`
2. Buka phpMyAdmin → buat database `bus_pariwisata`
3. Import `database/setup.sql`
4. `config/koneksi.php` sudah dikonfigurasi default untuk XAMPP
5. Buka: `http://localhost/bus_pariwisata/api/health.php`
6. Frontend: `cd frontend && npm install && npm start`

---

## D. Testing Checklist

| Endpoint / Halaman | Yang Harus Muncul |
|----|-----|
| `/api/health.php` | `"database":"connected"`, semua tabel `true` |
| `/api/buses.php` | JSON array bus dengan field `nama_bus` |
| `/api/paket_wisata.php` | JSON array dengan field `judul` (BUKAN `nama_bus`) |
| `/api/price_list.php` | JSON array harga destinasi |
| `/api/news.php` | JSON array berita |
| `/admin/` | Halaman login admin |
| Login admin | username: `admin`, password: `admin123` |
| `/paket-wisata` (frontend) | Kartu destinasi wisata tampil |

---

## E. Setelah Deploy — Langkah Manual Wajib

1. **Update password admin (WAJIB jika login gagal).**
   Default login adalah `admin` / `admin123`. Jika baris admin sudah ada di DB,
   import ulang `setup.sql` tidak akan menimpa passwordnya (`ON DUPLICATE KEY`).
   Jalankan SQL ini di phpMyAdmin untuk memaksa password yang benar:
   ```sql
   UPDATE admin_users
   SET password = '$2y$10$/B2.1xWl5qFkwKb6Sf4mPe/J.17colIRufCC3PngjOGkTlmCWLhiS'
   WHERE username = 'admin';
   ```
   Hash di atas terverifikasi terhadap `admin123`.

2. **Ganti password admin** ke yang lebih kuat setelah berhasil login:
   - Generate hash baru di PHP: `echo password_hash('password_baru', PASSWORD_DEFAULT);`
   - Lalu:
     ```sql
     UPDATE admin_users SET password = '$2y$10$HASH_BARU' WHERE username = 'admin';
     ```

3. **Ganti kredensial DB** di `config/koneksi.php` sesuai hosting/VPS.

4. **Pastikan gambar bus & destinasi** sudah ada di folder `/images/`:
   - Bus: `/images/bus1/bu1.jpeg`, `/images/bus2/mini_bus2.jpeg`, dll.
   - Destinasi: `/images/destinasi/bandung.jpeg`, dll.

5. **Rebuild frontend** jika ada perubahan kode React:
   ```bash
   cd frontend && npm run build
   # Salin dist/* ke htdocs/
   ```

---

## G. Test URL Produksi (InfinityFree)

Setelah upload, buka URL berikut untuk memverifikasi:

- https://testingbuspariwisata.infinityfreeapp.com/images/bus1/bu1.jpeg → gambar tampil (bukan 404)
- https://testingbuspariwisata.infinityfreeapp.com/api/buses.php → JSON bus, path gambar `/images/...`
- https://testingbuspariwisata.infinityfreeapp.com/api/paket_wisata.php → JSON dengan field `judul` (bukan `nama_bus`)
- https://testingbuspariwisata.infinityfreeapp.com/api/news.php → JSON (bukan 404/HTML)
- https://testingbuspariwisata.infinityfreeapp.com/api/health.php → `"database":"connected"`
- https://testingbuspariwisata.infinityfreeapp.com/admin/ → halaman login admin (admin / admin123)

---

## F. Troubleshooting

| Problem | Solusi |
|---|---|
| `health.php` → database disconnected | Cek `config/koneksi.php`, pastikan kredensial benar |
| `paket_wisata.php` kosong | Pastikan tabel `paket_wisata` ada dan terisi — jalankan ulang `setup.sql` |
| Admin login gagal | Cek tabel `admin_users`, pastikan hash bcrypt benar |
| Gambar bus tidak muncul | Pastikan folder `/images/bus1/` dst sudah diupload |
| React 404 di refresh | Pastikan `.htaccess` sudah ada dan mod_rewrite aktif |
| InfinityFree: API gagal | Pastikan PHP version ≥ 7.4 di cPanel |

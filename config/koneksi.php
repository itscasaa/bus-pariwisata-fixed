<?php
// ============================================================
// config/koneksi.php
// Konfigurasi database terpusat
// Kompatibel: XAMPP (local) | InfinityFree | VPS
// ============================================================

require_once __DIR__ . '/cors.php';

// Suppress display errors — errors logged saja, tidak tampil ke browser
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// ── Baca env variable jika tersedia, fallback ke manual config ──
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'bus_web_user';
$pass = getenv('DB_PASS') ?: 'ddd07e8b630057ae737e35031f631a8f';
$db   = getenv('DB_NAME') ?: 'bus_pariwisata';

// ── Untuk InfinityFree / shared hosting, ubah nilai di bawah ini ──
// $host = 'sqlXXX.infinityfree.com';
// $user = 'if0_xxxxxxxx';
// $pass = 'your_password';
// $db   = 'if0_xxxxxxxx_busdb';

// ── Untuk VPS, ubah nilai di bawah ini ──
// $host = 'localhost';
// $user = 'surya_user';
// $pass = 'your_strong_password';
// $db   = 'surya_tour_trans';

$conn = @mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    // Jangan tampilkan detail error ke browser di production
    if (defined('ADMIN_DEBUG') && ADMIN_DEBUG === true) {
        die(json_encode(['error' => 'Koneksi DB gagal: ' . mysqli_connect_error()]));
    }
    // Di luar admin debug mode, return false saja — API handler yang tangani
    $conn = false;
}

if ($conn) {
    mysqli_set_charset($conn, 'utf8mb4');
}
?>

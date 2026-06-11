<?php
// ============================================================
// admin/config.php
// Konfigurasi Admin Panel — gunakan config/koneksi.php terpusat
// ============================================================
session_start();

define('SITE_NAME', 'Mafina Trans');

// ── Deteksi base URL secara otomatis ──────────────────────────
$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host_name = $_SERVER['HTTP_HOST'] ?? 'localhost';
$script_dir = str_replace('/admin', '', dirname($_SERVER['SCRIPT_NAME']));
$base_url   = $protocol . '://' . $host_name . rtrim($script_dir, '/');

define('BASE_URL',    $base_url);
define('ADMIN_PATH',  $base_url . '/admin');

// IMAGE_BASE: semua gambar bus disajikan dari /images/ (bukan frontend/assets)
define('IMAGE_BASE',  $base_url . '/images/');

// ── Koneksi DB via config terpusat ────────────────────────────
define('ADMIN_DEBUG', false); // set true hanya untuk debugging
require_once __DIR__ . '/../config/koneksi.php';

if (!$conn) {
    die('<div style="font-family:sans-serif;padding:2rem;color:red;">
        <h2>Database Error</h2>
        <p>Tidak dapat terhubung ke database. Periksa konfigurasi di <code>config/koneksi.php</code>.</p>
    </div>');
}

// ── Fungsi cek login ──────────────────────────────────────────
function cekLogin() {
    if (!isset($_SESSION['admin_id'])) {
        header('Location: ' . ADMIN_PATH . '/index.php');
        exit;
    }
}

// ── Flash message ─────────────────────────────────────────────
function setFlash($type, $msg) {
    $_SESSION['flash'] = ['type' => $type, 'msg' => $msg];
}
function getFlash() {
    if (isset($_SESSION['flash'])) {
        $f = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $f;
    }
    return null;
}

// ── Format rupiah ─────────────────────────────────────────────
function rupiah($angka) {
    return 'Rp ' . number_format((int)$angka, 0, ',', '.');
}

// ── Slug generator ────────────────────────────────────────────
function makeSlug($str) {
    $str = strtolower(trim($str));
    $str = preg_replace('/[^a-z0-9\s-]/', '', $str);
    $str = preg_replace('/[\s-]+/', '-', $str);
    return $str . '-' . time();
}
?>

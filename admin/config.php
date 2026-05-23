<?php
// ============================================================
// Admin Config - Koneksi DB + Konstanta
// ============================================================
session_start();

define('SITE_NAME', 'Surya Tour Trans');
define('ADMIN_PATH', '/bus_pariwisata/admin');
define('BASE_URL', 'http://localhost/bus_pariwisata');
define('IMAGE_BASE', BASE_URL . '/frontend/assets/images/');

// Koneksi DB
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'bus_pariwisata';

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    die(json_encode(['error' => 'Koneksi DB gagal: ' . mysqli_connect_error()]));
}
mysqli_set_charset($conn, 'utf8mb4');

// Fungsi cek login
function cekLogin() {
    if (!isset($_SESSION['admin_id'])) {
        header('Location: ' . ADMIN_PATH . '/index.php');
        exit;
    }
}

// Fungsi flash message
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

// Fungsi format rupiah
function rupiah($angka) {
    return 'Rp ' . number_format($angka, 0, ',', '.');
}

// Fungsi slug
function makeSlug($str) {
    $str = strtolower(trim($str));
    $str = preg_replace('/[^a-z0-9\s-]/', '', $str);
    $str = preg_replace('/[\s-]+/', '-', $str);
    return $str . '-' . time();
}
?>

<?php
// ============================================================
// admin/api/tambah_armada.php
// API tambah armada bus
// ============================================================

require_once 'auth_helper.php';
require_once '../../config/koneksi.php';

// Verifikasi Token
verifyAdminToken();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Metode request tidak diizinkan.', [], 405);
}

if (!isset($conn) || !$conn) {
    sendResponse('error', 'Koneksi database tidak tersedia.', [], 503);
}

// Ambil input JSON jika ada
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$nama       = trim($_POST['nama_bus'] ?? $body['nama_bus'] ?? '');
$tipe       = trim($_POST['tipe'] ?? $body['tipe'] ?? 'big_bus');
$kapasitas  = (int)($_POST['kapasitas'] ?? $body['kapasitas'] ?? 0);
$harga      = (int)($_POST['harga_sewa'] ?? $body['harga_sewa'] ?? 0);
$gambar     = trim($_POST['gambar_utama'] ?? $body['gambar_utama'] ?? '');
$deskripsi  = trim($_POST['deskripsi'] ?? $body['deskripsi'] ?? '');
$fasilitas  = trim($_POST['fasilitas_json'] ?? $body['fasilitas_json'] ?? '[]');

// Proses file upload gambar jika ada
if (isset($_FILES['gambar_file']) && $_FILES['gambar_file']['error'] !== UPLOAD_ERR_NO_FILE) {
    try {
        $gambar = uploadImage($_FILES['gambar_file'], 'bus', 'bus');
    } catch (Exception $e) {
        sendResponse('error', $e->getMessage());
    }
}

if (!$nama || !$kapasitas || !$harga) {
    sendResponse('error', 'Nama bus, kapasitas, dan harga sewa wajib diisi.');
}

try {
    $stmt = mysqli_prepare($conn,
        "INSERT INTO bus (nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, 'ssiisss', $nama, $tipe, $kapasitas, $harga, $gambar, $deskripsi, $fasilitas);
    
    if (mysqli_stmt_execute($stmt)) {
        $new_id = mysqli_insert_id($conn);
        sendResponse('success', 'Armada berhasil ditambahkan.', ['id' => $new_id]);
    } else {
        sendResponse('error', 'Gagal menambahkan armada.');
    }
    mysqli_stmt_close($stmt);
} catch (Exception $e) {
    sendResponse('error', 'Terjadi kesalahan sistem internal.', [], 500);
}
?>

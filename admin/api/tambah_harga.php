<?php
// ============================================================
// admin/api/tambah_harga.php
// API tambah price list
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

// Ambil input JSON
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$dest    = trim($body['nama_destinasi'] ?? '');
$durasi  = trim($body['durasi'] ?? '');
$hiace   = (int)($body['harga_hiace']  ?? 0);
$elf     = (int)($body['harga_elf']    ?? 0);
$medium  = (int)($body['harga_medium'] ?? 0);
$big     = (int)($body['harga_big']    ?? 0);

if (!$dest || !$durasi) {
    sendResponse('error', 'Nama destinasi dan durasi wajib diisi.');
}

try {
    $stmt = mysqli_prepare($conn,
        "INSERT INTO price_list (nama_destinasi, durasi, harga_hiace, harga_elf, harga_medium, harga_big)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, 'ssiiii', $dest, $durasi, $hiace, $elf, $medium, $big);
    
    if (mysqli_stmt_execute($stmt)) {
        sendResponse('success', 'Harga destinasi berhasil ditambahkan.');
    } else {
        sendResponse('error', 'Gagal menambahkan harga destinasi.');
    }
    mysqli_stmt_close($stmt);
} catch (Exception $e) {
    sendResponse('error', 'Terjadi kesalahan sistem internal.', [], 500);
}
?>

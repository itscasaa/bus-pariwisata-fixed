<?php
// ============================================================
// admin/api/edit_harga.php
// API edit price list
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

$id = (int)($_GET['id'] ?? 0);
if (!$id) {
    sendResponse('error', 'ID destinasi tidak valid.');
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
    $stmt = db_prepare($conn,
        "UPDATE price_list SET nama_destinasi = ?, durasi = ?, harga_hiace = ?, harga_elf = ?, harga_medium = ?, harga_big = ?
         WHERE id = ?"
    );
    db_stmt_bind_param($stmt, 'ssiiiii', $dest, $durasi, $hiace, $elf, $medium, $big, $id);
    
    if (db_stmt_execute($stmt)) {
        sendResponse('success', 'Harga destinasi berhasil diperbarui.');
    } else {
        sendResponse('error', 'Gagal memperbarui harga destinasi.');
    }
    db_stmt_close($stmt);
} catch (Exception $e) {
    sendResponse('error', 'Terjadi kesalahan sistem internal.', [], 500);
}
?>

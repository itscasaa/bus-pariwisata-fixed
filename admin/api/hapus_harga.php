<?php
// ============================================================
// admin/api/hapus_harga.php
// API hapus price list
// ============================================================

require_once 'auth_helper.php';
require_once '../../config/koneksi.php';

// Verifikasi Token
verifyAdminToken();

if (!isset($conn) || !$conn) {
    sendResponse('error', 'Koneksi database tidak tersedia.', [], 503);
}

$id = (int)($_GET['id'] ?? 0);
if (!$id) {
    sendResponse('error', 'ID destinasi tidak valid.');
}

try {
    $stmt = db_prepare($conn, "DELETE FROM price_list WHERE id = ?");
    db_stmt_bind_param($stmt, 'i', $id);
    
    if (db_stmt_execute($stmt)) {
        sendResponse('success', 'Destinasi berhasil dihapus.');
    } else {
        sendResponse('error', 'Gagal menghapus destinasi.');
    }
    db_stmt_close($stmt);
} catch (Exception $e) {
    sendResponse('error', 'Terjadi kesalahan sistem internal.', [], 500);
}
?>

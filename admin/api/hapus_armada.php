<?php
// ============================================================
// admin/api/hapus_armada.php
// API hapus armada bus
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
    sendResponse('error', 'ID armada tidak valid.');
}

try {
    $stmt = mysqli_prepare($conn, "DELETE FROM bus WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    
    if (mysqli_stmt_execute($stmt)) {
        sendResponse('success', 'Armada berhasil dihapus.');
    } else {
        sendResponse('error', 'Gagal menghapus armada.');
    }
    mysqli_stmt_close($stmt);
} catch (Exception $e) {
    sendResponse('error', 'Terjadi kesalahan sistem internal.', [], 500);
}
?>

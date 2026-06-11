<?php
// ============================================================
// admin/api/edit_news.php
// API edit berita
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
    sendResponse('error', 'ID berita tidak valid.');
}

// Ambil input JSON jika ada
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$judul  = trim($_POST['judul'] ?? $body['judul'] ?? '');
$konten = trim($_POST['konten'] ?? $body['konten'] ?? '');
$gambar = trim($_POST['gambar'] ?? $body['gambar'] ?? '');
$status = in_array($_POST['status'] ?? $body['status'] ?? '', ['publish', 'draft']) ? ($_POST['status'] ?? $body['status']) : 'publish';

// Proses file upload gambar jika ada
if (isset($_FILES['gambar_file']) && $_FILES['gambar_file']['error'] !== UPLOAD_ERR_NO_FILE) {
    try {
        $gambar = uploadImage($_FILES['gambar_file'], 'news', 'news');
    } catch (Exception $e) {
        sendResponse('error', $e->getMessage());
    }
}

if (!$judul || !$konten) {
    sendResponse('error', 'Judul dan konten wajib diisi.');
}

// Generate Slug
function makeSlug($str) {
    $str = strtolower(trim($str));
    $str = preg_replace('/[^a-z0-9\s-]/', '', $str);
    $str = preg_replace('/[\s-]+/', '-', $str);
    return $str . '-' . time();
}
$slug = makeSlug($judul);

try {
    $stmt = mysqli_prepare($conn,
        "UPDATE news SET judul = ?, slug = ?, konten = ?, gambar = ?, status = ? WHERE id = ?"
    );
    mysqli_stmt_bind_param($stmt, 'sssssi', $judul, $slug, $konten, $gambar, $status, $id);
    
    if (mysqli_stmt_execute($stmt)) {
        sendResponse('success', 'Berita berhasil diperbarui.');
    } else {
        sendResponse('error', 'Gagal memperbarui berita.');
    }
    mysqli_stmt_close($stmt);
} catch (Exception $e) {
    sendResponse('error', 'Terjadi kesalahan sistem internal.', [], 500);
}
?>

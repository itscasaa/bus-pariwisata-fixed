<?php
// ============================================================
// admin/api/auth_helper.php
// Helper untuk validasi token, CORS, dan respons JSON
// ============================================================

error_reporting(0);
ini_set('display_errors', 0);

// Konfigurasi CORS terpusat
require_once __DIR__ . '/../../config/cors.php';
header('Content-Type: application/json; charset=utf-8');

// Rahasia token (gunakan kunci konsisten)
define('JWT_SECRET_KEY', '3f9b2d8e4c1a7e6f9d8c7b6a5f4e3d2c');

// Verifikasi token
function verifyAdminToken() {
    require_once __DIR__ . '/../../config/auth_guard.php';
}

// Kirim respons JSON
function sendResponse($status, $message = '', $data = [], $code = 200) {
    http_response_code($code);
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Uploads an image safely and returns the relative path.
 * Subfolder should be: 'bus', 'destinasi', or 'news'
 * Prefix should be: 'bus', 'paket', or 'news'
 */
function uploadImage($file, $subFolder, $prefix) {
    if (!isset($file)) {
        throw new Exception('File tidak ditemukan.');
    }
    
    // Call rate limiter for uploads
    require_once __DIR__ . '/../../config/rate_limiter.php';
    checkRateLimit('upload', 5, 60);
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
            throw new Exception('Ukuran file melebihi batas maksimum server (2MB). Silakan gunakan gambar yang lebih kecil.');
        }
        throw new Exception('Gagal mengupload file gambar: Kode error ' . $file['error']);
    }
    
    // Enforce strict size limit: 2MB
    $maxSize = 2 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        throw new Exception('Ukuran file melebihi batas maksimum 2MB.');
    }
    
    // Reject dangerous extensions explicitly (double layer of defense)
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $dangerousExtensions = ['php', 'phtml', 'phar', 'html', 'js', 'svg', 'xml'];
    if (in_array($extension, $dangerousExtensions)) {
        throw new Exception('Ekstensi file berbahaya tidak diizinkan.');
    }
    
    // Validate extension/mime type allowlist
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    $fileMimeType = mime_content_type($file['tmp_name']);
    if (!in_array($fileMimeType, $allowedMimeTypes)) {
        throw new Exception('Tipe file tidak valid. Hanya JPG, JPEG, PNG, dan WEBP yang diizinkan.');
    }
    
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    if (!in_array($extension, $allowedExtensions)) {
        throw new Exception('Ekstensi file tidak valid.');
    }
    
    // Destination directory
    $destDir = '/var/www/bus-pariwisata/images/' . $subFolder . '/';
    
    // Generate safe unique filename: prefix_timestamp_rand.ext
    $filename = $prefix . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . strtolower($extension);
    $destPath = $destDir . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        throw new Exception('Gagal memindahkan file upload ke direktori tujuan.');
    }
    
    // Return relative public path
    return '/images/' . $subFolder . '/' . $filename;
}
?>

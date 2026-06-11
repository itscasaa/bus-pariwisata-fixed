<?php
// ============================================================
// admin/api/auth_helper.php
// Helper untuk validasi token, CORS, dan respons JSON
// ============================================================

error_reporting(0);
ini_set('display_errors', 0);

// Konfigurasi CORS
$allowed_origin = 'https://adminmafina.duckdns.org';
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Rahasia token (gunakan kunci konsisten)
define('JWT_SECRET_KEY', '3f9b2d8e4c1a7e6f9d8c7b6a5f4e3d2c');

// Verifikasi token
function verifyAdminToken() {
    $authHeader = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    
    $token = '';
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
    }
    
    // Fallback to query parameter or POST body if HTTP header is stripped
    if (!$token && isset($_GET['token'])) {
        $token = $_GET['token'];
    }
    if (!$token) {
        $body = json_decode(@file_get_contents('php://input'), true) ?? [];
        if (isset($body['token'])) {
            $token = $body['token'];
        } elseif (isset($_POST['token'])) {
            $token = $_POST['token'];
        }
    }
    
    if ($token) {
        $parts = explode('.', $token);
        if (count($parts) === 2) {
            $payload_b64 = $parts[0];
            $signature = $parts[1];
            $payload = base64_decode($payload_b64);
            
            $expected_sig = hash_hmac('sha256', $payload, JWT_SECRET_KEY);
            if (hash_equals($expected_sig, $signature)) {
                $data = json_decode($payload, true);
                if (isset($data['exp']) && $data['exp'] > time()) {
                    return $data; // Token valid
                }
            }
        }
    }
    
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized: Token tidak valid atau telah kedaluwarsa.'
    ]);
    exit;
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
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
            throw new Exception('Ukuran file melebihi batas maksimum server (2MB). Silakan gunakan gambar yang lebih kecil.');
        }
        throw new Exception('Gagal mengupload file gambar: Kode error ' . $file['error']);
    }
    
    // Validate size (max 5MB, but PHP ini limit is 2MB)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        throw new Exception('Ukuran file melebihi batas maksimum 5MB.');
    }
    
    // Validate extension/mime type
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    $fileMimeType = mime_content_type($file['tmp_name']);
    if (!in_array($fileMimeType, $allowedMimeTypes)) {
        throw new Exception('Tipe file tidak valid. Hanya JPG, JPEG, PNG, dan WEBP yang diizinkan.');
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    if (!in_array(strtolower($extension), $allowedExtensions)) {
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

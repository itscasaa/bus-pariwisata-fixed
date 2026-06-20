<?php
// ============================================================
// admin/api/login.php
// API login untuk admin panel
// ============================================================

require_once 'auth_helper.php';
require_once '../../config/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Metode request tidak diizinkan.', [], 405);
}

if (!isset($conn) || !$conn) {
    sendResponse('error', 'Koneksi database tidak tersedia.', [], 503);
}

require_once '../../config/rate_limiter.php';
checkRateLimit('login', 5, 60);

// Ambil input JSON
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($body['username'] ?? '');
$password = trim($body['password'] ?? '');

if (!$username || !$password) {
    sendResponse('error', 'Username dan password wajib diisi.');
}

try {
    $stmt = mysqli_prepare($conn, "SELECT id, nama, username, password FROM admin_users WHERE username = ? LIMIT 1");
    mysqli_stmt_bind_param($stmt, 's', $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $admin  = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);

    if ($admin && password_verify($password, $admin['password'])) {
        // Generate Token
        $exp = time() + (86400 * 7); // 7 Hari
        $payload = json_encode([
            'admin_id' => $admin['id'],
            'username' => $admin['username'],
            'exp' => $exp
        ]);
        $signature = hash_hmac('sha256', $payload, JWT_SECRET_KEY);
        $token = base64_encode($payload) . '.' . $signature;

        // Initialize server-side session for compatibility with legacy page security checks
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['admin_id']   = $admin['id'];
        $_SESSION['admin_nama'] = $admin['nama'];
        $_SESSION['admin_user'] = $admin['username'];

        sendResponse('success', 'Login berhasil.', [
            'token' => $token,
            'nama'  => $admin['nama']
        ]);
    } else {
        sendResponse('error', 'Username atau password salah.');
    }
} catch (Exception $e) {
    sendResponse('error', 'Terjadi kesalahan sistem internal.', [], 500);
}
?>

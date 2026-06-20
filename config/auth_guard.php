<?php
// ============================================================
// config/auth_guard.php
// Reusable backend auth guard supporting sessions and token verification
// ============================================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Suppress error display to prevent leakage
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

// 1. Check PHP Session (for legacy admin page requests)
if (isset($_SESSION['admin_id'])) {
    return; // Authenticated
}

// 2. Check Bearer Token (for React frontend API calls)
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
        
        if (!defined('JWT_SECRET_KEY')) {
            define('JWT_SECRET_KEY', '3f9b2d8e4c1a7e6f9d8c7b6a5f4e3d2c');
        }
        $expected_sig = hash_hmac('sha256', $payload, JWT_SECRET_KEY);
        if (hash_equals($expected_sig, $signature)) {
            $data = json_decode($payload, true);
            if (isset($data['exp']) && $data['exp'] > time()) {
                return; // Authenticated
            }
        }
    }
}

// Reject unauthenticated requests
http_response_code(401);
echo json_encode([
    'success' => false,
    'status' => 'error',
    'message' => 'Unauthorized access'
], JSON_UNESCAPED_UNICODE);
exit;
?>

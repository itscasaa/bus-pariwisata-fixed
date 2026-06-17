<?php
/**
 * API: Discount
 * 
 * GET  /api/discount.php              → semua diskon aktif
 * GET  /api/discount.php?id=1         → detail diskon by ID
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit;
}

$response = ['status' => 'error', 'message' => '', 'data' => []];

include_once '../config/koneksi.php';

if (!isset($conn) || !$conn) {
    http_response_code(503);
    $response['message'] = 'Database connection not available.';
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    $response['message'] = 'Only GET method is allowed.';
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    // ── Single discount by ID ──────────────────────────────────────────────────
    if ($id > 0) {
        $stmt = mysqli_prepare($conn,
            "SELECT id, judul, badge, kategori, deskripsi, gambar, status, urutan, created_at 
             FROM paket_wisata WHERE id = ? LIMIT 1"
        );
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row    = mysqli_fetch_assoc($result);

        if (!$row) {
            http_response_code(404);
            $response['message'] = 'Diskon tidak ditemukan.';
        } else {
            http_response_code(200);
            $response['status'] = 'success';
            $response['data']   = formatDiscount($row);
        }
        mysqli_stmt_close($stmt);

    // ── Semua diskon aktif ───────────────────────────────────────────────────
    } else {
        $result = mysqli_query($conn,
            "SELECT id, judul, badge, kategori, deskripsi, gambar, status, urutan, created_at
             FROM paket_wisata WHERE status = 'aktif'
             ORDER BY urutan ASC, id ASC"
        );
        if ($result === false) throw new Exception(mysqli_error($conn));
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = formatDiscount($row);
        }
        http_response_code(200);
        $response['status'] = 'success';
        $response['data']   = $data;
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Internal server error: ' . $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
if (isset($conn) && $conn) mysqli_close($conn);

// ── Helper: normalisasi semua path gambar → /images/... ──────────────────────
function normalizeImagePath($path) {
    if (!$path) return '';

    // 1. Backslash → forward slash
    $path = str_replace('\\', '/', trim($path));

    // 2. Hapus domain/host (http://... atau https://...) beserta slash setelahnya
    $path = preg_replace('#^https?://[^/]+/#', '/', $path);

    // 3. Cari segmen images yang dikenal; buang segmen itu DAN semua sebelumnya
    $segments = [
        '/frontend/assets/images/',
        'frontend/assets/images/',
        '/assets/images/',
        'assets/images/',
        '/images/',
        'images/',
    ];
    foreach ($segments as $seg) {
        $pos = strpos($path, $seg);
        if ($pos !== false) {
            $path = substr($path, $pos + strlen($seg));
            break;
        }
    }

    // 4. Hapus leading slash sisa path relatif
    $path = ltrim($path, '/');

    // 5. Kembalikan dengan satu prefix /images/
    return '/images/' . $path;
}

// ── Helper ──────────────────────────────────────────────────────────────────
function formatDiscount(array $row): array {
    return [
        'id'         => (int)$row['id'],
        'judul'      => (string)$row['judul'],
        'badge'      => (string)$row['badge'], // tag diskon, e.g. "10%"
        'kategori'   => (string)($row['kategori'] ?? ''),
        'deskripsi'  => (string)($row['deskripsi'] ?? ''),
        'gambar'     => normalizeImagePath($row['gambar'] ?? ''),
        'status'     => (string)$row['status'],
        'urutan'     => (int)$row['urutan'],
        'created_at' => (string)$row['created_at'],
    ];
}
?>

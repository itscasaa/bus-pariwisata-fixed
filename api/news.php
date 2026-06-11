<?php
/**
 * API: News
 * GET /api/news.php           → semua berita, terbaru dulu
 * GET /api/news.php?id=1      → detail by ID
 * GET /api/news.php?slug=xxx  → detail by slug
 *
 * Selalu mengembalikan JSON. Jika tabel news tidak ada → data: [] (HTTP 200).
 * Field ringkas: pakai kolom jika ada, kalau tidak diturunkan dari konten.
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
    // ── Jika tabel news tidak ada → kembalikan data kosong, JANGAN 404/500 ──
    $tbl = mysqli_query($conn, "SHOW TABLES LIKE 'news'");
    if (!$tbl || mysqli_num_rows($tbl) === 0) {
        http_response_code(200);
        $response['status']  = 'success';
        $response['message'] = '';
        $response['data']    = [];
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        if (isset($conn) && $conn) mysqli_close($conn);
        exit;
    }

    // ── Deteksi kolom yang tersedia ────────────────────────────────────────
    $cols = [];
    $col_q = mysqli_query($conn, "SHOW COLUMNS FROM news");
    if ($col_q) {
        while ($c = mysqli_fetch_assoc($col_q)) $cols[] = $c['Field'];
    }
    $has_ringkas = in_array('ringkas', $cols, true);
    $has_status  = in_array('status', $cols, true);
    $has_slug    = in_array('slug', $cols, true);

    // Susun daftar kolom SELECT secara aman
    $select_cols = ['id', 'judul'];
    if ($has_ringkas) $select_cols[] = 'ringkas';
    $select_cols[] = 'konten';
    $select_cols[] = 'gambar';
    if ($has_slug) $select_cols[] = 'slug';
    $select_cols[] = 'created_at';
    $select_list = implode(', ', $select_cols);

    $where_publish = $has_status ? "WHERE status = 'publish'" : '';

    $id   = isset($_GET['id'])   ? (int)$_GET['id']    : 0;
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

    if ($id > 0) {
        $sql  = "SELECT $select_list FROM news WHERE id = ? LIMIT 1";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row    = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        if (!$row) { http_response_code(404); $response['message'] = 'Berita tidak ditemukan.'; }
        else        { $response['status'] = 'success'; $response['data'] = formatNews($row, $has_ringkas); }

    } elseif ($slug !== '' && $has_slug) {
        $sql  = "SELECT $select_list FROM news WHERE slug = ? LIMIT 1";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 's', $slug);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row    = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        if (!$row) { http_response_code(404); $response['message'] = 'Berita tidak ditemukan.'; }
        else        { $response['status'] = 'success'; $response['data'] = formatNews($row, $has_ringkas); }

    } else {
        $sql = "SELECT $select_list FROM news $where_publish ORDER BY created_at DESC, id DESC";
        $result = mysqli_query($conn, $sql);
        $data = [];
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = formatNews($row, $has_ringkas);
            }
        }
        http_response_code(200);
        $response['status'] = 'success';
        $response['data']   = $data;
    }

} catch (Exception $e) {
    // Jangan bocorkan HTML; tetap JSON
    http_response_code(200);
    $response['status']  = 'success';
    $response['message'] = '';
    $response['data']    = [];
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

// ── Helper: turunkan ringkas dari konten ─────────────────────────────────────
function deriveRingkas($konten) {
    $text = trim(preg_replace('/\s+/u', ' ', strip_tags((string)$konten)));
    if (mb_strlen($text) <= 180) return $text;
    return rtrim(mb_substr($text, 0, 180)) . '…';
}

function formatNews(array $row, bool $hasRingkas): array {
    $gambar = $row['gambar'] ?? '';
    $ringkas = ($hasRingkas && isset($row['ringkas']) && $row['ringkas'] !== '')
        ? (string)$row['ringkas']
        : deriveRingkas($row['konten'] ?? '');

    return [
        'id'         => (int)$row['id'],
        'judul'      => (string)$row['judul'],
        'ringkas'    => $ringkas,
        'konten'     => (string)($row['konten'] ?? ''),
        'gambar'     => $gambar !== '' ? normalizeImagePath($gambar) : '',
        'created_at' => (string)($row['created_at'] ?? ''),
    ];
}
?>

<?php
/**
 * API: Get All Buses with Images
 * Endpoint: GET /api/buses.php
 * GET /api/buses.php        → semua bus
 * GET /api/buses.php?id=1   → detail bus by ID
 *
 * Image paths dikembalikan sebagai path relatif: /images/bus1/bu1.jpeg
 * Tidak ada hardcode localhost atau domain.
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
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

try {
    // ── Deteksi kolom yang tersedia di tabel bus ──────────────────────────────
    $col_check = mysqli_query($conn, "SHOW COLUMNS FROM bus");
    if (!$col_check) throw new Exception('Tabel bus tidak ditemukan.');

    $cols = [];
    while ($c = mysqli_fetch_assoc($col_check)) $cols[] = $c['Field'];

    $col_gambar    = in_array('gambar_utama', $cols)    ? 'gambar_utama'               : 'gambar';
    $col_tipe      = in_array('tipe', $cols)             ? 'tipe'                        : "'bus' AS tipe";
    $col_deskripsi = in_array('deskripsi', $cols)        ? 'deskripsi'                   : "'' AS deskripsi";
    $col_fasilitas = in_array('fasilitas_json', $cols)   ? 'fasilitas_json AS fasilitas'
                   : (in_array('fasilitas', $cols)       ? 'fasilitas'                   : "'' AS fasilitas");

    $bus_id_filter = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($bus_id_filter > 0) {
        $sql  = "SELECT id, nama_bus, $col_tipe, kapasitas, harga_sewa,
                        $col_gambar AS gambar_utama, $col_deskripsi, $col_fasilitas
                 FROM bus WHERE id = ? LIMIT 1";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 'i', $bus_id_filter);
        mysqli_stmt_execute($stmt);
        $query = mysqli_stmt_get_result($stmt);
    } else {
        $sql   = "SELECT id, nama_bus, $col_tipe, kapasitas, harga_sewa,
                         $col_gambar AS gambar_utama, $col_deskripsi, $col_fasilitas
                  FROM bus ORDER BY id ASC";
        $query = mysqli_query($conn, $sql);
    }

    if ($query === false) throw new Exception('Query bus gagal: ' . mysqli_error($conn));

    // ── Cek apakah tabel bus_images ada ──────────────────────────────────────
    $img_tbl       = mysqli_query($conn, "SHOW TABLES LIKE 'bus_images'");
    $has_img_table = $img_tbl && mysqli_num_rows($img_tbl) > 0;

    $buses = [];
    while ($row = mysqli_fetch_assoc($query)) {
        $bus_id = (int)$row['id'];

        // ── Gambar tambahan ───────────────────────────────────────────────────
        $images = [];
        if ($has_img_table) {
            $img_stmt = mysqli_prepare($conn,
                "SELECT id, path, label, tipe_gambar, urutan, is_cover FROM bus_images WHERE bus_id = ? ORDER BY urutan ASC, id ASC"
            );
            mysqli_stmt_bind_param($img_stmt, 'i', $bus_id);
            mysqli_stmt_execute($img_stmt);
            $img_result = mysqli_stmt_get_result($img_stmt);
            if ($img_result) {
                while ($img = mysqli_fetch_assoc($img_result)) {
                    $images[] = [
                        'id'          => (int)$img['id'],
                        'path'        => normalizeImagePath($img['path']),
                        'label'       => (string)$img['label'],
                        'tipe_gambar' => (string)($img['tipe_gambar'] ?? 'other'),
                        'urutan'      => (int)$img['urutan'],
                        'is_cover'    => (int)($img['is_cover'] ?? 0),
                    ];
                }
            }
            mysqli_stmt_close($img_stmt);
        }

        // ── Decode fasilitas JSON ─────────────────────────────────────────────
        $fasilitas = [];
        if (!empty($row['fasilitas'])) {
            $decoded   = json_decode($row['fasilitas'], true);
            $fasilitas = is_array($decoded) ? $decoded : [];
        }

        $gambar_url = normalizeImagePath($row['gambar_utama']);

        $buses[] = [
            'id'           => $bus_id,
            'nama_bus'     => (string)$row['nama_bus'],
            'tipe'         => (string)$row['tipe'],
            'kapasitas'    => (int)$row['kapasitas'],
            'harga_sewa'   => (int)$row['harga_sewa'],
            'gambar'       => $gambar_url,        // backward compat
            'gambar_utama' => $gambar_url,
            'deskripsi'    => (string)($row['deskripsi'] ?? ''),
            'fasilitas'    => $fasilitas,
            'images'       => $images,
        ];
    }

    if ($bus_id_filter > 0) {
        if (empty($buses)) {
            http_response_code(404);
            $response['message'] = 'Bus tidak ditemukan.';
        } else {
            http_response_code(200);
            $response['status'] = 'success';
            $response['data']   = $buses[0];
        }
    } else {
        http_response_code(200);
        $response['status'] = 'success';
        $response['data']   = $buses;
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Internal server error: ' . $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
if (isset($conn) && $conn) mysqli_close($conn);
?>

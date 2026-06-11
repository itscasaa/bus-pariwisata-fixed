<?php
/**
 * API: Health Check
 * Endpoint: GET /api/health.php
 * Cek koneksi database dan ketersediaan tabel.
 * Tidak mengekspos password atau info sensitif.
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

include_once '../config/koneksi.php';

$db_ok = isset($conn) && $conn !== false;

$tables_required = ['bus', 'bus_images', 'price_list', 'paket_wisata', 'admin_users', 'news', 'pesan_masuk'];
$tables_status   = [];

if ($db_ok) {
    foreach ($tables_required as $tbl) {
        $check              = mysqli_query($conn, "SHOW TABLES LIKE '$tbl'");
        $tables_status[$tbl] = ($check && mysqli_num_rows($check) > 0);
    }
}

$all_tables_ok = $db_ok && !in_array(false, $tables_status, true);

$response = [
    'status'   => ($db_ok ? 'success' : 'error'),
    'php'      => 'ok',
    'database' => ($db_ok ? 'connected' : 'disconnected'),
    'tables'   => $db_ok ? $tables_status : [],
    'all_ok'   => $all_tables_ok,
];

http_response_code($db_ok ? 200 : 503);
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

if ($db_ok) mysqli_close($conn);
?>

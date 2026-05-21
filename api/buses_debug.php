<?php
/**
 * API DEBUG: buses_debug.php
 * Hapus file ini setelah masalah selesai!
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$response = ['step' => '', 'status' => 'error', 'message' => '', 'data' => []];

// Step 1: Koneksi DB
include_once '../config/koneksi.php';
$response['step'] = '1_koneksi';

if (!isset($conn) || !$conn) {
  $response['message'] = 'GAGAL koneksi DB: ' . mysqli_connect_error();
  echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}
$response['db_connect'] = 'OK';

// Step 2: Cek tabel bus ada atau tidak
$response['step'] = '2_cek_tabel_bus';
$check = mysqli_query($conn, "SHOW TABLES LIKE 'bus'");
$tableExists = mysqli_num_rows($check) > 0;
$response['tabel_bus_exists'] = $tableExists;

if (!$tableExists) {
  $response['message'] = 'Tabel bus TIDAK ADA. Jalankan database/bus_setup.sql dulu!';
  echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}

// Step 3: Cek kolom tabel bus
$response['step'] = '3_cek_kolom';
$cols = mysqli_query($conn, "DESCRIBE bus");
$columns = [];
while ($c = mysqli_fetch_assoc($cols)) {
  $columns[] = $c['Field'];
}
$response['kolom_bus'] = $columns;

// Step 4: Cek tabel bus_images
$check2 = mysqli_query($conn, "SHOW TABLES LIKE 'bus_images'");
$response['tabel_bus_images_exists'] = mysqli_num_rows($check2) > 0;

// Step 5: Cek jumlah data
$response['step'] = '5_cek_data';
$count = mysqli_query($conn, "SELECT COUNT(*) as total FROM bus");
$row = mysqli_fetch_assoc($count);
$response['jumlah_data_bus'] = (int)$row['total'];

// Step 6: Ambil 1 row sample
if ((int)$row['total'] > 0) {
  $sample = mysqli_query($conn, "SELECT * FROM bus LIMIT 1");
  $response['sample_row'] = mysqli_fetch_assoc($sample);
}

$response['status'] = 'debug_complete';
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

mysqli_close($conn);
?>

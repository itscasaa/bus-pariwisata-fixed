<?php
/**
 * API: Get All Buses with Images
 * Endpoint: GET /api/buses.php
 * Kompatibel dengan kolom: gambar ATAU gambar_utama
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

$IMAGE_BASE = 'http://localhost/bus_pariwisata/frontend/assets/images/';

try {
  // --- Deteksi kolom yang tersedia di tabel bus ---
  $col_check   = mysqli_query($conn, "SHOW COLUMNS FROM bus");
  $cols        = [];
  while ($c = mysqli_fetch_assoc($col_check)) $cols[] = $c['Field'];

  $col_gambar    = in_array('gambar_utama', $cols) ? 'gambar_utama' : 'gambar';
  $col_tipe      = in_array('tipe',         $cols) ? 'tipe'         : "'bus' AS tipe";
  $col_deskripsi = in_array('deskripsi',    $cols) ? 'deskripsi'    : "'' AS deskripsi";
  $col_fasilitas = in_array('fasilitas_json',$cols) ? 'fasilitas_json AS fasilitas'
                 : (in_array('fasilitas',  $cols)  ? 'fasilitas'    : "'' AS fasilitas");

  $bus_id_filter = isset($_GET['id']) ? (int)$_GET['id'] : 0;

  if ($bus_id_filter > 0) {
    $sql = "SELECT id, nama_bus, $col_tipe, kapasitas, harga_sewa,
                   $col_gambar AS gambar_utama, $col_deskripsi, $col_fasilitas
            FROM bus WHERE id = $bus_id_filter LIMIT 1";
  } else {
    $sql = "SELECT id, nama_bus, $col_tipe, kapasitas, harga_sewa,
                   $col_gambar AS gambar_utama, $col_deskripsi, $col_fasilitas
            FROM bus ORDER BY id ASC";
  }

  $query = mysqli_query($conn, $sql);
  if ($query === false) throw new Exception('Query bus gagal: ' . mysqli_error($conn));

  // Cek apakah tabel bus_images ada
  $img_tbl = mysqli_query($conn, "SHOW TABLES LIKE 'bus_images'");
  $has_img_table = mysqli_num_rows($img_tbl) > 0;

  $buses = [];
  while ($row = mysqli_fetch_assoc($query)) {
    $bus_id = (int)$row['id'];

    // Gambar fasilitas
    $images = [];
    if ($has_img_table) {
      $img_q = mysqli_query($conn,
        "SELECT path, label, urutan FROM bus_images
         WHERE bus_id = $bus_id ORDER BY urutan ASC"
      );
      if ($img_q) {
        while ($img = mysqli_fetch_assoc($img_q)) {
          $images[] = [
            'path'   => $IMAGE_BASE . $img['path'],
            'label'  => (string)$img['label'],
            'urutan' => (int)$img['urutan'],
          ];
        }
      }
    }

    // Decode fasilitas JSON
    $fasilitas = [];
    if (!empty($row['fasilitas'])) {
      $decoded = json_decode($row['fasilitas'], true);
      $fasilitas = is_array($decoded) ? $decoded : [];
    }

    $gambar_url = $IMAGE_BASE . $row['gambar_utama'];

    $buses[] = [
      'id'           => $bus_id,
      'nama_bus'     => (string)$row['nama_bus'],
      'tipe'         => (string)$row['tipe'],
      'kapasitas'    => (int)$row['kapasitas'],
      'harga_sewa'   => (int)$row['harga_sewa'],
      'gambar'       => $gambar_url,        // backward compat BusFleet lama
      'gambar_utama' => $gambar_url,
      'deskripsi'    => (string)($row['deskripsi'] ?? ''),
      'fasilitas'    => $fasilitas,
      'images'       => $images,
    ];
  }

  if ($bus_id_filter > 0) {
    if (empty($buses)) {
      http_response_code(404);
      $response['status']  = 'error';
      $response['message'] = 'Bus tidak ditemukan.';
    } else {
      http_response_code(200);
      $response['status']  = 'success';
      $response['message'] = '';
      $response['data']    = $buses[0];
    }
  } else {
    http_response_code(200);
    $response['status']  = 'success';
    $response['message'] = '';
    $response['data']    = $buses;
  }

} catch (Exception $e) {
  http_response_code(500);
  $response['message'] = 'Internal server error: ' . $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
if (isset($conn) && $conn) mysqli_close($conn);
?>

<?php
header('Content-Type: application/json; charset=utf-8');

include_once '../config/koneksi.php';

function respond($status, $message, $data = [])
{
  echo json_encode([
    'status' => $status,
    'message' => $message,
    'data' => $data
  ]);
  exit;
}

if (!isset($conn) || !$conn) {
  respond('error', 'Database connection not available.', []);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  respond('error', 'Invalid request method.', []);
}

require_once __DIR__ . '/../config/rate_limiter.php';
checkRateLimit('contact', 10, 60);

$input = $_POST;
if (empty($input)) {
  $raw = file_get_contents('php://input');
  $json = json_decode($raw, true);
  if (is_array($json)) {
    $input = $json;
  }
}

$nama  = isset($input['nama']) ? trim($input['nama']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$judul = isset($input['judul']) ? trim($input['judul']) : '';
$pesan = isset($input['pesan']) ? trim($input['pesan']) : '';

if ($nama === '' || $email === '' || $judul === '' || $pesan === '') {
  respond('error', 'Nama, email, judul, dan pesan wajib diisi.', []);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond('error', 'Format email tidak valid.', []);
}

$stmt = mysqli_prepare($conn, "INSERT INTO pesan_masuk (nama, email, judul, pesan) VALUES (?, ?, ?, ?)");
if ($stmt === false) {
  respond('error', 'Gagal menyiapkan query.', []);
}

$ok = $stmt->bind_param("ssss", $nama, $email, $judul, $pesan);
if ($ok === false) {
  $stmt->close();
  respond('error', 'Gagal mengikat parameter.', []);
}

$execOk = $stmt->execute();
if (!$execOk) {
  $stmt->close();
  respond('error', 'Gagal menyimpan pesan.', []);
}

$stmt->close();
respond('success', 'Pesan berhasil terkirim!', []);
?>

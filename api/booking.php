<?php
error_reporting(0);
ini_set('display_errors', 0);
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
    respond('error', 'Invalid request method.', []);
}

$input = $_POST;

$nama = isset($input['nama']) ? trim($input['nama']) : '';
$no_hp = isset($input['no_hp']) ? trim($input['no_hp']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$tanggal = isset($input['tanggal']) ? trim($input['tanggal']) : '';
$tujuan = isset($input['tujuan']) ? trim($input['tujuan']) : '';
$jumlah = isset($input['jumlah']) ? trim($input['jumlah']) : '';
$bus_id = isset($input['bus_id']) ? trim($input['bus_id']) : '';

$namaField = $nama !== '';
$noHpField = $no_hp !== '';
$tanggalField = $tanggal !== '';
$tujuanField = $tujuan !== '';

if (!($namaField && $noHpField && $tanggalField && $tujuanField)) {
    respond('error', 'Field wajib: nama, no_hp, tanggal, tujuan.', []);
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond('error', 'Format email tidak valid.', []);
}

if ($jumlah !== '' && !ctype_digit((string)$jumlah)) {
    respond('error', 'Field jumlah harus angka.', []);
}

$namaEsc = mysqli_real_escape_string($conn, $nama);
$noHpEsc = mysqli_real_escape_string($conn, $no_hp);
$emailEsc = mysqli_real_escape_string($conn, $email);
$tanggalEsc = mysqli_real_escape_string($conn, $tanggal);
$tujuanEsc = mysqli_real_escape_string($conn, $tujuan);
$jumlahEsc = ($jumlah === '' ? null : (int)$jumlah);

$busIdEsc = $bus_id === '' ? null : (int)$bus_id;

$tableHasBusId = false;
$test = mysqli_query($conn, "SHOW COLUMNS FROM booking LIKE 'bus_id'");
if ($test && mysqli_num_rows($test) > 0) {
    $tableHasBusId = true;
}

if ($tableHasBusId) {
    $stmt = mysqli_prepare($conn, "INSERT INTO booking (nama, no_hp, email, tanggal, tujuan, jumlah, bus_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    if ($stmt === false) {
        respond('error', 'Gagal menyiapkan query booking.', []);
    }
    $stmt->bind_param(
        'ssssssi',
        $namaEsc,
        $noHpEsc,
        $emailEsc,
        $tanggalEsc,
        $tujuanEsc,
        $jumlahEsc,
        $busIdEsc
    );
} else {
    $stmt = mysqli_prepare($conn, "INSERT INTO booking (nama, no_hp, email, tanggal, tujuan, jumlah) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt === false) {
        respond('error', 'Gagal menyiapkan query booking.', []);
    }
    $stmt->bind_param(
        'sssssi',
        $namaEsc,
        $noHpEsc,
        $emailEsc,
        $tanggalEsc,
        $tujuanEsc,
        $jumlahEsc
    );
}

$execOk = $stmt->execute();
if (!$execOk) {
    $err = $stmt->error ? $stmt->error : mysqli_error($conn);
    $stmt->close();
    respond('error', 'Gagal menyimpan booking: ' . $err, []);
}

$stmt->close();
respond('success', 'Booking berhasil dibuat.', []);
?>


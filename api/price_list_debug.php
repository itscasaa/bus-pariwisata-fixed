<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

include_once '../config/koneksi.php';

$result = [];

// Cek tabel price_list
$check = mysqli_query($conn, "SHOW TABLES LIKE 'price_list'");
$result['tabel_exists'] = mysqli_num_rows($check) > 0;

if ($result['tabel_exists']) {
    $cols = mysqli_query($conn, "DESCRIBE price_list");
    while ($c = mysqli_fetch_assoc($cols)) $result['kolom'][] = $c['Field'];
    
    $count = mysqli_query($conn, "SELECT COUNT(*) as total FROM price_list");
    $result['jumlah_data'] = (int)mysqli_fetch_assoc($count)['total'];
    
    if ($result['jumlah_data'] > 0) {
        $sample = mysqli_query($conn, "SELECT * FROM price_list LIMIT 3");
        while ($row = mysqli_fetch_assoc($sample)) $result['sample'][] = $row;
    }
} else {
    $result['pesan'] = 'Tabel price_list belum ada. Jalankan database/price_list_setup.sql';
}

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
mysqli_close($conn);
?>

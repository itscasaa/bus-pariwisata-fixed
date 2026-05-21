<?php
// Hubungkan ke file koneksi yang ada di folder config
include '../config/koneksi.php'; 

if (isset($_POST['kirim'])) {
    $nama  = $_POST['nama'];
    $email = $_POST['email'];
    $judul = $_POST['judul'];
    $pesan = $_POST['pesan'];

    // Query sesuai struktur tabel di phpMyAdmin kamu
    $query = "INSERT INTO pesan_masuk (nama, email, judul, pesan) 
              VALUES ('$nama', '$email', '$judul', '$pesan')";

    if (mysqli_query($koneksi, $query)) {
        echo "<script>
                alert('Pesan berhasil terkirim!');
                window.location.href='../kontak.php';
              </script>";
    } else {
        echo "Gagal: " . mysqli_error($koneksi);
    }
}
?>
<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "bus_pariwisata"; // pastikan sama dengan nama database di phpMyAdmin

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi ke database '$db' gagal: " . mysqli_connect_error());
}

// optional
mysqli_set_charset($conn, "utf8");
?>
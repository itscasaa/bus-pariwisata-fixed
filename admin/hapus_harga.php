<?php
require_once 'config.php';
cekLogin();
$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: price_list.php'); exit; }
mysqli_query($conn, "DELETE FROM price_list WHERE id=$id");
setFlash('success', 'Harga destinasi berhasil dihapus.');
header('Location: price_list.php');
exit;

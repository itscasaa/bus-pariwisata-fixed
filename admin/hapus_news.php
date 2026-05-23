<?php
require_once 'config.php';
cekLogin();
$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: news.php'); exit; }
mysqli_query($conn, "DELETE FROM news WHERE id=$id");
setFlash('success', 'Berita berhasil dihapus.');
header('Location: news.php');
exit;

<?php
require_once 'config.php';
cekLogin();

$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: armada.php'); exit; }

mysqli_query($conn, "DELETE FROM bus WHERE id = $id");
setFlash('success', 'Armada berhasil dihapus.');
header('Location: armada.php');
exit;

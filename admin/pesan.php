<?php
/**
 * Admin: Pesan Masuk
 * Menampilkan semua pesan dari form contact frontend
 */
require_once 'config.php';
cekLogin();
$pageTitle = 'Pesan Masuk';

// Tandai sudah dibaca
if (isset($_GET['read'])) {
    $rid  = (int)$_GET['read'];
    $stmt = mysqli_prepare($conn, "UPDATE pesan_masuk SET is_read = 1 WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $rid);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    header('Location: pesan.php'); exit;
}

// Hapus pesan
if (isset($_POST['action']) && $_POST['action'] === 'hapus') {
    $id   = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        $stmt = mysqli_prepare($conn, "DELETE FROM pesan_masuk WHERE id = ?");
        mysqli_stmt_bind_param($stmt, 'i', $id);
        if (mysqli_stmt_execute($stmt)) setFlash('success', 'Pesan berhasil dihapus.');
        else setFlash('error', 'Gagal hapus pesan.');
        mysqli_stmt_close($stmt);
    }
    header('Location: pesan.php'); exit;
}

// Cek apakah kolom is_read ada
$cols_q   = mysqli_query($conn, "SHOW COLUMNS FROM pesan_masuk");
$cols_arr = [];
while ($c = mysqli_fetch_assoc($cols_q)) $cols_arr[] = $c['Field'];
$has_is_read = in_array('is_read', $cols_arr);

// Ambil semua pesan
$pesan_list = mysqli_query($conn,
    "SELECT id, nama, email, judul, pesan" . ($has_is_read ? ", is_read" : ", 0 AS is_read") . ", created_at
     FROM pesan_masuk ORDER BY created_at DESC"
);

$total_unread = 0;
if ($has_is_read) {
    $r = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM pesan_masuk WHERE is_read = 0"));
    $total_unread = (int)$r['c'];
}

include 'layout_header.php';
?>

<div class="mb-4 flex items-center gap-3">
  <span class="text-sm text-gray-500"><?= $total_unread ?> pesan belum dibaca</span>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-100">
  <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
    <h2 class="font-bold text-gray-800 text-sm">Daftar Pesan Masuk</h2>
    <span class="text-xs text-gray-400"><?= mysqli_num_rows($pesan_list) ?> pesan</span>
  </div>
  <div class="divide-y divide-gray-50">
    <?php if (mysqli_num_rows($pesan_list) === 0): ?>
    <p class="px-5 py-10 text-center text-gray-400 text-sm">Belum ada pesan masuk.</p>
    <?php endif; ?>

    <?php while ($p = mysqli_fetch_assoc($pesan_list)): ?>
    <div class="px-5 py-4 <?= !$p['is_read'] ? 'bg-blue-50/50' : '' ?>">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <?php if (!$p['is_read']): ?>
            <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
            <?php endif; ?>
            <p class="font-semibold text-gray-800 text-sm"><?= htmlspecialchars($p['nama']) ?></p>
            <span class="text-gray-400 text-xs">·</span>
            <p class="text-gray-400 text-xs"><?= htmlspecialchars($p['email']) ?></p>
          </div>
          <p class="text-sm font-medium text-gray-700 mb-1"><?= htmlspecialchars($p['judul']) ?></p>
          <p class="text-gray-500 text-sm line-clamp-2"><?= htmlspecialchars($p['pesan']) ?></p>
          <p class="text-xs text-gray-400 mt-2"><?= date('d M Y, H:i', strtotime($p['created_at'])) ?> WIB</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <?php if (!$p['is_read']): ?>
          <a href="pesan.php?read=<?= $p['id'] ?>"
            class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors">
            <i class="fas fa-check mr-1"></i>Tandai Dibaca
          </a>
          <?php endif; ?>
          <a href="mailto:<?= htmlspecialchars($p['email']) ?>?subject=Re: <?= urlencode($p['judul']) ?>"
            class="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-semibold transition-colors">
            <i class="fas fa-reply mr-1"></i>Balas
          </a>
          <form method="POST" onsubmit="return confirm('Hapus pesan ini?')">
            <input type="hidden" name="action" value="hapus">
            <input type="hidden" name="id" value="<?= $p['id'] ?>">
            <button type="submit"
              class="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors">
              <i class="fas fa-trash"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
    <?php endwhile; ?>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

<?php
require_once 'config.php';
cekLogin();

$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: price_list.php'); exit; }

$p = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM price_list WHERE id=$id LIMIT 1"));
if (!$p) { setFlash('error', 'Data tidak ditemukan.'); header('Location: price_list.php'); exit; }

$pageTitle = 'Edit Harga';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dest   = trim($_POST['nama_destinasi'] ?? '');
    $durasi = trim($_POST['durasi'] ?? '');
    $hiace  = (int)($_POST['harga_hiace']  ?? 0);
    $elf    = (int)($_POST['harga_elf']    ?? 0);
    $medium = (int)($_POST['harga_medium'] ?? 0);
    $big    = (int)($_POST['harga_big']    ?? 0);

    if ($dest && $durasi) {
        $stmt = mysqli_prepare($conn,
            "UPDATE price_list SET nama_destinasi=?, durasi=?, harga_hiace=?, harga_elf=?, harga_medium=?, harga_big=? WHERE id=?"
        );
        mysqli_stmt_bind_param($stmt, 'ssiiiis', $dest, $durasi, $hiace, $elf, $medium, $big, $id);
        // fix bind_param: id is int
        mysqli_stmt_bind_param($stmt, 'ssiiiii', $dest, $durasi, $hiace, $elf, $medium, $big, $id);
        if (mysqli_stmt_execute($stmt)) {
            setFlash('success', 'Harga berhasil diperbarui!');
            header('Location: price_list.php');
            exit;
        } else {
            $error = 'Gagal menyimpan: ' . mysqli_error($conn);
        }
    } else {
        $error = 'Nama destinasi dan durasi wajib diisi.';
    }
}

include 'layout_header.php';
?>

<div class="max-w-xl">
  <a href="price_list.php" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1d6ec5] mb-5 transition-colors">
    <i class="fas fa-arrow-left"></i> Kembali ke Price List
  </a>

  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="font-bold text-gray-800 text-lg mb-5">Edit Harga Destinasi</h2>

    <?php if (!empty($error)): ?>
    <div class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
      <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
    </div>
    <?php endif; ?>

    <form method="POST" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Destinasi <span class="text-red-500">*</span></label>
        <input type="text" name="nama_destinasi" value="<?= htmlspecialchars($_POST['nama_destinasi'] ?? $p['nama_destinasi']) ?>"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Durasi <span class="text-red-500">*</span></label>
        <input type="text" name="durasi" value="<?= htmlspecialchars($_POST['durasi'] ?? $p['durasi']) ?>"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga HiAce (Rp)</label>
          <input type="number" name="harga_hiace" value="<?= $_POST['harga_hiace'] ?? $p['harga_hiace'] ?>"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga Elf (Rp)</label>
          <input type="number" name="harga_elf" value="<?= $_POST['harga_elf'] ?? $p['harga_elf'] ?>"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga Medium Bus (Rp)</label>
          <input type="number" name="harga_medium" value="<?= $_POST['harga_medium'] ?? $p['harga_medium'] ?>"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga Big Bus (Rp)</label>
          <input type="number" name="harga_big" value="<?= $_POST['harga_big'] ?? $p['harga_big'] ?>"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit"
          class="px-6 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2">
          <i class="fas fa-save"></i> Simpan Perubahan
        </button>
        <a href="price_list.php" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-colors">
          Batal
        </a>
      </div>
    </form>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

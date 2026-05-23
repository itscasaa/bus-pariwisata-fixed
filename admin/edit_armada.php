<?php
require_once 'config.php';
cekLogin();

$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: armada.php'); exit; }

$bus = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM bus WHERE id = $id LIMIT 1"));
if (!$bus) { setFlash('error', 'Armada tidak ditemukan.'); header('Location: armada.php'); exit; }

$pageTitle = 'Edit Armada: ' . htmlspecialchars($bus['nama_bus']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama      = trim($_POST['nama_bus'] ?? '');
    $tipe      = trim($_POST['tipe'] ?? 'big_bus');
    $kapasitas = (int)($_POST['kapasitas'] ?? 0);
    $harga     = (int)($_POST['harga_sewa'] ?? 0);
    $gambar    = trim($_POST['gambar_utama'] ?? '');
    $deskripsi = trim($_POST['deskripsi'] ?? '');
    $fasilitas = trim($_POST['fasilitas_json'] ?? '[]');

    if ($nama && $kapasitas && $harga) {
        $stmt = mysqli_prepare($conn,
            "UPDATE bus SET nama_bus=?, tipe=?, kapasitas=?, harga_sewa=?, gambar_utama=?, deskripsi=?, fasilitas_json=? WHERE id=?"
        );
        mysqli_stmt_bind_param($stmt, 'ssiisssi', $nama, $tipe, $kapasitas, $harga, $gambar, $deskripsi, $fasilitas, $id);
        if (mysqli_stmt_execute($stmt)) {
            setFlash('success', 'Armada berhasil diperbarui!');
            header('Location: armada.php');
            exit;
        } else {
            $error = 'Gagal menyimpan: ' . mysqli_error($conn);
        }
    } else {
        $error = 'Nama bus, kapasitas, dan harga wajib diisi.';
    }
}

include 'layout_header.php';
?>

<div class="max-w-2xl">
  <a href="armada.php" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1d6ec5] mb-5 transition-colors">
    <i class="fas fa-arrow-left"></i> Kembali ke Daftar Armada
  </a>

  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="font-bold text-gray-800 text-lg mb-5">Edit Armada</h2>

    <?php if (!empty($error)): ?>
    <div class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
      <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
    </div>
    <?php endif; ?>

    <form method="POST" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Bus <span class="text-red-500">*</span></label>
          <input type="text" name="nama_bus" value="<?= htmlspecialchars($_POST['nama_bus'] ?? $bus['nama_bus']) ?>"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Tipe</label>
          <select name="tipe" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
            <?php foreach (['big_bus'=>'Big Bus','medium_bus'=>'Medium Bus','elf'=>'Elf','hiace'=>'HiAce'] as $val=>$label): ?>
            <option value="<?= $val ?>" <?= ($bus['tipe']===$val)?'selected':'' ?>><?= $label ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Kapasitas (Kursi) <span class="text-red-500">*</span></label>
          <input type="number" name="kapasitas" value="<?= $_POST['kapasitas'] ?? $bus['kapasitas'] ?>"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga Sewa (Rp) <span class="text-red-500">*</span></label>
          <input type="number" name="harga_sewa" value="<?= $_POST['harga_sewa'] ?? $bus['harga_sewa'] ?>"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Path Gambar Utama</label>
        <input type="text" name="gambar_utama" value="<?= htmlspecialchars($_POST['gambar_utama'] ?? $bus['gambar_utama']) ?>"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
        <p class="text-xs text-gray-400 mt-1">Path relatif dari folder <code>frontend/assets/images/</code></p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
        <textarea name="deskripsi" rows="3"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] resize-none"><?= htmlspecialchars($_POST['deskripsi'] ?? $bus['deskripsi']) ?></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Fasilitas (JSON Array)</label>
        <textarea name="fasilitas_json" rows="3"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] resize-none"><?= htmlspecialchars($_POST['fasilitas_json'] ?? $bus['fasilitas_json']) ?></textarea>
      </div>

      <!-- Preview gambar -->
      <?php if ($bus['gambar_utama']): ?>
      <div>
        <p class="text-xs font-semibold text-gray-500 mb-2">Preview Gambar Saat Ini:</p>
        <img src="<?= IMAGE_BASE . htmlspecialchars($bus['gambar_utama']) ?>" alt="preview"
          class="h-28 w-auto rounded-lg object-cover border border-gray-200"
          onerror="this.style.display='none'">
      </div>
      <?php endif; ?>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit"
          class="px-6 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2">
          <i class="fas fa-save"></i> Simpan Perubahan
        </button>
        <a href="armada.php" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-colors">
          Batal
        </a>
      </div>
    </form>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

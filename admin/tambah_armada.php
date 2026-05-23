<?php
require_once 'config.php';
cekLogin();
$pageTitle = 'Tambah Armada';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama       = trim($_POST['nama_bus'] ?? '');
    $tipe       = trim($_POST['tipe'] ?? 'big_bus');
    $kapasitas  = (int)($_POST['kapasitas'] ?? 0);
    $harga      = (int)str_replace(['Rp','.',',',' '], '', $_POST['harga_sewa'] ?? 0);
    $gambar     = trim($_POST['gambar_utama'] ?? '');
    $deskripsi  = trim($_POST['deskripsi'] ?? '');
    $fasilitas  = trim($_POST['fasilitas_json'] ?? '[]');

    if ($nama && $kapasitas && $harga) {
        $stmt = mysqli_prepare($conn,
            "INSERT INTO bus (nama_bus, tipe, kapasitas, harga_sewa, gambar_utama, deskripsi, fasilitas_json)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        mysqli_stmt_bind_param($stmt, 'ssiisss', $nama, $tipe, $kapasitas, $harga, $gambar, $deskripsi, $fasilitas);
        if (mysqli_stmt_execute($stmt)) {
            setFlash('success', 'Armada berhasil ditambahkan!');
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
    <h2 class="font-bold text-gray-800 text-lg mb-5">Form Tambah Armada</h2>

    <?php if (!empty($error)): ?>
    <div class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
      <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
    </div>
    <?php endif; ?>

    <form method="POST" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Bus <span class="text-red-500">*</span></label>
          <input type="text" name="nama_bus" value="<?= htmlspecialchars($_POST['nama_bus'] ?? '') ?>"
            placeholder="contoh: Zahra Ayu"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Tipe</label>
          <select name="tipe" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
            <option value="big_bus" <?= ($_POST['tipe']??'')==='big_bus'?'selected':'' ?>>Big Bus</option>
            <option value="medium_bus" <?= ($_POST['tipe']??'')==='medium_bus'?'selected':'' ?>>Medium Bus</option>
            <option value="elf" <?= ($_POST['tipe']??'')==='elf'?'selected':'' ?>>Elf</option>
            <option value="hiace" <?= ($_POST['tipe']??'')==='hiace'?'selected':'' ?>>HiAce</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Kapasitas (Kursi) <span class="text-red-500">*</span></label>
          <input type="number" name="kapasitas" value="<?= htmlspecialchars($_POST['kapasitas'] ?? '') ?>"
            placeholder="contoh: 45"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga Sewa (Rp) <span class="text-red-500">*</span></label>
          <input type="number" name="harga_sewa" value="<?= htmlspecialchars($_POST['harga_sewa'] ?? '') ?>"
            placeholder="contoh: 4500000"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Path Gambar Utama</label>
        <input type="text" name="gambar_utama" value="<?= htmlspecialchars($_POST['gambar_utama'] ?? '') ?>"
          placeholder="contoh: bus1/bu1.jpeg"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
        <p class="text-xs text-gray-400 mt-1">Path relatif dari folder <code>frontend/assets/images/</code></p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
        <textarea name="deskripsi" rows="3" placeholder="Deskripsi bus..."
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] resize-none"><?= htmlspecialchars($_POST['deskripsi'] ?? '') ?></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Fasilitas (JSON Array)</label>
        <textarea name="fasilitas_json" rows="3"
          placeholder='["AC","Reclining Seat","LCD TV","Karaoke"]'
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] resize-none"><?= htmlspecialchars($_POST['fasilitas_json'] ?? '["Seat 3-2","2 Unit LCD TV","Dispenser","AC","Audio Set","Android Entertainment System","Karaoke + Microphone","Cooler Box","Port USB","Kompartemen Bagasi Atas + Bawah","Lampu Baca"]') ?></textarea>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit"
          class="px-6 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2">
          <i class="fas fa-save"></i> Simpan Armada
        </button>
        <a href="armada.php" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-colors">
          Batal
        </a>
      </div>
    </form>
  </div>
</div>

<?php include 'layout_footer.php'; ?>
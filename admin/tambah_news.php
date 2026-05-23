<?php
require_once 'config.php';
cekLogin();
$pageTitle = 'Tambah Berita';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul   = trim($_POST['judul']  ?? '');
    $konten  = trim($_POST['konten'] ?? '');
    $gambar  = trim($_POST['gambar'] ?? '');
    $status  = in_array($_POST['status'], ['publish','draft']) ? $_POST['status'] : 'publish';
    $slug    = makeSlug($judul);

    if ($judul && $konten) {
        $stmt = mysqli_prepare($conn,
            "INSERT INTO news (judul, slug, konten, gambar, status) VALUES (?, ?, ?, ?, ?)"
        );
        mysqli_stmt_bind_param($stmt, 'sssss', $judul, $slug, $konten, $gambar, $status);
        if (mysqli_stmt_execute($stmt)) {
            setFlash('success', 'Berita berhasil dipublikasikan!');
            header('Location: news.php');
            exit;
        } else {
            $error = 'Gagal menyimpan: ' . mysqli_error($conn);
        }
    } else {
        $error = 'Judul dan konten wajib diisi.';
    }
}

include 'layout_header.php';
?>

<div class="max-w-2xl">
  <a href="news.php" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1d6ec5] mb-5 transition-colors">
    <i class="fas fa-arrow-left"></i> Kembali ke Daftar Berita
  </a>

  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="font-bold text-gray-800 text-lg mb-5">Form Tambah Berita</h2>

    <?php if (!empty($error)): ?>
    <div class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
      <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
    </div>
    <?php endif; ?>

    <form method="POST" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Judul Berita <span class="text-red-500">*</span></label>
        <input type="text" name="judul" value="<?= htmlspecialchars($_POST['judul'] ?? '') ?>"
          placeholder="Masukkan judul berita..."
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]" required>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">URL Gambar</label>
        <input type="text" name="gambar" value="<?= htmlspecialchars($_POST['gambar'] ?? '') ?>"
          placeholder="https://... atau path relatif"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5]">
        <p class="text-xs text-gray-400 mt-1">Kosongkan jika tidak ada gambar.</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Konten <span class="text-red-500">*</span></label>
        <textarea name="konten" rows="8"
          placeholder="Tulis konten berita di sini..."
          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] resize-none" required><?= htmlspecialchars($_POST['konten'] ?? '') ?></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="publish" <?= ($_POST['status']??'publish')==='publish'?'checked':'' ?> class="text-[#1d6ec5]">
            <span class="text-sm text-gray-700">Publish</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="draft" <?= ($_POST['status']??'')==='draft'?'checked':'' ?>>
            <span class="text-sm text-gray-700">Draft</span>
          </label>
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit"
          class="px-6 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2">
          <i class="fas fa-paper-plane"></i> Publish Berita
        </button>
        <a href="news.php" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-colors">
          Batal
        </a>
      </div>
    </form>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

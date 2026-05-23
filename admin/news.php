<?php
require_once 'config.php';
cekLogin();
$pageTitle = 'Kelola Berita';

$news = mysqli_query($conn, "SELECT id, judul, status, created_at FROM news ORDER BY created_at DESC");
$total = mysqli_num_rows($news);
include 'layout_header.php';
?>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
    <div>
      <h2 class="font-bold text-gray-800">Daftar Berita & Info</h2>
      <p class="text-xs text-gray-400 mt-0.5"><?= $total ?> berita tersedia</p>
    </div>
    <a href="tambah_news.php"
      class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white text-sm font-semibold rounded-lg transition-colors">
      <i class="fas fa-plus"></i> Tambah Berita
    </a>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-100">
          <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[55%]">Judul</th>
          <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
          <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <?php while ($n = mysqli_fetch_assoc($news)): ?>
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                <i class="fas fa-newspaper text-yellow-500 text-xs"></i>
              </div>
              <span class="font-semibold text-gray-800"><?= htmlspecialchars($n['judul']) ?></span>
            </div>
          </td>
          <td class="px-4 py-3.5 text-center">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full
              <?= $n['status']==='publish' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' ?>">
              <?= ucfirst($n['status']) ?>
            </span>
          </td>
          <td class="px-4 py-3.5 text-gray-500 text-xs"><?= date('d M Y', strtotime($n['created_at'])) ?></td>
          <td class="px-4 py-3.5">
            <div class="flex items-center justify-center gap-2">
              <a href="edit_news.php?id=<?= $n['id'] ?>"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg transition-colors">
                <i class="fas fa-edit"></i> Edit
              </a>
              <a href="hapus_news.php?id=<?= $n['id'] ?>"
                onclick="return confirm('Hapus berita ini?')"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                <i class="fas fa-trash"></i> Hapus
              </a>
            </div>
          </td>
        </tr>
        <?php endwhile; ?>
        <?php if ($total === 0): ?>
        <tr><td colspan="4" class="px-5 py-10 text-center text-gray-400 text-sm">Belum ada berita.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

<?php
require_once 'config.php';
cekLogin();
$pageTitle = 'Kelola Price List';

$keyword = trim($_GET['q'] ?? '');
if ($keyword) {
    $like = '%' . mysqli_real_escape_string($conn, $keyword) . '%';
    $prices = mysqli_query($conn, "SELECT * FROM price_list WHERE nama_destinasi LIKE '$like' ORDER BY id ASC");
} else {
    $prices = mysqli_query($conn, "SELECT * FROM price_list ORDER BY id ASC");
}
$total = mysqli_num_rows($prices);

include 'layout_header.php';
?>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 class="font-bold text-gray-800">Daftar Harga Sewa</h2>
      <p class="text-xs text-gray-400 mt-0.5"><?= $total ?> destinasi ditemukan</p>
    </div>
    <div class="flex items-center gap-2">
      <form method="GET" class="flex">
        <input type="text" name="q" value="<?= htmlspecialchars($keyword) ?>"
          placeholder="Cari destinasi..."
          class="px-3 py-2 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] w-48">
        <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-200 rounded-r-lg text-sm text-gray-600 transition-colors">
          <i class="fas fa-search"></i>
        </button>
      </form>
      <a href="tambah_harga.php"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#1d6ec5] hover:bg-[#155fa8] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
        <i class="fas fa-plus"></i> Tambah
      </a>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-100">
          <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tujuan</th>
          <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Durasi</th>
          <th class="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">HiAce</th>
          <th class="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Elf</th>
          <th class="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Medium</th>
          <th class="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Big Bus</th>
          <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <?php while ($p = mysqli_fetch_assoc($prices)): ?>
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-5 py-3 font-semibold text-gray-800 max-w-xs">
            <div class="flex items-start gap-2">
              <i class="fas fa-map-marker-alt text-[#1d6ec5] mt-0.5 shrink-0 text-xs"></i>
              <span class="leading-snug"><?= htmlspecialchars($p['nama_destinasi']) ?></span>
            </div>
          </td>
          <td class="px-4 py-3 text-center">
            <span class="bg-blue-100 text-[#1d6ec5] text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
              <?= htmlspecialchars($p['durasi']) ?>
            </span>
          </td>
          <td class="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap"><?= rupiah($p['harga_hiace']) ?></td>
          <td class="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap"><?= rupiah($p['harga_elf']) ?></td>
          <td class="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap"><?= rupiah($p['harga_medium']) ?></td>
          <td class="px-4 py-3 text-right font-bold text-[#0d4a8a] text-xs whitespace-nowrap"><?= rupiah($p['harga_big']) ?></td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-center gap-2">
              <a href="edit_harga.php?id=<?= $p['id'] ?>"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg transition-colors">
                <i class="fas fa-edit"></i> Edit
              </a>
              <a href="hapus_harga.php?id=<?= $p['id'] ?>"
                onclick="return confirm('Hapus destinasi <?= htmlspecialchars($p['nama_destinasi']) ?>?')"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                <i class="fas fa-trash"></i> Hapus
              </a>
            </div>
          </td>
        </tr>
        <?php endwhile; ?>
        <?php if ($total === 0): ?>
        <tr><td colspan="7" class="px-5 py-10 text-center text-gray-400 text-sm">Belum ada data harga.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

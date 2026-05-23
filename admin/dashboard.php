<?php
require_once 'config.php';
cekLogin();
$pageTitle = 'Dashboard';

// Statistik
$total_bus     = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as t FROM bus"))['t'];
$total_harga   = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as t FROM price_list"))['t'];
$total_news    = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as t FROM news"))['t'];
$total_images  = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as t FROM bus_images"))['t'];

// Armada terbaru
$q_bus = mysqli_query($conn, "SELECT id, nama_bus, tipe, kapasitas, harga_sewa FROM bus ORDER BY id DESC LIMIT 5");

// News terbaru
$q_news = mysqli_query($conn, "SELECT id, judul, status, created_at FROM news ORDER BY created_at DESC LIMIT 5");

include 'layout_header.php';
?>

<!-- Stats Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
  <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
      <i class="fas fa-bus text-[#1d6ec5] text-xl"></i>
    </div>
    <div>
      <p class="text-gray-400 text-xs font-medium">Total Armada</p>
      <p class="text-2xl font-extrabold text-gray-800"><?= $total_bus ?></p>
    </div>
  </div>
  <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
      <i class="fas fa-tags text-green-600 text-xl"></i>
    </div>
    <div>
      <p class="text-gray-400 text-xs font-medium">Total Destinasi</p>
      <p class="text-2xl font-extrabold text-gray-800"><?= $total_harga ?></p>
    </div>
  </div>
  <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div class="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
      <i class="fas fa-newspaper text-yellow-600 text-xl"></i>
    </div>
    <div>
      <p class="text-gray-400 text-xs font-medium">Total Berita</p>
      <p class="text-2xl font-extrabold text-gray-800"><?= $total_news ?></p>
    </div>
  </div>
  <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
      <i class="fas fa-images text-purple-600 text-xl"></i>
    </div>
    <div>
      <p class="text-gray-400 text-xs font-medium">Foto Fasilitas</p>
      <p class="text-2xl font-extrabold text-gray-800"><?= $total_images ?></p>
    </div>
  </div>
</div>

<!-- 2 Kolom: Armada + Berita -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

  <!-- Armada Terbaru -->
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h2 class="font-bold text-gray-800 text-sm">Armada Bus</h2>
      <a href="armada.php" class="text-xs text-[#1d6ec5] hover:underline">Lihat Semua →</a>
    </div>
    <div class="divide-y divide-gray-50">
      <?php while ($bus = mysqli_fetch_assoc($q_bus)): ?>
      <div class="px-5 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <i class="fas fa-bus text-[#1d6ec5] text-sm"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800"><?= htmlspecialchars($bus['nama_bus']) ?></p>
            <p class="text-xs text-gray-400"><?= $bus['kapasitas'] ?> Kursi • <?= ucfirst(str_replace('_',' ',$bus['tipe'])) ?></p>
          </div>
        </div>
        <span class="text-xs font-bold text-[#1d6ec5]"><?= rupiah($bus['harga_sewa']) ?></span>
      </div>
      <?php endwhile; ?>
      <?php if ($total_bus == 0): ?>
      <p class="px-5 py-6 text-sm text-gray-400 text-center">Belum ada data armada.</p>
      <?php endif; ?>
    </div>
  </div>

  <!-- Berita Terbaru -->
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h2 class="font-bold text-gray-800 text-sm">Berita Terbaru</h2>
      <a href="news.php" class="text-xs text-[#1d6ec5] hover:underline">Lihat Semua →</a>
    </div>
    <div class="divide-y divide-gray-50">
      <?php while ($n = mysqli_fetch_assoc($q_news)): ?>
      <div class="px-5 py-3.5 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
            <i class="fas fa-newspaper text-yellow-500 text-sm"></i>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate"><?= htmlspecialchars($n['judul']) ?></p>
            <p class="text-xs text-gray-400"><?= date('d M Y', strtotime($n['created_at'])) ?></p>
          </div>
        </div>
        <span class="text-xs font-bold px-2 py-0.5 rounded-full shrink-0
          <?= $n['status']==='publish' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' ?>">
          <?= ucfirst($n['status']) ?>
        </span>
      </div>
      <?php endwhile; ?>
      <?php if ($total_news == 0): ?>
      <p class="px-5 py-6 text-sm text-gray-400 text-center">Belum ada berita.</p>
      <?php endif; ?>
    </div>
  </div>

</div>

<!-- Quick Actions -->
<div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
  <h2 class="font-bold text-gray-800 text-sm mb-4">Aksi Cepat</h2>
  <div class="flex flex-wrap gap-3">
    <a href="tambah_armada.php" class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white text-sm font-semibold rounded-lg transition-colors">
      <i class="fas fa-plus"></i> Tambah Armada
    </a>
    <a href="tambah_harga.php" class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">
      <i class="fas fa-plus"></i> Tambah Harga
    </a>
    <a href="tambah_news.php" class="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg transition-colors">
      <i class="fas fa-plus"></i> Tambah Berita
    </a>
    <a href="<?= BASE_URL ?>" target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
      <i class="fas fa-globe"></i> Lihat Website
    </a>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

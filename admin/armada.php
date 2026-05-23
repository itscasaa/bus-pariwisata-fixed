<?php
require_once 'config.php';
cekLogin();
$pageTitle = 'Kelola Armada';

$buses = mysqli_query($conn, "SELECT id, nama_bus, tipe, kapasitas, harga_sewa, gambar_utama FROM bus ORDER BY id ASC");
include 'layout_header.php';
?>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
    <div>
      <h2 class="font-bold text-gray-800">Daftar Armada Bus</h2>
      <p class="text-xs text-gray-400 mt-0.5">Kelola data bus dan fasilitas</p>
    </div>
    <a href="tambah_armada.php"
      class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white text-sm font-semibold rounded-lg transition-colors">
      <i class="fas fa-plus"></i> Tambah Armada
    </a>
  </div>

  <!-- Tabel -->
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-100">
          <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bus</th>
          <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipe</th>
          <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Kapasitas</th>
          <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga Sewa</th>
          <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <?php while ($bus = mysqli_fetch_assoc($buses)): ?>
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-3">
              <img src="<?= IMAGE_BASE . htmlspecialchars($bus['gambar_utama']) ?>"
                   alt="<?= htmlspecialchars($bus['nama_bus']) ?>"
                   class="w-12 h-10 object-cover rounded-lg bg-gray-100"
                   onerror="this.src='https://placehold.co/48x40?text=Bus'">
              <span class="font-semibold text-gray-800"><?= htmlspecialchars($bus['nama_bus']) ?></span>
            </div>
          </td>
          <td class="px-4 py-3.5">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              <?= $bus['tipe']==='big_bus' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700' ?>">
              <?= ucwords(str_replace('_',' ', $bus['tipe'])) ?>
            </span>
          </td>
          <td class="px-4 py-3.5 text-center text-gray-700 font-medium"><?= $bus['kapasitas'] ?> Kursi</td>
          <td class="px-4 py-3.5 font-semibold text-[#0d4a8a]"><?= rupiah($bus['harga_sewa']) ?></td>
          <td class="px-4 py-3.5">
            <div class="flex items-center justify-center gap-2">
              <a href="edit_armada.php?id=<?= $bus['id'] ?>"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg transition-colors">
                <i class="fas fa-edit"></i> Edit
              </a>
              <a href="hapus_armada.php?id=<?= $bus['id'] ?>"
                onclick="return confirm('Yakin hapus bus <?= htmlspecialchars($bus['nama_bus']) ?>?')"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                <i class="fas fa-trash"></i> Hapus
              </a>
            </div>
          </td>
        </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

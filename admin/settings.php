<?php
/**
 * Admin: Pengaturan Website
 * Mengelola Maintenance Mode
 */
require_once 'config.php';
cekLogin();
$pageTitle = 'Pengaturan Web';

// Ensure table exists & seed defaults via self-healing
$create_query = "CREATE TABLE IF NOT EXISTS settings (
    setting_key   VARCHAR(50)  NOT NULL PRIMARY KEY,
    setting_value TEXT         NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
mysqli_query($conn, $create_query);

$defaults = [
    'maintenance_mode' => '0',
    'maintenance_message' => 'Website sedang dalam pemeliharaan berkala untuk meningkatkan layanan kami. Silakan hubungi kami via WhatsApp untuk info pemesanan.'
];

foreach ($defaults as $key => $val) {
    $stmt = mysqli_prepare($conn, "SELECT 1 FROM settings WHERE setting_key = ?");
    mysqli_stmt_bind_param($stmt, 's', $key);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    if (mysqli_stmt_num_rows($stmt) === 0) {
        $inst = mysqli_prepare($conn, "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)");
        mysqli_stmt_bind_param($inst, 'ss', $key, $val);
        mysqli_stmt_execute($inst);
        mysqli_stmt_close($inst);
    }
    mysqli_stmt_close($stmt);
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mode = isset($_POST['maintenance_mode']) ? '1' : '0';
    $message = trim($_POST['maintenance_message'] ?? '');

    // Update maintenance mode
    $stmt1 = mysqli_prepare($conn, "UPDATE settings SET setting_value = ? WHERE setting_key = 'maintenance_mode'");
    mysqli_stmt_bind_param($stmt1, 's', $mode);
    $ok1 = mysqli_execute($stmt1);
    mysqli_stmt_close($stmt1);

    // Update maintenance message
    $stmt2 = mysqli_prepare($conn, "UPDATE settings SET setting_value = ? WHERE setting_key = 'maintenance_message'");
    mysqli_stmt_bind_param($stmt2, 's', $message);
    $ok2 = mysqli_execute($stmt2);
    mysqli_stmt_close($stmt2);

    if ($ok1 && $ok2) {
        setFlash('success', 'Pengaturan website berhasil diperbarui!');
    } else {
        setFlash('error', 'Gagal memperbarui pengaturan.');
    }

    header('Location: settings.php');
    exit;
}

// Load current settings
$result = mysqli_query($conn, "SELECT setting_key, setting_value FROM settings");
$settings = [];
while ($row = mysqli_fetch_assoc($result)) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

$maintenance_mode = (int)($settings['maintenance_mode'] ?? 0) === 1;
$maintenance_message = (string)($settings['maintenance_message'] ?? '');

include 'layout_header.php';
?>

<div class="max-w-3xl">
  <!-- Status Banner -->
  <div class="mb-6 p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 shadow-sm
    <?= $maintenance_mode 
      ? 'bg-amber-50 border-amber-200 text-amber-800' 
      : 'bg-green-50 border-green-200 text-green-800' ?>">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm
        <?= $maintenance_mode ? 'bg-amber-100' : 'bg-green-100' ?>">
        <i class="fas <?= $maintenance_mode ? 'fa-tools text-amber-600' : 'fa-check text-green-600' ?> text-xl"></i>
      </div>
      <div>
        <h3 class="font-extrabold text-sm tracking-wide uppercase">Status Website Utama</h3>
        <p class="text-xs font-semibold mt-0.5 opacity-85">
          <?= $maintenance_mode 
            ? 'SEDANG DALAM PEMELIHARAAN (Website Utama Ditutup)' 
            : 'ONLINE (Website Utama Dapat Diakses Publik)' ?>
        </p>
      </div>
    </div>
    <span class="text-xs font-bold px-3 py-1 rounded-full shrink-0 shadow-sm
      <?= $maintenance_mode ? 'bg-amber-200 text-amber-900' : 'bg-green-200 text-green-900' ?>">
      <?= $maintenance_mode ? 'Maintenance Active' : 'Live' ?>
    </span>
  </div>

  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
      <div>
        <h2 class="font-bold text-gray-800 text-lg">Konfigurasi Pemeliharaan Website</h2>
        <p class="text-gray-400 text-xs mt-1">Kelola mode pemeliharaan (maintenance) untuk website utama Mafina Trans.</p>
      </div>
    </div>

    <form method="POST" class="space-y-6">
      <!-- Maintenance Mode Switch -->
      <div class="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <div class="flex-1">
          <label for="maintenance_mode" class="block font-bold text-gray-800 text-sm cursor-pointer mb-0.5">
            Aktifkan Maintenance Mode
          </label>
          <p class="text-gray-400 text-xs leading-relaxed">
            Jika diaktifkan, pengunjung website utama akan dialihkan ke halaman pemberitahuan pemeliharaan. Anda tetap dapat mengakses halaman admin ini.
          </p>
        </div>
        <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in mt-1">
          <input type="checkbox" name="maintenance_mode" id="maintenance_mode" value="1"
            class="sr-only peer" <?= $maintenance_mode ? 'checked' : '' ?>>
          <label for="maintenance_mode"
            class="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 
            peer-checked:bg-[#1d6ec5] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white 
            after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
            peer-checked:after:translate-x-full peer-checked:after:border-white">
          </label>
        </div>
      </div>

      <!-- Maintenance Message Textarea -->
      <div class="space-y-2">
        <label for="maintenance_message" class="block text-sm font-semibold text-gray-700">
          Pesan Pemeliharaan <span class="text-red-500">*</span>
        </label>
        <textarea name="maintenance_message" id="maintenance_message" rows="4" required
          placeholder="Tulis alasan pemeliharaan atau info kontak alternatif..."
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] focus:border-transparent resize-none leading-relaxed transition-all duration-200"><?= htmlspecialchars($maintenance_message) ?></textarea>
        <p class="text-xs text-gray-400 leading-normal">
          Pesan ini akan ditampilkan secara langsung di website utama saat mode pemeliharaan aktif. Anda dapat menambahkan info estimasi selesai atau instruksi kontak WhatsApp.
        </p>
      </div>

      <!-- Submit Buttons -->
      <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button type="submit"
          class="px-6 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md">
          <i class="fas fa-save"></i> Simpan Perubahan
        </button>
        <a href="dashboard.php"
          class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all duration-200">
          Batal
        </a>
      </div>
    </form>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

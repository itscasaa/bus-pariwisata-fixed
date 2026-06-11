<?php
/**
 * Admin: Kelola Paket Wisata
 * Menampilkan, tambah, edit, hapus paket wisata / destinasi
 */
require_once 'config.php';
cekLogin();
$pageTitle = 'Kelola Paket Wisata';

// ── Handle POST actions ───────────────────────────────────────
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // ── TAMBAH ──────────────────────────────────────────────────
    if ($action === 'tambah') {
        $judul    = trim($_POST['judul']    ?? '');
        $kategori = trim($_POST['kategori'] ?? '');
        $durasi   = trim($_POST['durasi']   ?? '');
        $harga    = (int)($_POST['harga']   ?? 0);
        $deskripsi= trim($_POST['deskripsi']?? '');
        $gambar   = trim($_POST['gambar']   ?? '');
        $status   = in_array($_POST['status'] ?? '', ['aktif','nonaktif']) ? $_POST['status'] : 'aktif';
        $badge    = trim($_POST['badge']    ?? '') ?: 'PAKET ' . strtoupper($kategori);
        $urutan   = (int)($_POST['urutan']  ?? 0);

        if (!$judul || !$kategori || !$durasi) {
            $error = 'Field judul, kategori, dan durasi wajib diisi.';
        } else {
            if ($urutan === 0) {
                $r      = mysqli_query($conn, "SELECT COALESCE(MAX(urutan),0)+1 AS m FROM paket_wisata");
                $urutan = (int)mysqli_fetch_assoc($r)['m'];
            }
            $stmt = mysqli_prepare($conn,
                "INSERT INTO paket_wisata (judul, badge, kategori, durasi, harga, deskripsi, gambar, status, urutan)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
            );
            mysqli_stmt_bind_param($stmt, 'ssssisssi',
                $judul, $badge, $kategori, $durasi, $harga, $deskripsi, $gambar, $status, $urutan
            );
            if (mysqli_stmt_execute($stmt)) {
                setFlash('success', "Paket \"$judul\" berhasil ditambahkan.");
                header('Location: paket_wisata.php'); exit;
            } else {
                $error = 'Gagal menyimpan: ' . mysqli_stmt_error($stmt);
            }
            mysqli_stmt_close($stmt);
        }

    // ── EDIT ────────────────────────────────────────────────────
    } elseif ($action === 'edit') {
        $id       = (int)($_POST['id']      ?? 0);
        $judul    = trim($_POST['judul']    ?? '');
        $kategori = trim($_POST['kategori'] ?? '');
        $durasi   = trim($_POST['durasi']   ?? '');
        $harga    = (int)($_POST['harga']   ?? 0);
        $deskripsi= trim($_POST['deskripsi']?? '');
        $gambar   = trim($_POST['gambar']   ?? '');
        $status   = in_array($_POST['status'] ?? '', ['aktif','nonaktif']) ? $_POST['status'] : 'aktif';
        $badge    = trim($_POST['badge']    ?? '') ?: 'PAKET ' . strtoupper($kategori);
        $urutan   = (int)($_POST['urutan']  ?? 0);

        if (!$id || !$judul || !$kategori || !$durasi) {
            $error = 'Data tidak lengkap.';
        } else {
            $stmt = mysqli_prepare($conn,
                "UPDATE paket_wisata SET judul=?, badge=?, kategori=?, durasi=?, harga=?, deskripsi=?, gambar=?, status=?, urutan=?
                 WHERE id=?"
            );
            mysqli_stmt_bind_param($stmt, 'ssssisssii',
                $judul, $badge, $kategori, $durasi, $harga, $deskripsi, $gambar, $status, $urutan, $id
            );
            if (mysqli_stmt_execute($stmt)) {
                setFlash('success', "Paket \"$judul\" berhasil diperbarui.");
                header('Location: paket_wisata.php'); exit;
            } else {
                $error = 'Gagal update: ' . mysqli_stmt_error($stmt);
            }
            mysqli_stmt_close($stmt);
        }

    // ── HAPUS ────────────────────────────────────────────────────
    } elseif ($action === 'hapus') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = mysqli_prepare($conn, "DELETE FROM paket_wisata WHERE id = ?");
            mysqli_stmt_bind_param($stmt, 'i', $id);
            if (mysqli_stmt_execute($stmt)) {
                setFlash('success', 'Paket berhasil dihapus.');
            } else {
                setFlash('error', 'Gagal hapus: ' . mysqli_stmt_error($stmt));
            }
            mysqli_stmt_close($stmt);
        }
        header('Location: paket_wisata.php'); exit;
    }
}

// ── Ambil semua paket ────────────────────────────────────────
$edit_data = null;
$edit_id   = (int)($_GET['edit'] ?? 0);
if ($edit_id > 0) {
    $stmt = mysqli_prepare($conn, "SELECT * FROM paket_wisata WHERE id = ? LIMIT 1");
    mysqli_stmt_bind_param($stmt, 'i', $edit_id);
    mysqli_stmt_execute($stmt);
    $edit_data = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
    mysqli_stmt_close($stmt);
}

$pakets = mysqli_query($conn, "SELECT * FROM paket_wisata ORDER BY urutan ASC, id ASC");

include 'layout_header.php';
?>

<?php if ($error): ?>
<div class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex gap-2 items-center">
  <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
</div>
<?php endif; ?>

<!-- FORM TAMBAH / EDIT -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-5">
  <h2 class="font-bold text-gray-800 text-sm mb-4">
    <?= $edit_data ? '✏️ Edit Paket Wisata' : '➕ Tambah Paket Wisata Baru' ?>
  </h2>
  <form method="POST">
    <input type="hidden" name="action" value="<?= $edit_data ? 'edit' : 'tambah' ?>">
    <?php if ($edit_data): ?>
    <input type="hidden" name="id" value="<?= $edit_data['id'] ?>">
    <?php endif; ?>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Judul -->
      <div class="md:col-span-2">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Judul / Nama Destinasi <span class="text-red-500">*</span></label>
        <input type="text" name="judul" required placeholder="contoh: Bandung"
          value="<?= htmlspecialchars($edit_data['judul'] ?? '') ?>"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <!-- Kategori -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Kategori / Durasi (hari) <span class="text-red-500">*</span></label>
        <select name="kategori" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <?php
          $cats = ['1 Hari','2 Hari','3 Hari','4 Hari','5 Hari','10 Hari','Custom'];
          foreach ($cats as $c):
            $sel = (($edit_data['kategori'] ?? '') === $c) ? 'selected' : '';
          ?>
          <option value="<?= $c ?>" <?= $sel ?>><?= $c ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <!-- Durasi teks -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Keterangan Durasi <span class="text-red-500">*</span></label>
        <input type="text" name="durasi" required placeholder="contoh: 2 Hari 1 Malam"
          value="<?= htmlspecialchars($edit_data['durasi'] ?? '') ?>"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <!-- Harga -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Harga (Rp)</label>
        <input type="number" name="harga" min="0" placeholder="2200000"
          value="<?= $edit_data['harga'] ?? 0 ?>"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <!-- Badge -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Badge (kosongkan untuk auto)</label>
        <input type="text" name="badge" placeholder="contoh: PAKET 1 HARI"
          value="<?= htmlspecialchars($edit_data['badge'] ?? '') ?>"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <!-- Gambar -->
      <div class="md:col-span-2">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Path Gambar</label>
        <input type="text" name="gambar" placeholder="/images/destinasi/bandung.jpeg"
          value="<?= htmlspecialchars($edit_data['gambar'] ?? '') ?>"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
        <p class="text-xs text-gray-400 mt-1">Format: <code>/images/destinasi/nama-file.jpeg</code></p>
      </div>
      <!-- Status & Urutan -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Status</label>
        <select name="status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="aktif"    <?= (($edit_data['status'] ?? 'aktif') === 'aktif')    ? 'selected' : '' ?>>Aktif</option>
          <option value="nonaktif" <?= (($edit_data['status'] ?? '') === 'nonaktif') ? 'selected' : '' ?>>Nonaktif</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Urutan Tampil</label>
        <input type="number" name="urutan" min="0"
          value="<?= $edit_data['urutan'] ?? 0 ?>"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <!-- Deskripsi -->
      <div class="md:col-span-2">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Deskripsi</label>
        <textarea name="deskripsi" rows="3" placeholder="Deskripsi singkat paket wisata..."
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><?= htmlspecialchars($edit_data['deskripsi'] ?? '') ?></textarea>
      </div>
    </div>

    <div class="flex gap-3 mt-4">
      <button type="submit"
        class="px-5 py-2.5 bg-[#1d6ec5] hover:bg-[#155fa8] text-white text-sm font-semibold rounded-lg transition-colors">
        <i class="fas fa-save mr-1"></i> <?= $edit_data ? 'Simpan Perubahan' : 'Tambah Paket' ?>
      </button>
      <?php if ($edit_data): ?>
      <a href="paket_wisata.php"
        class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
        Batal
      </a>
      <?php endif; ?>
    </div>
  </form>
</div>

<!-- TABEL PAKET WISATA -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100">
  <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
    <h2 class="font-bold text-gray-800 text-sm">Daftar Paket Wisata</h2>
    <span class="text-xs text-gray-400"><?= mysqli_num_rows($pakets) ?> paket</span>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
        <tr>
          <th class="px-4 py-3 text-left">No</th>
          <th class="px-4 py-3 text-left">Judul</th>
          <th class="px-4 py-3 text-left">Kategori</th>
          <th class="px-4 py-3 text-left">Durasi</th>
          <th class="px-4 py-3 text-left">Harga</th>
          <th class="px-4 py-3 text-left">Gambar</th>
          <th class="px-4 py-3 text-center">Status</th>
          <th class="px-4 py-3 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <?php $no = 1; while ($p = mysqli_fetch_assoc($pakets)): ?>
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-3 text-gray-400"><?= $no++ ?></td>
          <td class="px-4 py-3 font-semibold text-gray-800"><?= htmlspecialchars($p['judul']) ?></td>
          <td class="px-4 py-3 text-gray-600"><?= htmlspecialchars($p['kategori']) ?></td>
          <td class="px-4 py-3 text-gray-600"><?= htmlspecialchars($p['durasi']) ?></td>
          <td class="px-4 py-3 text-[#1d6ec5] font-semibold"><?= rupiah($p['harga']) ?></td>
          <td class="px-4 py-3 text-gray-400 text-xs truncate max-w-[150px]" title="<?= htmlspecialchars($p['gambar'] ?? '') ?>">
            <?= htmlspecialchars($p['gambar'] ?? '-') ?>
          </td>
          <td class="px-4 py-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold
              <?= $p['status']==='aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' ?>">
              <?= ucfirst($p['status']) ?>
            </span>
          </td>
          <td class="px-4 py-3 text-center">
            <div class="flex items-center justify-center gap-2">
              <a href="paket_wisata.php?edit=<?= $p['id'] ?>"
                class="px-2.5 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold transition-colors">
                <i class="fas fa-edit mr-1"></i>Edit
              </a>
              <form method="POST" onsubmit="return confirm('Hapus paket ini?')">
                <input type="hidden" name="action" value="hapus">
                <input type="hidden" name="id" value="<?= $p['id'] ?>">
                <button type="submit"
                  class="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors">
                  <i class="fas fa-trash mr-1"></i>Hapus
                </button>
              </form>
            </div>
          </td>
        </tr>
        <?php endwhile; ?>
        <?php if (mysqli_num_rows($pakets) === 0): ?>
        <tr><td colspan="8" class="px-4 py-8 text-center text-gray-400 text-sm">Belum ada paket wisata.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include 'layout_footer.php'; ?>

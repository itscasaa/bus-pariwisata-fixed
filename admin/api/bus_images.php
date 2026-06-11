<?php
// ============================================================
// admin/api/bus_images.php
// API Kelola Galeri Foto/Smart Images untuk Armada Bus
// ============================================================

require_once 'auth_helper.php';
require_once '../../config/koneksi.php';

// Verifikasi Token
verifyAdminToken();

if (!isset($conn) || !$conn) {
    sendResponse('error', 'Koneksi database tidak tersedia.', [], 503);
}

// Baca JSON input jika ada
$input = json_decode(file_get_contents('php://input'), true) ?? [];

$action = $_POST['action'] ?? $_GET['action'] ?? $input['action'] ?? '';
$bus_id = (int)($_POST['bus_id'] ?? $_GET['bus_id'] ?? $input['bus_id'] ?? 0);

if (!$bus_id) {
    sendResponse('error', 'ID armada (bus_id) wajib disertakan.');
}

// ── GET: Ambil daftar galeri untuk bus_id ────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = mysqli_prepare($conn, "SELECT id, path, label, tipe_gambar, urutan, is_cover, created_at FROM bus_images WHERE bus_id = ? ORDER BY urutan ASC, id ASC");
        mysqli_stmt_bind_param($stmt, 'i', $bus_id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $images = [];
        while ($row = mysqli_fetch_assoc($result)) {
            // Normalisasi path agar frontend dapat memuat dengan benar
            $row['id'] = (int)$row['id'];
            $row['is_cover'] = (int)$row['is_cover'];
            $row['urutan'] = (int)$row['urutan'];
            
            // Kita gunakan helper normalizeImagePath dari api/buses.php secara internal jika ingin seragam
            // Tapi karena file-nya berbeda folder, kita buat salinan kecil logic normalisasi di sini
            $path = $row['path'];
            $path = str_replace('\\', '/', trim($path));
            $path = preg_replace('#^https?://[^/]+/#', '/', $path);
            $segments = [
                '/frontend/assets/images/', 'frontend/assets/images/',
                '/assets/images/', 'assets/images/',
                '/images/', 'images/'
            ];
            foreach ($segments as $seg) {
                $pos = strpos($path, $seg);
                if ($pos !== false) {
                    $path = substr($path, $pos + strlen($seg));
                    break;
                }
            }
            $row['path'] = '/images/' . ltrim($path, '/');
            
            $images[] = $row;
        }
        mysqli_stmt_close($stmt);
        sendResponse('success', 'Galeri berhasil diambil.', $images);
    } catch (Exception $e) {
        sendResponse('error', 'Gagal memuat galeri: ' . $e->getMessage(), [], 500);
    }
}

// ── POST/PUT/DELETE ACTIONS ──────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (empty($action)) {
        sendResponse('error', 'Action tidak boleh kosong.');
    }
    
    // 1. UPLOAD IMAGE(S)
    if ($action === 'upload') {
        if (!isset($_FILES['images']) && !isset($_FILES['image'])) {
            sendResponse('error', 'Tidak ada file gambar yang diupload.');
        }
        
        $tipe_gambar = $_POST['tipe_gambar'] ?? $_GET['tipe_gambar'] ?? $input['tipe_gambar'] ?? 'other';
        $label = $_POST['label'] ?? $_GET['label'] ?? $input['label'] ?? '';
        
        // Ambit urutan tertinggi saat ini
        $urutan_stmt = mysqli_prepare($conn, "SELECT COALESCE(MAX(urutan), 0) AS max_u FROM bus_images WHERE bus_id = ?");
        mysqli_stmt_bind_param($urutan_stmt, 'i', $bus_id);
        mysqli_stmt_execute($urutan_stmt);
        $urutan_res = mysqli_stmt_get_result($urutan_stmt);
        $urutan_row = mysqli_fetch_assoc($urutan_res);
        $max_urutan = (int)$urutan_row['max_u'];
        mysqli_stmt_close($urutan_stmt);
        
        $uploaded_paths = [];
        
        // Helper normalisasi file uploads array
        if (isset($_FILES['images'])) {
            $files = $_FILES['images'];
            if (is_array($files['name'])) {
                $file_count = count($files['name']);
                for ($i = 0; $i < $file_count; $i++) {
                    if ($files['error'][$i] === UPLOAD_ERR_NO_FILE) {
                        continue;
                    }
                    $single_file = [
                        'name' => $files['name'][$i],
                        'type' => $files['type'][$i],
                        'tmp_name' => $files['tmp_name'][$i],
                        'error' => $files['error'][$i],
                        'size' => $files['size'][$i]
                    ];
                    try {
                        $path = uploadImage($single_file, 'bus/gallery', 'gallery');
                        $uploaded_paths[] = $path;
                    } catch (Exception $e) {
                        sendResponse('error', 'Gagal mengupload file: ' . $e->getMessage());
                    }
                }
            } else {
                try {
                    $path = uploadImage($files, 'bus/gallery', 'gallery');
                    $uploaded_paths[] = $path;
                } catch (Exception $e) {
                    sendResponse('error', 'Gagal mengupload file: ' . $e->getMessage());
                }
            }
        } elseif (isset($_FILES['image'])) {
            try {
                $path = uploadImage($_FILES['image'], 'bus/gallery', 'gallery');
                $uploaded_paths[] = $path;
            } catch (Exception $e) {
                sendResponse('error', 'Gagal mengupload file: ' . $e->getMessage());
            }
        }
        
        if (empty($uploaded_paths)) {
            sendResponse('error', 'Tidak ada gambar valid yang berhasil diupload.');
        }
        
        // Simpan setiap path ke database
        $inserted_count = 0;
        foreach ($uploaded_paths as $idx => $path) {
            $current_urutan = $max_urutan + $idx + 1;
            
            // Cek apakah bus ini sudah punya cover image di bus_images atau gambar_utama di bus
            $cover_check = mysqli_query($conn, "SELECT COUNT(*) as count FROM bus_images WHERE bus_id = $bus_id AND is_cover = 1");
            $cover_row = mysqli_fetch_assoc($cover_check);
            $has_cover = (int)$cover_row['count'] > 0;
            
            $bus_cover_check = mysqli_prepare($conn, "SELECT gambar_utama FROM bus WHERE id = ? LIMIT 1");
            mysqli_stmt_bind_param($bus_cover_check, 'i', $bus_id);
            mysqli_stmt_execute($bus_cover_check);
            $bus_cover_res = mysqli_stmt_get_result($bus_cover_check);
            $bus_cover_row = mysqli_fetch_assoc($bus_cover_res);
            $bus_has_main = !empty($bus_cover_row['gambar_utama']);
            mysqli_stmt_close($bus_cover_check);
            
            // Jika belum punya cover image sama sekali, jadikan gambar pertama ini sebagai cover
            $is_cover = (!$has_cover && !$bus_has_main && $inserted_count === 0) ? 1 : 0;
            
            $stmt = mysqli_prepare($conn, "INSERT INTO bus_images (bus_id, path, label, tipe_gambar, urutan, is_cover) VALUES (?, ?, ?, ?, ?, ?)");
            mysqli_stmt_bind_param($stmt, 'isssii', $bus_id, $path, $label, $tipe_gambar, $current_urutan, $is_cover);
            
            if (mysqli_stmt_execute($stmt)) {
                $inserted_count++;
                
                // Jika dijadikan cover, update juga kolom gambar_utama di tabel bus
                if ($is_cover === 1) {
                    $update_bus = mysqli_prepare($conn, "UPDATE bus SET gambar_utama = ? WHERE id = ?");
                    mysqli_stmt_bind_param($update_bus, 'si', $path, $bus_id);
                    mysqli_stmt_execute($update_bus);
                    mysqli_stmt_close($update_bus);
                }
            }
            mysqli_stmt_close($stmt);
        }
        
        sendResponse('success', "$inserted_count gambar berhasil ditambahkan ke galeri.");
    }
    
    // 2. SET COVER IMAGE
    if ($action === 'set_cover') {
        $image_id = (int)($_POST['image_id'] ?? $input['image_id'] ?? 0);
        if (!$image_id) {
            sendResponse('error', 'ID Gambar (image_id) wajib diisi.');
        }
        
        // Ambil info gambar dulu untuk validasi bus_id dan path
        $stmt = mysqli_prepare($conn, "SELECT path FROM bus_images WHERE id = ? AND bus_id = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, 'ii', $image_id, $bus_id);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $image = mysqli_fetch_assoc($res);
        mysqli_stmt_close($stmt);
        
        if (!$image) {
            sendResponse('error', 'Gambar tidak ditemukan atau bukan milik armada ini.');
        }
        
        // Mulai transaksi mini / update manual
        // Set all other images cover flag to 0
        $stmt1 = mysqli_prepare($conn, "UPDATE bus_images SET is_cover = 0 WHERE bus_id = ?");
        mysqli_stmt_bind_param($stmt1, 'i', $bus_id);
        mysqli_stmt_execute($stmt1);
        mysqli_stmt_close($stmt1);
        
        // Set selected image cover flag to 1
        $stmt2 = mysqli_prepare($conn, "UPDATE bus_images SET is_cover = 1 WHERE id = ? AND bus_id = ?");
        mysqli_stmt_bind_param($stmt2, 'ii', $image_id, $bus_id);
        mysqli_stmt_execute($stmt2);
        mysqli_stmt_close($stmt2);
        
        // Update gambar_utama di tabel bus
        $stmt3 = mysqli_prepare($conn, "UPDATE bus SET gambar_utama = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt3, 'si', $image['path'], $bus_id);
        mysqli_stmt_execute($stmt3);
        mysqli_stmt_close($stmt3);
        
        sendResponse('success', 'Gambar cover armada berhasil diperbarui.');
    }
    
    // 3. DELETE IMAGE
    if ($action === 'delete') {
        $image_id = (int)($_POST['image_id'] ?? $input['image_id'] ?? 0);
        if (!$image_id) {
            sendResponse('error', 'ID Gambar (image_id) wajib diisi.');
        }
        
        // Ambil info gambar
        $stmt = mysqli_prepare($conn, "SELECT path, is_cover FROM bus_images WHERE id = ? AND bus_id = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, 'ii', $image_id, $bus_id);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $image = mysqli_fetch_assoc($res);
        mysqli_stmt_close($stmt);
        
        if (!$image) {
            sendResponse('error', 'Gambar tidak ditemukan.');
        }
        
        // Cek apakah gambar yang dihapus merupakan cover
        if ((int)$image['is_cover'] === 1) {
            sendResponse('error', 'Gambar cover aktif tidak boleh dihapus. Silakan tetapkan gambar lain sebagai cover terlebih dahulu.');
        }
        
        // Cek juga di tabel bus
        $bus_stmt = mysqli_prepare($conn, "SELECT gambar_utama FROM bus WHERE id = ? LIMIT 1");
        mysqli_stmt_bind_param($bus_stmt, 'i', $bus_id);
        mysqli_stmt_execute($bus_stmt);
        $bus_res = mysqli_stmt_get_result($bus_stmt);
        $bus_row = mysqli_fetch_assoc($bus_res);
        mysqli_stmt_close($bus_stmt);
        
        if ($bus_row && $bus_row['gambar_utama'] === $image['path']) {
            sendResponse('error', 'Gambar cover utama armada tidak boleh dihapus. Silakan tetapkan gambar lain sebagai cover terlebih dahulu.');
        }
        
        // Hapus dari database
        $del_stmt = mysqli_prepare($conn, "DELETE FROM bus_images WHERE id = ? AND bus_id = ?");
        mysqli_stmt_bind_param($del_stmt, 'ii', $image_id, $bus_id);
        $deleted = mysqli_stmt_execute($del_stmt);
        mysqli_stmt_close($del_stmt);
        
        if ($deleted) {
            // Hapus file fisik dari disk
            $path = $image['path'];
            if (strpos($path, '/images/') === 0) {
                $disk_path = '/var/www/bus-pariwisata' . $path;
            } else {
                $disk_path = '/var/www/bus-pariwisata/images/' . $path;
            }
            if (file_exists($disk_path)) {
                @unlink($disk_path);
            }
            sendResponse('success', 'Gambar galeri berhasil dihapus.');
        } else {
            sendResponse('error', 'Gagal menghapus gambar dari database.');
        }
    }
    
    // 4. REORDER IMAGES
    if ($action === 'reorder') {
        $image_ids = $input['image_ids'] ?? [];
        if (!is_array($image_ids) || empty($image_ids)) {
            sendResponse('error', 'Daftar ID Gambar (image_ids) wajib dalam bentuk array.');
        }
        
        $success_count = 0;
        foreach ($image_ids as $index => $id) {
            $stmt = mysqli_prepare($conn, "UPDATE bus_images SET urutan = ? WHERE id = ? AND bus_id = ?");
            $urutan = $index + 1;
            mysqli_stmt_bind_param($stmt, 'iii', $urutan, $id, $bus_id);
            if (mysqli_stmt_execute($stmt)) {
                $success_count++;
            }
            mysqli_stmt_close($stmt);
        }
        
        sendResponse('success', "Urutan $success_count gambar berhasil disimpan.");
    }
    
    // 5. UPDATE IMAGE METADATA (LABEL & CATEGORY)
    if ($action === 'update_metadata') {
        $image_id = (int)($_POST['image_id'] ?? $input['image_id'] ?? 0);
        if (!$image_id) {
            sendResponse('error', 'ID Gambar (image_id) wajib diisi.');
        }
        
        $tipe_gambar = $_POST['tipe_gambar'] ?? $input['tipe_gambar'] ?? 'other';
        $label = $_POST['label'] ?? $input['label'] ?? '';
        
        $stmt = mysqli_prepare($conn, "UPDATE bus_images SET tipe_gambar = ?, label = ? WHERE id = ? AND bus_id = ?");
        mysqli_stmt_bind_param($stmt, 'ssii', $tipe_gambar, $label, $image_id, $bus_id);
        
        if (mysqli_stmt_execute($stmt)) {
            sendResponse('success', 'Informasi gambar berhasil diperbarui.');
        } else {
            sendResponse('error', 'Gagal memperbarui informasi gambar.');
        }
        mysqli_stmt_close($stmt);
    }
    
    sendResponse('error', 'Action tidak valid atau tidak didukung.');
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
?>

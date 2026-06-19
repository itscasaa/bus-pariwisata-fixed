<?php
/**
 * Admin API: CRUD Discount
 *
 * GET    → list semua (termasuk nonaktif)
 * POST   action=tambah  → insert baru
 * POST   action=edit    → update by id
 * POST   action=hapus   → delete by id
 */

require_once 'auth_helper.php';
require_once '../../config/koneksi.php';

// Verifikasi Token
verifyAdminToken();

if (!isset($conn) || !$conn) {
    sendResponse('error', 'Koneksi database tidak tersedia.', [], 503);
}

$method = $_SERVER['REQUEST_METHOD'];
$response = ['status' => 'error', 'message' => '', 'data' => []];

try {
    // ── GET: list semua diskon ───────────────────────────────────────────────
    if ($method === 'GET') {
        $result = mysqli_query($conn,
            "SELECT id, judul, badge, kategori, durasi, deskripsi, gambar, status, urutan FROM paket_wisata ORDER BY urutan ASC, id ASC"
        );
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                'id'        => (int)$row['id'],
                'judul'     => $row['judul'],
                'badge'     => $row['badge'],
                'kategori'  => $row['kategori'] ?? '',
                'durasi'    => $row['durasi'] ?? '',
                'deskripsi' => $row['deskripsi'],
                'gambar'    => $row['gambar'],
                'status'    => $row['status'],
                'urutan'    => (int)$row['urutan'],
            ];
        }
        $response['status'] = 'success';
        $response['data']   = $data;

    // ── POST: tambah / edit / hapus ─────────────────────────────────────────
    } elseif ($method === 'POST') {
        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $action = $body['action'] ?? $_POST['action'] ?? '';

        // ── TAMBAH ──────────────────────────────────────────────────────────
        if ($action === 'tambah') {
            $judul    = trim($_POST['judul']    ?? $body['judul']    ?? '');
            $badge    = trim($_POST['badge']    ?? $body['badge']    ?? '');
            $deskripsi= trim($_POST['deskripsi']?? $body['deskripsi']?? '');
            $gambar   = trim($_POST['gambar']   ?? $body['gambar']   ?? '');
            $status   = in_array($_POST['status'] ?? $body['status'] ?? '', ['aktif','nonaktif']) ? ($_POST['status'] ?? $body['status']) : 'aktif';
            $urutan   = (int)($_POST['urutan']  ?? $body['urutan']   ?? 0);

            // Proses file upload gambar jika ada
            if (isset($_FILES['gambar_file']) && $_FILES['gambar_file']['error'] !== UPLOAD_ERR_NO_FILE) {
                try {
                    $gambar = uploadImage($_FILES['gambar_file'], 'destinasi', 'paket');
                } catch (Exception $e) {
                    $response['message'] = $e->getMessage();
                    echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
                }
            }

            if (!$judul) {
                $response['message'] = 'Field judul wajib diisi.';
                echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
            }

            // Auto urutan jika 0
            if ($urutan === 0) {
                $r = mysqli_query($conn, "SELECT MAX(urutan) as m FROM paket_wisata");
                $urutan = ((int)mysqli_fetch_assoc($r)['m']) + 1;
            }

            $kategori = trim($_POST['kategori'] ?? $body['kategori'] ?? '');
            $durasi   = trim($_POST['durasi']   ?? $body['durasi']   ?? '');
            $harga    = 0;

            $stmt = mysqli_prepare($conn,
                "INSERT INTO paket_wisata (judul, badge, kategori, durasi, harga, deskripsi, gambar, status, urutan)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
            );
            mysqli_stmt_bind_param($stmt, 'ssssisssi',
                $judul, $badge, $kategori, $durasi, $harga, $deskripsi, $gambar, $status, $urutan
            );
            if (!mysqli_stmt_execute($stmt)) throw new Exception(mysqli_stmt_error($stmt));

            $newId = mysqli_insert_id($conn);
            mysqli_stmt_close($stmt);

            $response['status']  = 'success';
            $response['message'] = 'Discount berhasil ditambahkan.';
            $response['data']    = ['id' => $newId];

        // ── EDIT ────────────────────────────────────────────────────────────
        } elseif ($action === 'edit') {
            $id       = (int)($_POST['id'] ?? $body['id'] ?? 0);
            if (!$id) { $response['message'] = 'ID tidak valid.'; echo json_encode($response, JSON_UNESCAPED_UNICODE); exit; }

            $judul    = trim($_POST['judul']    ?? $body['judul']    ?? '');
            $badge    = trim($_POST['badge']    ?? $body['badge']    ?? '');
            $deskripsi= trim($_POST['deskripsi']?? $body['deskripsi']?? '');
            $gambar   = trim($_POST['gambar']   ?? $body['gambar']   ?? '');
            $status   = in_array($_POST['status'] ?? $body['status'] ?? '', ['aktif','nonaktif']) ? ($_POST['status'] ?? $body['status']) : 'aktif';
            $urutan   = (int)($_POST['urutan']  ?? $body['urutan']   ?? 0);

            // Proses file upload gambar jika ada
            if (isset($_FILES['gambar_file']) && $_FILES['gambar_file']['error'] !== UPLOAD_ERR_NO_FILE) {
                try {
                    $gambar = uploadImage($_FILES['gambar_file'], 'destinasi', 'paket');
                } catch (Exception $e) {
                    $response['message'] = $e->getMessage();
                    echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
                }
            }

            $kategori = trim($_POST['kategori'] ?? $body['kategori'] ?? '');
            $durasi   = trim($_POST['durasi']   ?? $body['durasi']   ?? '');
            $harga    = 0;

            $stmt = mysqli_prepare($conn,
                "UPDATE paket_wisata
                 SET judul=?, badge=?, kategori=?, durasi=?, harga=?, deskripsi=?, gambar=?, status=?, urutan=?
                 WHERE id=?"
            );
            mysqli_stmt_bind_param($stmt, 'ssssisssii',
                $judul, $badge, $kategori, $durasi, $harga, $deskripsi, $gambar, $status, $urutan, $id
            );
            if (!mysqli_stmt_execute($stmt)) throw new Exception(mysqli_stmt_error($stmt));
            mysqli_stmt_close($stmt);

            $response['status']  = 'success';
            $response['message'] = 'Discount berhasil diperbarui.';

        // ── HAPUS ────────────────────────────────────────────────────────────
        } elseif ($action === 'hapus') {
            $id = (int)($_POST['id'] ?? $body['id'] ?? 0);
            if (!$id) { $response['message'] = 'ID tidak valid.'; echo json_encode($response, JSON_UNESCAPED_UNICODE); exit; }

            $stmt = mysqli_prepare($conn, "DELETE FROM paket_wisata WHERE id = ?");
            mysqli_stmt_bind_param($stmt, 'i', $id);
            if (!mysqli_stmt_execute($stmt)) throw new Exception(mysqli_stmt_error($stmt));
            mysqli_stmt_close($stmt);

            $response['status']  = 'success';
            $response['message'] = 'Discount berhasil dihapus.';

        } else {
            $response['message'] = 'Action tidak dikenal.';
        }

    } else {
        http_response_code(405);
        $response['message'] = 'Method not allowed.';
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Internal server error: ' . $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
if (isset($conn) && $conn) mysqli_close($conn);
?>

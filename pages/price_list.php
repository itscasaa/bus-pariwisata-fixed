<?php 
// 1. Koneksi ke folder config
include_once'../config/koneksi.php'; 

// Cek variabel koneksi ($koneksi atau $conn)
$db = isset($koneksi) ? $koneksi : (isset($conn) ? $conn : null);

if (!$db) {
    die("Koneksi Error: Variabel database tidak ditemukan di config/koneksi.php");
}

// Fitur Pencarian
$keyword = "";
if (isset($_POST['cari'])) {
    $keyword = mysqli_real_escape_string($db, $_POST['keyword']);
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Price List - Mafina Trans</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
   <style>
        :root {
            --primary-navy: #1a2226; /* Warna khas sidebar/navbar AdminLTE */
            --accent-orange: #f39c12; /* Warna orange Mafina Trans */
            --dark-red: #c0392b;
        }

        body { 
            font-family: 'Poppins', sans-serif; 
            background-color: #f4f6f9;
            /* UBAH BAGIAN INI: Hilangkan padding-top 70px dan reset margin bawaan browser */
            margin: 0;
            padding-top: 0;
        }

        /* Styling Section Pencarian mirip Beranda */
        .bg-search-custom { 
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('../assets/img/bus-bg.jpg'); 
            background-color: var(--primary-navy); 
            background-size: cover;
            background-position: center;
            padding: 60px 0; 
            color: white; 
            text-align: center; 
        }

        /* ... sisa kode CSS kamu ke bawah tetap sama ... */

        .text-orange { color: var(--accent-orange) !important; }
        
        .btn-orange { 
            background-color: var(--accent-orange); 
            color: white; 
            font-weight: 600;
            border: none;
        }

        .btn-orange:hover { 
            background-color: #e67e22; 
            color: white; 
        }

        .btn-dark-search { 
            background-color: #222d32; 
            color: white; 
            border: none;
            padding: 10px 30px; 
            transition: 0.3s;
        }

        .btn-dark-search:hover { background-color: #000; color: var(--accent-orange); }

        /* Styling Tabel agar matching dengan Kontak/Beranda */
        .table thead {
            background-color: var(--primary-navy);
            color: #fff;
        }

        .card {
            border-radius: 10px;
            overflow: hidden;
        }

        .input-group-text {
            background-color: var(--accent-orange);
            color: white;
            border: none;
        }
    </style>
</head>
<body>

<?php include_once'../layout/navbar.php'; ?>

<div class="bg-search-custom">
    <div class="container">
        <h2 class="fw-bold mb-2">TEMUKAN PERJALANAN TERBAIK ANDA</h2>
        <p class="mb-4">Cek daftar harga sewa bus pariwisata sesuai destinasi pilihan Anda.</p>
        
        <form action="" method="POST" class="mt-4">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="input-group input-group-lg shadow-lg">
                        <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                        <input type="text" name="keyword" class="form-control" placeholder="Masukan Kota Tujuan wisata" value="<?= htmlspecialchars($keyword); ?>">
                        <button class="btn btn-dark-search fw-bold" type="submit" name="cari">CARI HARGA</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="container py-5">
    <div class="text-center mb-5">
        <h3 class="fw-bold">DAFTAR HARGA <span class="text-orange">MAFINA TRANS</span></h3>
        <hr class="mx-auto" style="width: 80px; height: 3px; background-color: var(--accent-orange); opacity: 1;">
    </div>

    <div class="card shadow border-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="text-center">
                    <tr>
                        <th rowspan="2" class="py-3">TUJUAN WISATA</th>
                        <th colspan="4">HARGA PER JENIS ARMADA (IDR)</th>
                        <th rowspan="2">OPSI</th>
                    </tr>
                    <tr>
                        <th>HIACE</th>
                        <th>ELF</th>
                        <th>MEDIUM BUS</th>
                        <th>BIG BUS</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $sql = "SELECT * FROM price_list";
                    if ($keyword != "") {
                        $sql .= " WHERE nama_destinasi LIKE '%$keyword%'";
                    }
                    $sql .= " ORDER BY nama_destinasi ASC";
                    
                    $query = mysqli_query($db, $sql);
                    
                    if ($query && mysqli_num_rows($query) > 0) {
                        while ($row = mysqli_fetch_array($query)) {
                    ?>
                    <tr>
                        <td class="fw-bold ps-4">
                            <i class="bi bi-map text-orange me-2"></i>
                            <?= htmlspecialchars($row['nama_destinasi']); ?>
                        </td>
                        <td class="text-center">Rp <?= number_format($row['harga_hiace'], 0, ',', '.'); ?></td>
                        <td class="text-center">Rp <?= number_format($row['harga_elf'], 0, ',', '.'); ?></td>
                        <td class="text-center">Rp <?= number_format($row['harga_medium'], 0, ',', '.'); ?></td>
                        <td class="text-center">Rp <?= number_format($row['harga_big'], 0, ',', '.'); ?></td>
                        <td class="text-center">
                            <a href="booking.php?id=<?= $row['id']; ?>" class="btn btn-sm btn-orange px-3">Pesan Sekarang</a>
                        </td>
                    </tr>
                    <?php 
                        } 
                    } else { 
                    ?>
                    <tr>
                        <td colspan="6" class="text-center py-5">
                            <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" width="80" class="mb-3 opacity-50"><br>
                            <span class="text-muted">Data destinasi "<b><?= htmlspecialchars($keyword); ?></b>" tidak ditemukan.</span>
                        </td>
                    </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php include_once'../layout/footer.php'; ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
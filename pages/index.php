<?php 
include_once '../config/koneksi.php';
include_once '../layout/navbar.php'; 
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Surya Tour Trans - Sewa Bus Pariwisata & Paket Wisata</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../assets/css/style.css">
    
    <style>
        body { font-family: 'Poppins', sans-serif; }
        .hero-section {
            /* Perbaikan Path Gambar Background */
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('../public/images/bus3.jpeg');
            background-size: cover;
            background-position: center;
            min-height: 500px;
            display: flex;
            align-items: center;
            color: white;
        }
        .card-img-top {
            height: 200px;
            object-fit: cover;
        }
        .navbar-brand { font-weight: 700; letter-spacing: 1px; }
    </style>
</head>
<body>

<header class="hero-section">
    <div class="container text-center">
        <h1 class="display-3 fw-bold">Perjalanan Nyaman,<br>Harga Aman</h1>
        <p class="lead mb-4">Solusi transportasi bus pariwisata terbaik untuk perjalanan wisata, ziarah, dan instansi Anda.</p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a href="armada.php" class="btn btn-warning btn-lg px-4 gap-3 fw-bold">Pesan Bus Sekarang</a>
            <a href="kontak.php" class="btn btn-outline-light btn-lg px-4">Hubungi Kami</a>
        </div>
    </div>
</header>

<div class="container py-5">
    <div class="row text-center mb-5">
        <div class="col">
            <h2 class="fw-bold">Armada Pilihan Kami</h2>
            <p class="text-muted">Berbagai tipe bus siap mengantar perjalanan Anda</p>
            <hr class="mx-auto" style="width: 100px; border: 2px solid #ffc107;">
        </div>
    </div>

    <div class="row">
        <?php
        // Mengambil data bus dari database
        $query = mysqli_query($conn, "SELECT * FROM bus ORDER BY id DESC LIMIT 3");

        if (!$query) {
            echo "<div class='alert alert-danger'>Kesalahan Database: " . mysqli_error($conn) . "</div>";
        } elseif (mysqli_num_rows($query) == 0) {
            echo "<div class='col-12 text-center'><p class='alert alert-info'>Belum ada data armada bus yang tersedia.</p></div>";
        } else {
            while ($data = mysqli_fetch_array($query)) {
        ?>
        <div class="col-md-4">
            <div class="card shadow border-0 mb-4">
                <img src="../public/images/bus2.jpeg/<?php echo !empty($data['gambar']) ? $data['gambar'] : 'default-bus.jpg'; ?>" 
                     class="card-img-top" alt="<?php echo $data['nama_bus']; ?>">
                <div class="card-body">
                    <h5 class="card-title fw-bold"><?php echo $data['nama_bus']; ?></h5>
                    <p class="card-text text-muted small">
                        <i class="bi bi-people-fill"></i> Kapasitas: <?php echo $data['kapasitas']; ?> Kursi
                    </p>
                    <h5 class="text-primary fw-bold">Rp <?php echo number_format($data['harga_sewa'], 0, ',', '.'); ?> <span class="small text-muted" style="font-size: 12px;">/Hari</span></h5>
                    <hr>
                    <a href="detail_bus.php?id=<?php echo $data['id']; ?>" class="btn btn-outline-primary w-100">Lihat Detail</a>
                </div>
            </div>
        </div>
        <?php 
            } 
        } 
        ?>
    </div>
    
    <div class="text-center mt-4">
        <a href="armada.php" class="btn btn-link text-decoration-none">Lihat Semua Armada &rarr;</a>
    </div>
</div>

<footer class="bg-dark text-white py-5 mt-5">
    <div class="container text-center">
        <h4 class="fw-bold text-warning mb-3">SURYA TOUR TRANS</h4>
        <p class="mb-4">Jl. Alamat Kantor Anda No. 123, Kota, Indonesia</p>
        <div class="mb-4">
            <a href="#" class="text-white mx-2 text-decoration-none">Facebook</a>
            <a href="#" class="text-white mx-2 text-decoration-none">Instagram</a>
            <a href="#" class="text-white mx-2 text-decoration-none">WhatsApp</a>
        </div>
        <hr class="bg-secondary">
        <p class="small text-secondary mb-0">&copy; <?php echo date("Y"); ?> Surya Tour Trans. All Rights Reserved.</p>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
<?php 
include_once '../config/koneksi.php';
include_once '../layout/navbar.php'; 
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mafina Trans - Kontak Kami</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../assets/css/style.css">
    
    <style>
        body { font-family: 'Poppins', sans-serif; }
        .hero-section {
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('../public/images/bus3.jpeg');
            background-size: cover;
            background-position: center;
            min-height: 500px;
            display: flex;
            align-items: center;
            color: white;
        }
        .navbar-brand { font-weight: 700; letter-spacing: 1px; }

        /* Kartu Kontak */
        .card-kontak {
            background: #ffffff;
            border: none;
            border-radius: 12px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .card-kontak:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
    </style>
</head>
<body>

<!-- Hero Section - Sama persis dengan index.php -->
<header class="hero-section">
    <div class="container text-center">
        <h1 class="display-3 fw-bold">Kontak Kami</h1>
        <p class="lead mb-4">Hubungi kami untuk informasi lebih lanjut tentang layanan bus pariwisata</p>
    </div>
</header>

<div class="container py-5">
    <!-- Section Title -->
    <div class="row text-center mb-5">
        <div class="col">
            <h2 class="fw-bold">Informasi Kontak</h2>
            <p class="text-muted">Kami siap melayani Anda 24 jam</p>
            <hr class="mx-auto" style="width: 100px; border: 2px solid #ffc107;">
        </div>
    </div>

    <!-- Kartu Informasi Kontak -->
    <div class="row g-4 justify-content-center">
        <!-- Phone -->
        <div class="col-md-4">
            <div class="p-4 h-100 card-kontak text-center shadow-sm">
                <i class="bi bi-telephone-fill" style="font-size: 2.5rem; color: #ffc107;"></i>
                <h5 class="fw-bold mt-3 mb-3" style="color: #1a1a1a;">PHONE / WA</h5>
                <p class="mb-1 text-muted">0851-9980-2536</p>
            </div>
        </div>

        <!-- Email -->
        <div class="col-md-4">
            <div class="p-4 h-100 card-kontak text-center shadow-sm">
                <i class="bi bi-envelope-fill" style="font-size: 2.5rem; color: #ffc107;"></i>
                <h5 class="fw-bold mt-3 mb-3" style="color: #1a1a1a;">EMAIL</h5>
                <p class="text-muted">mafinatourtravel@gmail.com</p>
            </div>
        </div>

        <!-- Lokasi -->
        <div class="col-md-4">
            <div class="p-4 h-100 card-kontak text-center shadow-sm">
                <i class="bi bi-geo-alt-fill" style="font-size: 2.5rem; color: #ffc107;"></i>
                <h5 class="fw-bold mt-3 mb-3" style="color: #1a1a1a;">LOKASI</h5>
                <p class="text-muted">Kota Tangerang</p>
            </div>
        </div>
    </div>

    <!-- Form Pesan -->
    <div class="row mt-5 justify-content-center">
        <div class="col-md-8">
            <div class="card shadow border-0 p-5">
                <h4 class="fw-bold mb-4 text-center">KIRIM PESAN</h4>
                <form action="../config/tambah_pesan.php" method="POST">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Nama Lengkap</label>
                            <input type="text" name="nama" class="form-control" placeholder="Masukkan nama" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Email</label>
                            <input type="email" name="email" class="form-control" placeholder="contoh@gmail.com" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Judul Pesan</label>
                        <input type="text" name="judul" class="form-control" placeholder="Contoh: Tanya Sewa Bus" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Pesan Anda</label>
                        <textarea name="pesan" class="form-control" rows="5" placeholder="Tuliskan pesan lengkap..." required></textarea>
                    </div>
                    <div class="text-center">
                        <button type="submit" name="kirim" class="btn btn-warning px-5 py-2 fw-bold">KIRIM PESAN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<footer class="bg-dark text-white py-5 mt-5">
    <div class="container text-center">
        <h4 class="fw-bold text-warning mb-3">MAFINA TRANS</h4>
        <p class="mb-4">Kota Tangerang, Banten</p>
        <div class="mb-4">
            <a href="https://www.instagram.com/mafina.trans" class="text-white mx-2 text-decoration-none" target="_blank">Instagram</a>
            <a href="https://wa.me/6285199802536" class="text-white mx-2 text-decoration-none" target="_blank">WhatsApp</a>
            <a href="https://www.tiktok.com/@mafina.tourtravel" class="text-white mx-2 text-decoration-none" target="_blank">TikTok</a>
        </div>
        <hr class="bg-secondary">
        <p class="small text-secondary mb-0">&copy; <?php echo date("Y"); ?> Mafina Trans. All Rights Reserved.</p>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
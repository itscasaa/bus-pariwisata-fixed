<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Surya Tour Trans</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!-- Google Fonts: Poppins -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
        body { font-family: 'Poppins', sans-serif; }
        
        /* Navbar Utama - Hitam sesuai foto */
        .navbar {
            background-color: #1a1a1a !important;
            padding: 8px 0; /* Lebih rapat ke atas */
        }
        
        /* Logo tetap Kuning Emas */
        .navbar-brand {
            font-weight: 700;
            color: #ffc107 !important;
            font-size: 1.1rem;
            letter-spacing: 0.5px;
        }

        /* Nav Link - Warna Putih & Jarak Rapat */
        .navbar-nav .nav-link {
            color: #ffffff !important; /* Semua menu warna putih sesuai foto */
            font-size: 0.85rem;
            font-weight: 400;
            padding-left: 10px !important; 
            padding-right: 10px !important;
            transition: 0.3s;
            opacity: 0.9;
        }

        /* Hover tetap putih atau sedikit terang */
        .navbar-nav .nav-link:hover {
            opacity: 1;
            color: #ffffff !important;
        }

        /* Menu Aktif (Tanda sedang di halaman tersebut) */
        .navbar-nav .nav-link.active {
            font-weight: 500;
            opacity: 1;
        }

        /* Tombol Login Kuning Kotak */
        .btn-login {
            background-color: #ffc107;
            color: #000 !important;
            font-weight: 600;
            font-size: 0.85rem;
            border-radius: 4px; 
            padding: 5px 18px !important;
            margin-left: 10px;
        }

        .btn-login:hover {
            background-color: #e5ac00;
        }

        /* Menghilangkan border toggler */
        .navbar-toggler { border: none; font-size: 1rem; }
        .navbar-toggler:focus { shadow: none; outline: none; }
    </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
        <!-- Logo -->
        <a class="navbar-brand" href="index.php">SURYA TOUR TRANS</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center">
                <li class="nav-item">
                    <a class="nav-link active" href="index.php">Beranda</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="price_list.php">price list</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="armada.php">Armada</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="paket_wisata.php">Paket Wisata</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="kontak.php">Kontak</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link btn-login" href="login.php">Login</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
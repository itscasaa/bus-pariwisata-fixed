<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #1a1a1a; padding: 10px 0; border-bottom: 3px solid #ffc107; box-shadow: 0 2px 15px rgba(0,0,0,0.3);">
  <div class="container">
    <!-- Brand dengan Logo Baru (logo.png) -->
    <a class="navbar-brand d-flex align-items-center" href="index.php" style="text-transform: uppercase;">
      <img src="../public/images/logo.png" width="42" height="42" class="me-2" style="object-fit: cover; border-radius: 50%; border: 2px solid #ffc107;">
      <strong style="color: #ffc107; font-size: 1.2rem; letter-spacing: 1px;">MAFINA TRANS</strong>
    </a>

    <!-- Toggler -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" style="border-color: #ffc107;">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="menu">
      <ul class="navbar-nav ms-auto align-items-center">
        <li class="nav-item">
          <a class="nav-link" href="index.php" style="color: #ffffff; position: relative; padding: 8px 14px; transition: all 0.3s ease;">Beranda</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="price_list.php" style="color: #ffffff; position: relative; padding: 8px 14px; transition: all 0.3s ease;">Price List</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="data_bus.php" style="color: #ffffff; position: relative; padding: 8px 14px; transition: all 0.3s ease;">Armada</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" style="color: #ffffff; position: relative; padding: 8px 14px; transition: all 0.3s ease;">Paket Wisata</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="kontak.php" style="color: #ffffff; position: relative; padding: 8px 14px; transition: all 0.3s ease;">Kontak</a>
        </li>
        <li class="nav-item ms-lg-2">
          <a href="login.php" class="btn fw-bold" style="background-color: #ffc107; color: #1a1a1a; border: none; border-radius: 25px; padding: 8px 28px; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(255,193,7,0.4);">Login</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<style>
  /* Hover Effect - Underline animasi dari kiri ke kanan */
  .navbar-nav .nav-link::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #ffc107;
    transition: all 0.3s ease;
    transform: translateX(-50%);
    border-radius: 2px;
  }

  .navbar-nav .nav-link:hover::after {
    width: 70%;
  }

  .navbar-nav .nav-link:hover {
    color: #ffc107 !important;
    transform: translateY(-1px);
  }

  /* Active link style */
  .navbar-nav .nav-link.active {
    color: #ffc107 !important;
    font-weight: 600;
  }

  .navbar-nav .nav-link.active::after {
    width: 70%;
  }

  /* Brand hover */
  .navbar-brand:hover {
    opacity: 0.9;
    transform: scale(1.02);
    transition: all 0.3s ease;
  }

  /* Login button hover */
  .btn.fw-bold:hover {
    background-color: #e5ac00 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255,193,7,0.6) !important;
  }

  /* Navbar collapse - menu rapih di mobile */
  @media (max-width: 991.98px) {
    .navbar-nav .nav-link {
      text-align: center;
      padding: 10px 0 !important;
    }
    .navbar-nav .nav-link::after {
      left: 30%;
    }
    .navbar-nav .nav-link:hover::after {
      width: 40%;
    }
    .navbar-nav .nav-link.active::after {
      width: 40%;
    }
    .navbar-nav {
      margin-top: 10px;
    }
    .navbar-nav .nav-item.ms-lg-2 {
      margin-top: 8px;
      text-align: center;
    }
  }
</style>
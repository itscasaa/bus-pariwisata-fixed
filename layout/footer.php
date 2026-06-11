<footer style="background-color: #1a1a1a; color: #ffffff; padding: 60px 0 0 0; font-family: 'Poppins', sans-serif;">
    <div class="container">
        <div class="row g-4 mb-5">
            <div class="col-md-4">
                <h5 class="fw-bold mb-4" style="color: #ffc107;">MAFINA TRANS</h5>
                <p class="text-white-50 small mb-4" style="line-height: 1.8;">
                    Solusi transportasi bus pariwisata terbaik untuk perjalanan wisata, ziarah, dan instansi Anda. Kami mengutamakan kenyamanan dan keamanan di setiap perjalanan.
                </p>
                <div class="d-flex gap-3">
                    <a href="#" class="text-white fs-5"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="text-white fs-5"><i class="bi bi-instagram"></i></a>
                    <a href="#" class="text-white fs-5"><i class="bi bi-twitter"></i></a>
                </div>
            </div>

            <div class="col-md-2 ps-md-5">
                <h6 class="fw-bold mb-4">Navigasi</h6>
                <ul class="list-unstyled small">
                    <li class="mb-2"><a href="index.php" class="text-decoration-none text-white-50">Beranda</a></li>
                    <li class="mb-2"><a href="price_list.php" class="text-decoration-none text-white-50">price list</a></li>
                    <li class="mb-2"><a href="armada.php" class="text-decoration-none text-white-50">Armada</a></li>
                    <li class="mb-2"><a href="paket_wisata.php" class="text-decoration-none text-white-50">Paket Wisata</a></li>
                </ul>
            </div>

            <div class="col-md-2">
                <h6 class="fw-bold mb-4">Support</h6>
                <ul class="list-unstyled small text-white-50">
                    <li class="mb-2">Kerjasama</li>
                    <li class="mb-2">Promo</li>
                    <li class="mb-2">FAQ</li>
                </ul>
            </div>

            <div class="col-md-4">
                <h6 class="fw-bold mb-4">Alamat Kantor</h6>
                <p class="text-white-50 small mb-4">
                    Jl. Kh Much Kup Rt. 09/01 No.03 Kec. Pinang, Kel. Pinang, Kota Tangerang 15145
                </p>
                <div class="p-2 border border-secondary d-inline-block rounded">
                    <small class="d-block text-white-50"><i class="bi bi-bar-chart-fill me-1"></i> Visitors</small>
                    <small class="fw-bold">Total: 4.833</small>
                </div>
            </div>
        </div>
    </div>

    <div style="background-color: #111111; padding: 25px 0; border-top: 1px solid #222;">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start">
                    <small class="text-white-50">&copy; 2026 <strong>Mafina Trans</strong>. All Rights Reserved.</small>
                </div>
                <div class="col-md-6 text-center text-md-end mt-3 mt-md-0">
                    <small class="text-white-50 me-2">Jasa Sewa Bus Pariwisata Terpercaya</small>
                    <a href="#" class="btn btn-light rounded-circle shadow-sm" style="width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center;">
                        <i class="bi bi-chevron-up text-danger"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</footer>

<style>
    .wa-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .wa-card-header {
        background: #25d366;
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .wa-card-body {
        padding: 10px;
        background: #f0f0f0;
    }
    .wa-admin-link {
        display: flex;
        align-items: center;
        background: white;
        padding: 12px;
        margin-bottom: 8px;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: 0.3s;
    }
    .wa-admin-link:hover {
        background: #e6e6e6;
    }
    .wa-admin-link img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 12px;
    }
    .wa-status-dot {
        font-size: 8px;
        color: #25d366;
        vertical-align: middle;
    }
</style>

<div id="wa-popup" style="display: none; position: fixed; bottom: 90px; left: 20px; z-index: 1001; width: 320px;">
    <div class="wa-card">
        <div class="wa-card-header">
            <span class="small fw-bold">Team Kami siap membantu Anda</span>
            <i class="bi bi-x-circle-fill cursor-pointer" onclick="toggleWa()" style="cursor: pointer;"></i>
        </div>
        <div class="wa-card-body">
            <a href="https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20bertanya%20tentang%20sewa%20bus%20pariwisata." target="_blank" class="wa-admin-link">
                <img src="../public/images/logo.png" alt="Admin">
                <div>
                    <div style="font-size: 11px; color: #888888;">Customer Service #1</div>
                    <div class="fw-bold" style="font-size: 14px;">Mafina Trans 01</div>
                    <div style="font-size: 11px;"><i class="bi bi-circle-fill wa-status-dot"></i> Available</div>
                </div>
            </a>
            <a href="https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20bertanya%20tentang%20sewa%20bus%20pariwisata." target="_blank" class="wa-admin-link">
                <img src="../public/images/logo.png" alt="Admin">
                <div>
                    <div style="font-size: 11px; color: #888;">Customer Service #2</div>
                    <div class="fw-bold" style="font-size: 14px;">Mafina Trans 02</div>
                    <div style="font-size: 11px;"><i class="bi bi-circle-fill wa-status-dot"></i> Available</div>
                </div>
            </a>
        </div>
    </div>
</div>

<button onclick="toggleWa()" class="btn btn-success rounded-pill px-4 py-2 shadow-lg" style="position: fixed; bottom: 25px; left: 20px; z-index: 1000; font-weight: bold; border: 2px solid white; background-color: #25d366;">
    <i class="bi bi-whatsapp me-2"></i> Ada yang bisa kami bantu?
</button>

<script>
    function toggleWa() {
        const popup = document.getElementById('wa-popup');
        popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
    }
</script>
<footer style="background-color: #1a2226; color: #ffffff; padding: 60px 0 30px 0; border-top: 3px solid #f39c12;">
    <div class="container">
        <div class="row g-4">
            <div class="col-md-4">
                <h5 class="fw-bold mb-3 text-orange" style="color: #f39c12;">MAFINA TRANS</h5>
                <p class="text-muted" style="color: #b0b8c1 !important; line-height: 1.8;">
                    Solusi transportasi bus pariwisata terbaik untuk perjalanan wisata, ziarah, dan instansi Anda. Kami mengutamakan kenyamanan dan keamanan di setiap perjalanan.
                </p>
            </div>

            <div class="col-md-2">
                <h5 class="fw-bold mb-3 text-white">Navigasi</h5>
                <ul class="list-unstyled links-footer">
                    <li class="mb-2"><a href="index.php" class="text-decoration-none text-muted" style="color: #b0b8c1 !important;">Beranda</a></li>
                    <li class="mb-2"><a href="price_list.php" class="text-decoration-none text-muted" style="color: #b0b8c1 !important;">Price List</a></li>
                    <li class="mb-2"><a href="armada.php" class="text-decoration-none text-muted" style="color: #b0b8c1 !important;">Armada</a></li>
                    <li class="mb-2"><a href="paket_wisata.php" class="text-decoration-none text-muted" style="color: #b0b8c1 !important;">Paket Wisata</a></li>
                </ul>
            </div>

            <div class="col-md-2">
                <h5 class="fw-bold mb-3 text-white">Support</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="#" class="text-decoration-none text-muted" style="color: #b0b8c1 !important;">Kerjasama</a></li>
                    <li class="mb-2"><a href="#" class="text-decoration-none text-muted" style="color: #b0b8c1 !important;">Promo</a></li>
                    <li class="mb-2"><a href="#" class="text-decoration-none text-muted" style="color: #b0b8c1 !important;">FAQ</a></li>
                </ul>
            </div>

            <div class="col-md-4">
                <h5 class="fw-bold mb-3 text-white">Alamat Kantor</h5>
                <p class="text-muted" style="color: #b0b8c1 !important; mb-3">
                    Jl. Kh Much Kup Rt. 09/01 No.03 Kec. Pinang, Kel. Pinang, Kota Tangerang 15145
                </p>
                <div class="p-2 d-inline-block rounded" style="background-color: #222d32; border: 1px solid #34495e;">
                    <small class="text-muted d-block">Visitors</small>
                    <span class="fw-bold text-white">Total: 4.833</span>
                </div>
            </div>
        </div>

        <hr class="mt-5 mb-4" style="background-color: #34495e; opacity: 0.5;">

        <div class="row">
            <div class="col-md-6">
                <p class="text-muted mb-0" style="color: #b0b8c1 !important;">
                    &copy; <?= date('Y'); ?> <strong class="text-white">Mafina Trans</strong>. All Rights Reserved.
                </p>
            </div>
            <div class="col-md-6 text-md-end">
                <p class="text-muted mb-0" style="color: #b0b8c1 !important;">Jasa Sewa Bus Pariwisata Terpercaya</p>
            </div>
        </div>
    </div>
</footer>

<style>
    .wa-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .wa-card-header {
        background: #25d366;
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .wa-card-body {
        padding: 10px;
        background: #f0f0f0;
    }
    .wa-admin-link {
        display: flex;
        align-items: center;
        background: white;
        padding: 12px;
        margin-bottom: 8px;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: 0.3s;
    }
    .wa-admin-link:hover {
        background: #e6e6e6;
    }
    .wa-admin-link img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 12px;
    }
    .wa-status-dot {
        font-size: 8px;
        color: #25d366;
        vertical-align: middle;
    }
</style>

<div id="wa-popup" style="display: none; position: fixed; bottom: 90px; left: 20px; z-index: 1001; width: 320px;">
    <div class="wa-card">
        <div class="wa-card-header">
            <span class="small fw-bold">Team Kami siap membantu Anda</span>
            <i class="bi bi-x-circle-fill cursor-pointer" onclick="toggleWa()" style="cursor: pointer;"></i>
        </div>
        <div class="wa-card-body">
            <a href="https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20bertanya%20tentang%20sewa%20bus%20pariwisata." target="_blank" class="wa-admin-link">
                <img src="../public/images/logo.png" alt="Admin">
                <div>
                    <div style="font-size: 11px; color: #888888;">Customer Service #1</div>
                    <div class="fw-bold" style="font-size: 14px;">Mafina Trans</div>
                    <div style="font-size: 11px;"><i class="bi bi-circle-fill wa-status-dot"></i> Available</div>
                </div>
            </a>
            <a href="https://wa.me/6285199802536?text=Halo%20Mafina%20Trans%2C%20saya%20ingin%20bertanya%20tentang%20sewa%20bus%20pariwisata." target="_blank" class="wa-admin-link">
                <img src="../public/images/logo.png" alt="Admin">
                <div>
                    <div style="font-size: 11px; color: #888;">Customer Service #2</div>
                    <div class="fw-bold" style="font-size: 14px;">Mafina Trans</div>
                    <div style="font-size: 11px;"><i class="bi bi-circle-fill wa-status-dot"></i> Available</div>
                </div>
            </a>
        </div>
    </div>
</div>

<button onclick="toggleWa()" class="btn btn-success rounded-pill px-4 py-2 shadow-lg" style="position: fixed; bottom: 25px; left: 20px; z-index: 1000; font-weight: bold; border: 2px solid white; background-color: #25d366;">
    <i class="bi bi-whatsapp me-2"></i> Ada yang bisa kami bantu?
</button>

<script>
    function toggleWa() {
        const popup = document.getElementById('wa-popup');
        popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
    }
</script>
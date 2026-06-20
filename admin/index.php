<?php
require_once 'config.php';

// Kalau sudah login, langsung ke dashboard
if (isset($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../config/rate_limiter.php';
    checkRateLimit('login', 5, 60);
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username && $password) {
        $stmt = mysqli_prepare($conn, "SELECT id, nama, username, password FROM admin_users WHERE username = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, 's', $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $admin  = mysqli_fetch_assoc($result);

        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_id']   = $admin['id'];
            $_SESSION['admin_nama'] = $admin['nama'];
            $_SESSION['admin_user'] = $admin['username'];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Username atau password salah.';
        }
    } else {
        $error = 'Harap isi username dan password.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Admin — <?= SITE_NAME ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-[#0d2b4a] to-[#1d6ec5] flex items-center justify-center px-4">

  <div class="w-full max-w-md">

    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
        <i class="fas fa-bus text-white text-2xl"></i>
      </div>
      <h1 class="text-white font-extrabold text-2xl"><?= SITE_NAME ?></h1>
      <p class="text-blue-200 text-sm mt-1">Admin Panel</p>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-2xl shadow-2xl p-8">
      <h2 class="text-gray-800 font-bold text-xl mb-1">Selamat Datang</h2>
      <p class="text-gray-400 text-sm mb-6">Silakan login untuk melanjutkan</p>

      <?php if ($error): ?>
      <div class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
        <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
      </div>
      <?php endif; ?>

      <form method="POST">
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
          <div class="relative">
            <i class="fas fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" name="username"
              value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
              placeholder="Masukkan username"
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] focus:border-transparent transition"
              required autofocus>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="password" name="password" id="passwordInput"
              placeholder="Masukkan password"
              class="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1d6ec5] focus:border-transparent transition"
              required>
            <button type="button" onclick="togglePassword()"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <i class="fas fa-eye text-sm" id="eyeIcon"></i>
            </button>
          </div>
        </div>

        <button type="submit"
          class="w-full bg-[#1d6ec5] hover:bg-[#155fa8] text-white font-bold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
      </form>

      <div class="mt-6 pt-5 border-t border-gray-100 text-center">
        <a href="<?= BASE_URL ?>" class="text-[#1d6ec5] text-sm hover:underline">
          <i class="fas fa-arrow-left mr-1"></i> Kembali ke Website
        </a>
      </div>
    </div>

    <p class="text-center text-blue-200/60 text-xs mt-6">
      &copy; <?= date('Y') ?> <?= SITE_NAME ?>. All rights reserved.
    </p>
  </div>

  <script>
    function togglePassword() {
      const input = document.getElementById('passwordInput');
      const icon  = document.getElementById('eyeIcon');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    }
  </script>
</body>
</html>

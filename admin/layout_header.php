<?php
// ============================================================
// Partial: Sidebar + Layout wrapper
// Include di setiap halaman admin setelah cekLogin()
// ============================================================
$current = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $pageTitle ?? 'Admin Panel' ?> — <?= SITE_NAME ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    [x-cloak]{display:none}
    .sidebar-link.active { background:#1d6ec5; color:#fff; }
    .sidebar-link { transition: all .2s; }
    .sidebar-link:hover:not(.active) { background:#e0eeff; color:#1d6ec5; }
  </style>
</head>
<body class="bg-gray-100 min-h-screen flex">

<!-- Sidebar -->
<aside class="w-64 bg-[#0d2b4a] min-h-screen flex flex-col fixed top-0 left-0 z-30 shadow-xl">
  <!-- Logo -->
  <div class="px-6 py-5 border-b border-white/10">
    <p class="text-white font-extrabold text-lg tracking-wide"><?= SITE_NAME ?></p>
    <p class="text-blue-300 text-xs mt-0.5">Admin Panel</p>
  </div>

  <!-- Menu -->
  <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
    <p class="text-blue-400 text-xs font-semibold uppercase px-3 mb-2 tracking-wider">Menu</p>

    <a href="dashboard.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium <?= $current==='dashboard.php'?'active':'' ?>">
      <i class="fas fa-chart-pie w-4 text-center"></i> Dashboard
    </a>

    <a href="armada.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium <?= in_array($current,['armada.php','tambah_armada.php','edit_armada.php'])?'active':'' ?>">
      <i class="fas fa-bus w-4 text-center"></i> Kelola Armada
    </a>

    <a href="paket_wisata.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium <?= $current==='paket_wisata.php'?'active':'' ?>">
      <i class="fas fa-percent w-4 text-center"></i> Kelola Discount
    </a>

    <a href="price_list.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium <?= in_array($current,['price_list.php','tambah_harga.php','edit_harga.php'])?'active':'' ?>">
      <i class="fas fa-tags w-4 text-center"></i> Kelola Price List
    </a>

    <a href="news.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium <?= in_array($current,['news.php','tambah_news.php','edit_news.php'])?'active':'' ?>">
      <i class="fas fa-newspaper w-4 text-center"></i> Kelola Berita
    </a>

    <a href="pesan.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium <?= $current==='pesan.php'?'active':'' ?>">
      <i class="fas fa-envelope w-4 text-center"></i> Pesan Masuk
    </a>

    <div class="border-t border-white/10 my-3"></div>
    <p class="text-blue-400 text-xs font-semibold uppercase px-3 mb-2 tracking-wider">Lainnya</p>

    <a href="settings.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium <?= $current==='settings.php'?'active':'' ?>">
      <i class="fas fa-cog w-4 text-center"></i> Pengaturan Web
    </a>

    <a href="<?= BASE_URL ?>" target="_blank"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 text-sm font-medium">
      <i class="fas fa-globe w-4 text-center"></i> Lihat Website
    </a>

    <a href="logout.php"
       class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-300 text-sm font-medium hover:!bg-red-900/30 hover:!text-red-200">
      <i class="fas fa-sign-out-alt w-4 text-center"></i> Logout
    </a>
  </nav>

  <!-- User info -->
  <div class="px-5 py-4 border-t border-white/10 flex items-center gap-3">
    <div class="w-9 h-9 rounded-full bg-[#1d6ec5] flex items-center justify-center text-white font-bold text-sm shrink-0">
      <?= strtoupper(substr($_SESSION['admin_nama'] ?? 'A', 0, 1)) ?>
    </div>
    <div>
      <p class="text-white text-sm font-semibold leading-tight"><?= htmlspecialchars($_SESSION['admin_nama'] ?? '') ?></p>
      <p class="text-blue-400 text-xs">Administrator</p>
    </div>
  </div>
</aside>

<!-- Main Content -->
<div class="ml-64 flex-1 flex flex-col min-h-screen">

  <!-- Topbar -->
  <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20">
    <h1 class="text-gray-800 font-bold text-lg"><?= $pageTitle ?? 'Dashboard' ?></h1>
    <div class="flex items-center gap-3 text-sm text-gray-500">
      <i class="far fa-clock"></i>
      <?= date('d M Y, H:i') ?> WIB
    </div>
  </header>

  <!-- Flash Message -->
  <?php $flash = getFlash(); if ($flash): ?>
  <div class="mx-6 mt-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2
    <?= $flash['type']==='success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700' ?>">
    <i class="fas <?= $flash['type']==='success' ? 'fa-check-circle' : 'fa-exclamation-circle' ?>"></i>
    <?= htmlspecialchars($flash['msg']) ?>
  </div>
  <?php endif; ?>

  <!-- Page Content -->
  <main class="flex-1 p-6">

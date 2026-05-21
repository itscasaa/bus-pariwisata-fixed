const siteData = {
  // ========== HERO ==========
  hero: {
    title: 'Find Next Place To Visit',
    subtitle: 'Temukan Destinasi Wisata pilihan anda',
    bgImage: '/images/bus4.jpeg',
    destinations: [
      { value: 'bali', label: 'Bali' },
      { value: 'bandung', label: 'Bandung' },
      { value: 'banten', label: 'Banten' },
      { value: 'bogor', label: 'Bogor' },
      { value: 'jakarta', label: 'Jakarta' },
      { value: 'yogyakarta', label: 'Yogyakarta' },
    ],
    durations: [
      { value: '1', label: '1 Day Tour' },
      { value: '2-4', label: '2-4 Days Tour' },
      { value: '5-7', label: '5-7 Days Tour' },
      { value: '7+', label: '7+ Days Tour' },
    ],
  },

  // ========== FEATURES ==========
  features: [
    {
      icon: 'fa-globe',
      title: '100+ Tempat Wisata',
      desc: 'Team kami berpengalaman untuk tempat wisata',
    },
    {
      icon: 'fa-tag',
      title: 'Harga Terbaik',
      desc: 'Harga cocok dalam waktu 48 jam setelah konfirmasi pesanan',
    },
    {
      icon: 'fa-headset',
      title: 'Support Kami',
      desc: 'Kami membantu sebelum, selama dan sesudah perjalanan wisata anda',
    },
  ],

  // ========== DESTINATIONS ==========
  destinations: [
    { name: 'Dieng Yogya', image: '/images/destinasi/dieng-yogya.jpeg', tours: 12 },
    { name: 'Jawa Tengah', image: '/images/destinasi/jawatengah.jpeg', tours: 10 },
    { name: 'Maribaya Bandung', image: '/images/destinasi/maribaya_bandung.jpeg', tours: 15 },
    { name: 'Bromo Batu Malang', image: '/images/destinasi/bromo-batu_malang.jpeg', tours: 8 },
    { name: 'Bali Lombok', image: '/images/destinasi/bali-lombok.jpeg', tours: 20 },
  ],

  // ========== BUS FLEET (fallback static) ==========
  busFleet: [
    { name: 'Zahra Ayu', image: '/images/bus1.jpeg' },
    { name: 'Wong Kudus', image: '/images/bus2.jpeg' },
    { name: 'William', image: '/images/bus3.jpeg' },
    { name: 'White Horse', image: '/images/foto4.jpeg' },
    { name: 'Starbus', image: '/images/foto5.jpeg' },
    { name: 'Blue Star', image: '/images/bus1.jpeg' },
  ],

  // ========== PROMO ==========
  promo: {
    title: 'Diskon Paket Wisata',
    discount: 'Up to 40% Discount!',
    bgColor: '#1d6ec5',
    cta: 'Read More',
    image: '/images/logo.png',
  },

  // ========== TOUR PACKAGES ==========
  tourPackages: [
    {
      badge: 'PAKET 1 HARI',
      title: 'Bandung',
      image: '/images/destinasi/bandung.jpeg',
      price: 'Rp. 2.200.000',
      duration: '1 Hari',
      description: 'Jelajahi keindahan Bandung, mulai dari belanja di factory outlet hingga menikmati udara sejuk pegunungan.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 1 HARI',
      title: 'Taman Bunga Nusantara',
      image: '/images/destinasi/bunga_nusantara.jpeg',
      price: 'Rp. 2.500.000',
      duration: '1 Hari',
      description: 'Nikmati keindahan taman bunga terbesar di Indonesia dengan koleksi bunga dari seluruh dunia.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 1 HARI',
      title: 'Kebun Raya Bogor',
      image: '/images/destinasi/kebun_cibodas.jpeg',
      price: 'Rp. 2.300.000',
      duration: '1 Hari',
      description: 'Wisata alam yang menyegarkan di kebun raya dengan koleksi tumbuhan langka dan udara pegunungan yang sejuk.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 1 HARI',
      title: 'Anyer',
      image: '/images/destinasi/anyer.jpeg',
      price: 'Rp. 2.600.000',
      duration: '1 Hari',
      description: 'Nikmati keindahan pantai Anyer dengan pasir putih dan sunset yang memukau.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 2 HARI',
      title: 'Tangkuban Perahu',
      image: '/images/destinasi/tangkuban_perahu.jpeg',
      price: 'Rp. 2.400.000',
      duration: '2 Hari 1 Malam',
      description: 'Kunjungi kawah gunung berapi aktif yang legendaris dengan pemandangan alam yang spektakuler.',
      category: '2 Hari'
    },
    {
      badge: 'PAKET 1 HARI',
      title: 'Taman Safari',
      image: '/images/destinasi/taman_safari.jpeg',
      price: 'Rp. 2.700.000',
      duration: '1 Hari',
      description: 'Petualangan seru bersama satwa liar di Taman Safari dengan berbagai atraksi menarik.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 1 HARI',
      title: 'Maribaya Bandung',
      image: '/images/destinasi/maribaya_bandung.jpeg',
      price: 'Rp. 2.200.000',
      duration: '1 Hari',
      description: 'Wisata alam dengan pemandian air hangat, curug, dan hutan pinus yang asri.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 1 HARI',
      title: 'Taman Mini',
      image: '/images/destinasi/taman_mini.jpeg',
      price: 'Rp. 2.500.000',
      duration: '1 Hari',
      description: 'Jelajahi kebudayaan Indonesia dalam satu tempat di Taman Mini Indonesia Indah.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 1 HARI',
      title: 'Cimory Dierland Bogor',
      image: '/images/destinasi/bogor-cimory.jpeg',
      price: 'Rp. 2.300.000',
      duration: '1 Hari',
      description: 'Wisata kuliner dan dairy farm di Cimory dengan pemandangan pegunungan yang indah.',
      category: '1 Hari'
    },
    {
      badge: 'PAKET 3 HARI',
      title: 'Dieng Yogya',
      image: '/images/destinasi/dieng-yogya.jpeg',
      price: 'Rp. 4.500.000',
      duration: '3 Hari 2 Malam',
      description: 'Jelajahi keajaiban Dieng Plateau dan budaya Yogyakarta dalam satu perjalanan.',
      category: '3 Hari'
    },
    {
      badge: 'PAKET 3 HARI',
      title: 'Yogyakarta',
      image: '/images/destinasi/yogyakarta.jpeg',
      price: 'Rp. 6.500.000',
      duration: '3 Hari 2 Malam',
      description: 'Borobudur, Prambanan, Malioboro, dan wisata budaya Yogyakarta dengan penginapan hotel bintang 3.',
      category: '3 Hari'
    },
    {
      badge: 'PAKET 4 HARI',
      title: 'Jawa Tengah',
      image: '/images/destinasi/jawatengah.jpeg',
      price: 'Rp. 8.000.000',
      duration: '4 Hari',
      description: 'Perjalanan lintas Jawa Tengah mengunjungi candi-candi megah dan budaya lokal.',
      category: '4 Hari'
    },
    {
      badge: 'PAKET 4 HARI',
      title: 'Bromo Batu Malang',
      image: '/images/destinasi/bromo-batu_malang.jpeg',
      price: 'Rp. 6.800.000',
      duration: '4 Hari',
      description: 'Saksikan sunrise Gunung Bromo dan nikmati wisata Batu Malang yang sejuk.',
      category: '4 Hari'
    },
    {
      badge: 'PAKET 4 HARI',
      title: 'Batu Malang',
      image: '/images/destinasi/batu_malang.jpeg',
      price: 'Rp. 6.500.000',
      duration: '4 Hari',
      description: 'Nikmati udara sejuk dan wisata alam di kota wisata Batu Malang.',
      category: '4 Hari'
    },
    {
      badge: 'PAKET 5 HARI',
      title: 'Bali',
      image: '/images/destinasi/bali.jpeg',
      price: 'Rp. 7.500.000',
      duration: '5 Hari 4 Malam',
      description: 'Nikmati keindahan pantai, pura, dan budaya Bali dengan akomodasi hotel terbaik.',
      category: '5 Hari'
    },
    {
      badge: 'PAKET 10 HARI',
      title: 'Bali Lombok',
      image: '/images/destinasi/bali-lombok.jpeg',
      price: 'Rp. 5.500.000',
      duration: '10 Hari 9 Malam',
      description: 'Jelajahi keindahan Bali dan Lombok dalam satu paket perjalanan yang tak terlupakan.',
      category: '10 Hari'
    },
  ],

  // ========== TESTIMONIALS ==========
  testimonials: [
    {
      name: 'Ahmad Irfan',
      role: 'Traveler',
      rating: 5,
      text: 'Pelayanan sangat memuaskan! Bus bersih, sopir ramah, dan tepat waktu. Sangat recommended untuk perjalanan wisata keluarga.',
    },
    {
      name: 'Chory Aufa',
      role: 'Blogger',
      rating: 5,
      text: 'Pengalaman naik bus wisata yang luar biasa. Harga terjangkau dengan fasilitas yang mewah. Pasti akan pakai lagi!',
    },
    {
      name: "Dwi Nur'Aini",
      role: 'Traveler',
      rating: 4,
      text: 'Pelayanan memuaskan. Bus nyaman dan bersih. Hanya saran untuk penambahan snack di perjalanan.',
    },
    {
      name: 'Pipit Dipi',
      role: 'Traveler',
      rating: 5,
      text: 'Terima kasih Mafina Trans! Perjalanan wisata kami jadi menyenangkan. Busnya bagus dan AC dingin.',
    },
    {
      name: 'Alfarid Petrus',
      role: 'Blogger',
      rating: 5,
      text: 'Salah satu penyedia bus pariwisata terbaik di Tangerang. Pelayanan profesional dan armada terawat.',
    },
  ],

  // ========== NEWS ==========
  news: [],

  // ========== PARTNERS ==========
  partners: [
    'Adhi Prima',
    'Panorama',
    'White Horse',
    'Blue Star',
    'Starbus',
    'Subur Jaya',
    'RJB Trans',
    'Malika',
    'Kanaya',
    'Hiace',
    'Elf',
    'City Trans',
  ],

  // ========== FOOTER ==========
  footer: {
    contact: {
      phone: '087785598639',
      email: 'info@mafinatrans.co.id',
      address: 'Kota Tangerang',
    },
    aboutLinks: [
      { label: 'Tentang Kami', url: '#' },
      { label: 'Visi dan Misi', url: '#' },
      { label: 'Lokasi', url: '#' },
      { label: 'Partner Kami', url: '#' },
    ],
    supportLinks: [
      { label: 'Kerjasama', url: '#' },
      { label: 'Promo', url: '#' },
      { label: 'FAQ', url: '#' },
    ],
    social: {
      facebook: '#',
      pinterest: '#',
      twitter: '#',
      youtube: '#',
      instagram: '#',
    },
    copyright: '© 2024 Mafina Trans All Rights Reserved',
  },

  // ========== WHATSAPP ==========
  whatsapp: {
    number: '6289652594745',
    message: 'Halo Mafina Trans, saya ingin bertanya tentang paket wisata',
  },

  // ========== NAVIGATION ==========
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Armada', path: '/bus-wisata' },
    { label: 'Paket Wisata', path: '/paket-wisata' },
    { label: 'News & Info', path: '/news' },
    { label: 'Kontak Kami', path: '/kontak' },
  ],
};

export default siteData;
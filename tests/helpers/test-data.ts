/**
 * Test Data and Payloads for Mafina Trans Testing System
 */

export const contactData = {
  valid: {
    nama: 'QA Tester',
    email: 'qa.tester@mafinatrans.local',
    judul: 'Pertanyaan Sewa Bus Medium Tangerang',
    pesan: 'Halo Mafina Trans, ini adalah pesan uji otomatis untuk memeriksa fungsionalitas contact form. Harap abaikan.'
  },
  invalidEmail: {
    nama: 'QA Tester Invalid Email',
    email: 'invalid-email-format',
    judul: 'Uji Email Salah',
    pesan: 'Pesan uji.'
  },
  empty: {
    nama: '',
    email: '',
    judul: '',
    pesan: ''
  }
};

export const bookingData = {
  valid: {
    nama: 'QA Customer Booking',
    no_hp: '6281234567890',
    email: 'booking.tester@mafinatrans.local',
    tanggal: '2026-12-25',
    tujuan: 'Bandung Dago Pakar',
    jumlah: '30',
    bus_id: '1'
  },
  validMinimal: {
    nama: 'QA Booking Minimal',
    no_hp: '081299887766',
    email: '',
    tanggal: '2026-11-10',
    tujuan: 'Anyer Beach',
    jumlah: '',
    bus_id: ''
  },
  invalidEmail: {
    nama: 'QA Booking Bad Email',
    no_hp: '081299887766',
    email: 'bad-email-domain',
    tanggal: '2026-11-10',
    tujuan: 'Anyer Beach',
    jumlah: '10',
    bus_id: ''
  },
  invalidJumlah: {
    nama: 'QA Booking Bad Count',
    no_hp: '081299887766',
    email: 'test@mafina.com',
    tanggal: '2026-11-10',
    tujuan: 'Anyer Beach',
    jumlah: 'sepuluh-orang',
    bus_id: ''
  },
  empty: {
    nama: '',
    no_hp: '',
    email: '',
    tanggal: '',
    tujuan: '',
    jumlah: '',
    bus_id: ''
  }
};

export const xssPayloads = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert(1)>',
  '"><script>console.log(document.cookie)</script>'
];

export const sqlInjectionPayloads = [
  "' OR '1'='1",
  "admin'--",
  "'; DROP TABLE users; --",
  "1' OR 1=1 --",
  "' UNION SELECT null, null, null--"
];

export const sensitiveErrorIndicators = [
  'mysqli',
  'SQL syntax',
  'Fatal error',
  'Warning:',
  'Notice:',
  'Stack trace',
  'database error',
  'db_user',
  'db_pass',
  'surya_user'
];

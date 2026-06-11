const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/xampp/htdocs/bus_pariwisata/project_memory.json', 'utf8'));

m.metadata.version = '3.4.0';
m.metadata.changelog.unshift('v3.4.0: Tambah bus 7-11 Malika Wisata. Total 11 bus. File baru tambah_bus_7_11.sql. bus_fix.sql diupdate 11 bus.');
m.databaseSchema.tables.bus.data_count = 11;
m.databaseSchema.tables.bus.data = [
  {id:1,  nama:'Pratama Trans', tipe:'big_bus',    kapasitas:45, harga:4500000, spek:'Smoking Area+Toilet+CoolerBox'},
  {id:2,  nama:'Pratama Trans', tipe:'medium_bus', kapasitas:33, harga:3000000, spek:'1 LCD TV'},
  {id:3,  nama:'Pratama Trans', tipe:'big_bus',    kapasitas:59, harga:4500000, spek:'2 LCD TV'},
  {id:4,  nama:'Pratama Trans', tipe:'big_bus',    kapasitas:59, harga:5000000, spek:'2 LCD TV+Dispenser'},
  {id:5,  nama:'Malika Wisata', tipe:'big_bus',    kapasitas:59, harga:3500000, spek:'2 LCD TV+Dispenser'},
  {id:6,  nama:'Malika Wisata', tipe:'medium_bus', kapasitas:31, harga:3500000, spek:'1 LCD TV'},
  {id:7,  nama:'Malika Wisata', tipe:'big_bus',    kapasitas:59, harga:3500000, spek:'2 LCD TV+Dispenser'},
  {id:8,  nama:'Malika Wisata', tipe:'big_bus',    kapasitas:45, harga:4500000, spek:'SmokingRoom+Toilet+2LCD+Dispenser'},
  {id:9,  nama:'Malika Wisata', tipe:'big_bus',    kapasitas:48, harga:3500000, spek:'2 LCD TV+Dispenser'},
  {id:10, nama:'Malika Wisata', tipe:'medium_long',kapasitas:35, harga:3000000, spek:'1 LCD TV+Dispenser'},
  {id:11, nama:'Malika Wisata', tipe:'medium_bus', kapasitas:31, harga:3000000, spek:'1 LCD TV'}
];

if (!m.databaseSchema.tables.bus_images.data_per_bus) {
  m.databaseSchema.tables.bus_images.data_per_bus = {};
}
const dp = m.databaseSchema.tables.bus_images.data_per_bus;
dp.bus7  = {nama:'Malika Wisata', files:['bus1.jpeg']};
dp.bus8  = {nama:'Malika Wisata', files:['bus1.jpeg']};
dp.bus9  = {nama:'Malika Wisata', files:['bus1.jpeg']};
dp.bus10 = {nama:'Malika Wisata', files:['bus1.jpeg']};
dp.bus11 = {nama:'Malika Wisata', files:['bus1.jpeg']};

if (!m.directoryStructure.database_files) m.directoryStructure.database_files = {};
m.directoryStructure.database_files['tambah_bus_7_11.sql'] = 'BARU - INSERT bus 7-11 + bus_images. Jalankan jika bus 1-6 sudah ada di DB.';

m.pendingTasks.high = [
  'Jalankan database/tambah_bus_7_11.sql di phpMyAdmin (INSERT bus 7-11)',
  'ATAU database/bus_fix.sql untuk reset total 11 bus dari awal',
  'Jalankan database/update_fasilitas.sql (update spek berbeda bus 1-6)',
  'Jalankan database/price_list_setup.sql (35 destinasi harga)'
];

fs.writeFileSync('c:/xampp/htdocs/bus_pariwisata/project_memory.json', JSON.stringify(m, null, 2), 'utf8');
console.log('OK v3.4.0');

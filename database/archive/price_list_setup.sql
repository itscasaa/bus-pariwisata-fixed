USE bus_pariwisata;

DROP TABLE IF EXISTS price_list;

CREATE TABLE price_list (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  nama_destinasi VARCHAR(200)  NOT NULL,
  durasi         VARCHAR(50)   NOT NULL DEFAULT '',
  harga_hiace    BIGINT        NOT NULL DEFAULT 0,
  harga_elf      BIGINT        NOT NULL DEFAULT 0,
  harga_medium   BIGINT        NOT NULL DEFAULT 0,
  harga_big      BIGINT        NOT NULL DEFAULT 0,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO price_list (nama_destinasi, durasi, harga_hiace, harga_elf, harga_medium, harga_big) VALUES
('TRANSFER IN/OUT (One Way)',                                                '4 Jam',   1250000,  1350000,  1750000,  2250000),
('DK HALF DAY',                                                              '8 Jam',   1400000,  1400000,  1900000,  2500000),
('DK FULL DAY',                                                              '12 Jam',  1500000,  1500000,  2000000,  2750000),
('JAKARTA, DEPOK, BEKASI, BSD',                                              '12 Jam',  1500000,  1500000,  2000000,  2750000),
('SENTUL, BOGOR KOTA, TAMBUN, CIKARANG',                                     '12 Jam',  1650000,  1650000,  2500000,  3250000),
('CIAWI, MEGAMENDUNG, TAMAN SAFARI, KARAWANG',                               '15 Jam',  1750000,  1750000,  2750000,  3750000),
('CIBODAS, CIMACAN, CIPANAS',                                                '15 Jam',  1900000,  1900000,  3000000,  4250000),
('SUKABUMI KOTA',                                                            '15 Jam',  1900000,  1900000,  3000000,  4250000),
('BANTEN',                                                                   '18 Jam',  2000000,  2000000,  3500000,  4500000),
('PURWAKARTA',                                                               '18 Jam',  2000000,  2000000,  3500000,  4500000),
('ANYER, SERANG, CARITA',                                                    '18 Jam',  2000000,  2000000,  3500000,  4500000),
('BANDUNG KOTA, LEMBANG, CIMAHI',                                            '18 Jam',  2250000,  2250000,  3700000,  4750000),
('CIWIDEY, PENGALENGAN, SUMEDANG',                                           '18 Jam',  2400000,  2400000,  4000000,  5250000),
('GARUT, TASIKMALAYA',                                                       '18 Jam',  2500000,  2500000,  4500000,  5750000),
('INDRAMAYU, CIREBON, BREBES, KUNINGAN',                                     '18 Jam',  2500000,  2500000,  4500000,  5750000),
('CIAWI, MEGAMENDUNG, CISARUA, TAMAN SAFARI, KARAWANG',                      '2 Hari',  3250000,  3250000,  5050000,  6750000),
('CIBODAS, CIMACAN, CIPANAS, CILOTO, SUKABUMI KOTA',                         '2 Hari',  3500000,  3500000,  5500000,  7750000),
('PURWAKARTA',                                                               '2 Hari',  3500000,  3500000,  5500000,  7750000),
('ANYER, BANTEN, PANDEGLANG, SERANG, CARITA, SUBANG, CIANJUR',               '2 Hari',  3750000,  3750000,  6250000,  8250000),
('BANDUNG, LEMBANG, CIMAHI, TANGKUBAN PRAHU, CIATER',                        '2 Hari',  4000000,  4000000,  6750000,  8750000),
('GARUT, TASIK, KUNINGAN, CIREBON, CIAMIS, SAWARNA, CILETUH',                '2 Hari',  4500000,  4500000,  7750000,  10250000),
('LAMPUNG',                                                                  '2 Hari',  6000000,  6000000,  9000000,  12500000),
('GUCI, TEGAL, BREBES, PEKALONGAN, CILACAP, PANGANDARAN, DIENG, WONOSOBO',   '2 Hari',  6000000,  6000000,  9000000,  12500000),
('LAMPUNG',                                                                  '3 Hari',  8250000,  8250000,  12000000, 17000000),
('GUCI, TEGAL, BREBES, PEKALONGAN, CILACAP, PANGANDARAN, DIENG, WONOSOBO',   '3 Hari',  6750000,  6750000,  10000000, 14250000),
('YOGYAKARTA, SEMARANG, DEMAK',                                              '3 Hari',  7500000,  7500000,  11250000, 15650000),
('YOGYAKARTA, SEMARANG, DEMAK',                                              '4 Hari',  9000000,  9000000,  14000000, 19000000),
('SURABAYA, MALANG, BROMO',                                                  '4 Hari',  10000000, 10000000, 15000000, 20500000),
('PALEMBANG',                                                                '4 Hari',  11000000, 11000000, 16000000, 22500000),
('SURABAYA, MALANG, BROMO',                                                  '5 Hari',  11250000, 11250000, 17500000, 23750000),
('BENGKULU, JAMBI',                                                          '5 Hari',  13750000, 13750000, 20000000, 28250000),
('BALI, LOMBOK',                                                             '7 Hari',  15250000, 15250000, 24500000, 33500000),
('PEKANBARU, RIAU, PADANG',                                                  '8 Hari',  22000000, 22000000, 32000000, 45000000),
('BALI, LOMBOK',                                                             '10 Hari', 22500000, 22500000, 35000000, 47000000),
('MEDAN',                                                                    '10 Hari', 0,        0,        0,        0);
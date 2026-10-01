export interface DapilTapin {
  id: string;
  name: string;
  label: string;
  seats: string;
  districts: string[];
  description: string;
}

export interface AnggotaDprdTapin {
  id: string;
  name: string;
  party: string;
  dapilId: string;
  dapilName: string;
  districts: string[];
  commission: string;
  photoUrl: string;
}

export const DAPIL_TAPIN_LIST: DapilTapin[] = [
  {
    id: 'dapil-1',
    name: 'Dapil Tapin 1',
    label: 'Dapil Tapin 1 (Tapin Utara, Bungur, Lokpaikat, Piani)',
    seats: '7 Kursi DPRD',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    description: 'Wilayah pusat pemerintahan kota Rantau dan kawasan penyangga utara.',
  },
  {
    id: 'dapil-2',
    name: 'Dapil Tapin 2',
    label: 'Dapil Tapin 2 (Tapin Selatan, Salam Babaris, Binuang, Hatungun)',
    seats: '10 Kursi DPRD',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    description: 'Wilayah selatan, sentra perekonomian, perkebunan, dan industri Binuang.',
  },
  {
    id: 'dapil-3',
    name: 'Dapil Tapin 3',
    label: 'Dapil Tapin 3 (Candi Laras Utara, Candi Laras Selatan, Tapin Tengah, Bakarangan)',
    seats: '8 Kursi DPRD',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    description: 'Wilayah perairan Margasari, sentra pertanian pangan, perikanan, dan anyaman.',
  },
];

export const ANGGOTA_DPRD_TAPIN: AnggotaDprdTapin[] = [
  // Dapil Tapin 1
  {
    id: 'dewan-1',
    name: 'H. Daritaniansyah',
    party: 'Partai Golkar',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-2',
    name: 'H. Midpay Syahbani',
    party: 'PDI Perjuangan',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-3',
    name: 'H. Hairuji',
    party: 'Partai Gerindra',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    commission: 'Komisi II (Ekonomi & Keuangan)',
    photoUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-4',
    name: 'Rakhmat Hidayat',
    party: 'Partai NasDem',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-5',
    name: 'H. Muhammad Baseri',
    party: 'Partai PKB',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    commission: 'Komisi II (Ekonomi & Keuangan)',
    photoUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-6',
    name: 'Ismail',
    party: 'Partai Demokrat',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-7',
    name: 'H. Rustan Nawawi',
    party: 'Partai Golkar',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1',
    districts: ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  },

  // Dapil Tapin 2
  {
    id: 'dewan-8',
    name: 'Achmad Riduansyah',
    party: 'Partai Golkar',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-9',
    name: 'Taufik Hidayat',
    party: 'Partai Golkar',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-10',
    name: 'Rahman Nor Wahyudi',
    party: 'Partai Gerindra',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi II (Ekonomi & Keuangan)',
    photoUrl:
      'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-11',
    name: 'H. Misran',
    party: 'Partai Golkar',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-12',
    name: "M. Tegar Mi'radinata",
    party: 'Partai Golkar',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi II (Ekonomi & Keuangan)',
    photoUrl:
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-13',
    name: 'Fatmawati',
    party: 'Partai Golkar',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-14',
    name: 'Wahyu Nugroho Ranoro',
    party: 'PDI Perjuangan',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-15',
    name: 'H. Mislan',
    party: 'Partai Golkar',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi II (Ekonomi & Keuangan)',
    photoUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-16',
    name: 'H. Yamar Hadi',
    party: 'Partai NasDem',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-17',
    name: 'H. Rajudin Noor',
    party: 'Partai Golkar',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2',
    districts: ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80',
  },

  // Dapil Tapin 3
  {
    id: 'dewan-18',
    name: 'Dedy Arief Budiman',
    party: 'Partai Golkar',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-19',
    name: 'H. Gilang Firdaus Helmi',
    party: 'Partai PKS',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi II (Ekonomi & Keuangan)',
    photoUrl:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-20',
    name: 'Yuspianor',
    party: 'PDI Perjuangan',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-21',
    name: 'M. Fajri Rahman',
    party: 'Partai Gerindra',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-22',
    name: 'Herni Mustika',
    party: 'Partai PKB',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi II (Ekonomi & Keuangan)',
    photoUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-23',
    name: 'Ahmad Syarnobi',
    party: 'Partai PAN',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-24',
    name: 'H. Ihwanudin',
    party: 'Partai PPP',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi I (Pemerintahan & Hukum)',
    photoUrl:
      'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dewan-25',
    name: 'Robby Apriandie',
    party: 'Partai Demokrat',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3',
    districts: ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
    commission: 'Komisi III (Pembangunan & Infrastruktur)',
    photoUrl:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=80',
  },
];

export const KECAMATAN_TAPIN_LIST: string[] = [
  'Tapin Utara',
  'Bungur',
  'Lokpaikat',
  'Piani',
  'Tapin Selatan',
  'Salam Babaris',
  'Binuang',
  'Hatungun',
  'Candi Laras Utara',
  'Candi Laras Selatan',
  'Tapin Tengah',
  'Bakarangan',
];

export const DESA_KELURAHAN_TAPIN_MAP: Record<string, string[]> = {
  'Tapin Utara': [
    'Rantau Kiwa (Kelurahan)',
    'Rantau Kanan (Kelurahan)',
    'Kupang (Kelurahan)',
    'Rangda Malingkung (Kelurahan)',
    'Perintis Raya',
    'Banua Hanyar',
    'Banua Halat Kiri',
    'Banua Halat Kanan',
    'Antasari',
    'Antasari Hilir',
    'Badaun',
    'Kakaran',
    'Keramat',
  ],
  Bungur: [
    'Banua Padang',
    'Banua Padang Hilir',
    'Bungur',
    'Bungur Baru',
    'Hangui',
    'Kalumpang',
    'Linuh',
    'Paring Guling',
    'Purut',
    'Rantau Bujur',
    'Shabah',
    'Timbung',
  ],
  Lokpaikat: [
    'Bitahan (Kelurahan)',
    'Ayunan Papan',
    'Bataratat',
    'Binderang',
    'Budi Mulya',
    'Lokpaikat',
    'Parandakan',
    'Puncak Harapan',
  ],
  Piani: [
    'Pipitak Jaya',
    'Harakit',
    'Miawa',
    'Baramban',
    'Balawaian',
    'Batu Ampar',
    'Beramban Hilir',
  ],
  'Tapin Selatan': [
    'Tambarangan (Kelurahan)',
    'Cempaka',
    'Lawahan',
    'Timbaan',
    'Harapan Masa',
    'Hatiwin',
    'Rumintin',
    'Sawang',
    'Suato',
    'Tatakan',
    'Tandui',
  ],
  'Salam Babaris': [
    'Salam Babaris',
    'Suato Baru',
    'Pantai Cabe',
    'Suato Lama',
    'Kambang Habang Baru',
    'Kambang Habang Lama',
  ],
  Binuang: [
    'Binuang (Kelurahan)',
    'Karangan Putih (Kelurahan)',
    'Raya Belanti (Kelurahan)',
    'A. Yani Pura',
    'Gunung Batu',
    'Mekarsari',
    'Padang Sari',
    'Pualam Sari',
    'Pulau Pinang',
    'Pulau Pinang Utara',
    'Tungkap',
  ],
  Hatungun: [
    'Asam Randah',
    'Bagak',
    'Batu Hapu',
    'Burakai',
    'Hatungun',
    'Kambang Kuning',
    'Matang Batas',
    'Tarungin',
  ],
  'Candi Laras Utara': [
    'Batalas',
    'Buas-Buas',
    'Buas-Buas Hilir',
    'Kaladan',
    'Margasari Hilir',
    'Pariok',
    'Rawana',
    'Rawana Hulu',
    'Sawaja',
    'Sungai Puting',
    'Sungai Salai',
    'Sungai Salai Hilir',
    'Teluk Haur',
  ],
  'Candi Laras Selatan': [
    'Baringin A',
    'Baringin B',
    'Baulin',
    'Candi Laras',
    'Marampiau',
    'Marampiau Hilir',
    'Margasari Hulu',
    'Pabaungan Hilir',
    'Pabaungan Hulu',
    'Pabaungan Pantai',
    'Sungai Rutas',
    'Sungai Rutas Hulu',
  ],
  'Tapin Tengah': [
    'Pandahan',
    'Hiyung',
    'Papagan Makmur',
    'Tirik',
    'Suka Ramai',
    'Mandurian',
    'Batang Lantik',
    'Sungai Salai Kidul',
    'Labung',
  ],
  Bakarangan: [
    'Bakarangan',
    'Bundung',
    'Gadung',
    'Gadung Karamat',
    'Ketapang',
    'Masta',
    'Parigi',
    'Parigi Kecil',
    'Paul',
    'Tangkawang',
    'Tangkawang Baru',
    'Waringin',
  ],
};

export const KAMUS_USULAN_LIST: string[] = [
  'Perbaikan Rumah Tidak Layak Huni (RTLH)',
  'Pembangunan / Pengerasan Jalan Lingkungan & Pemukiman',
  'Pembangunan / Perkerasan Jalan Usaha Tani (JUT)',
  'Pembuatan / Perbaikan Jembatan Penyeberangan / Box Culvert',
  'Normalisasi Sungai & Pembangunan Drainase Pemukiman',
  'Pengadaan & Pemasangan Lampu Penerangan Jalan Umum (PJU)',
  'Pembangunan Sarana Air Bersih / Pamsimas / Sumur Bor',
  'Pengadaan Bantuan Alat & Mesin Pertanian (Alsintan)',
  'Bantuan Bibit Perikanan, Pakan Ternak & Kandang Kelompok',
  'Pembangunan / Renovasi Posyandu & Puskesmas Pembantu (Pustu)',
  'Pembangunan Sarana Olahraga & Fasilitas Karang Taruna',
  'Bantuan Renovasi Tempat Ibadah (Masjid / Musholla)',
  'Bantuan Perlengkapan Sekolah & Beasiswa Pelajar Kurang Mampu',
  'Pelatihan Keterampilan Wirausaha & Peralatan UMKM Warga',
  'Lainnya (Usulan Spesifik / Khusus)',
];

export interface MapPresetLocation {
  name: string;
  district: string;
  lat: number;
  lng: number;
}

export const MAP_PRESET_LOCATIONS: MapPresetLocation[] = [
  { name: 'Kawasan Rantau Kota', district: 'Tapin Utara', lat: -2.9381, lng: 115.1524 },
  { name: 'Kawasan Binuang Raya', district: 'Binuang', lat: -3.1205, lng: 115.1702 },
  {
    name: 'Kawasan Perairan Margasari',
    district: 'Candi Laras Selatan',
    lat: -2.8592,
    lng: 114.9812,
  },
  { name: 'Kawasan Bakarangan', district: 'Bakarangan', lat: -2.9125, lng: 115.1189 },
  { name: 'Kawasan Lokpaikat', district: 'Lokpaikat', lat: -2.915, lng: 115.184 },
  { name: 'Kawasan Piani (Pegunungan Meratus)', district: 'Piani', lat: -2.9642, lng: 115.2891 },
];

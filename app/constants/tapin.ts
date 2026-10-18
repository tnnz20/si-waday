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

export const DAPIL_DISTRICTS_MAP: Record<string, string[]> = {
  'dapil-1': ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
  'DAPIL-TAPIN-1': ['Tapin Utara', 'Bungur', 'Lokpaikat', 'Piani'],
  'dapil-2': ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
  'DAPIL-TAPIN-2': ['Tapin Selatan', 'Salam Babaris', 'Binuang', 'Hatungun'],
  'dapil-3': ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
  'DAPIL-TAPIN-3': ['Candi Laras Utara', 'Candi Laras Selatan', 'Tapin Tengah', 'Bakarangan'],
};

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

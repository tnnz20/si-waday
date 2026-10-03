import type { Aspiration, Category } from '@/types/aspiration';

export const CATEGORIES: Category[] = [
  'semua',
  'Infrastruktur',
  'Pelayanan Publik',
  'Kebersihan & Lingkungan',
  'Kesehatan',
];

export const AGENCIES: string[] = [
  'Komisi I DPRD (Pemerintahan & Hukum)',
  'Komisi II DPRD (Ekonomi & Pertanian)',
  'Komisi III DPRD (Pembangunan & Infrastruktur)',
  'Sekretariat DPRD Kab. Tapin',
];

export const EXTENDED_AGENCIES: string[] = [
  'Komisi I DPRD (Pemerintahan, Hukum & Pelayanan Publik)',
  'Komisi II DPRD (Ekonomi, Keuangan & Pertanian)',
  'Komisi III DPRD (Pembangunan, Jalan & Lingkungan Hidup)',
  'Sekretariat DPRD Kab. Tapin (Bagian Fasilitasi Pengaduan)',
  'Badan Aspirasi & Pengawasan DPRD Tapin',
  'Pimpinan DPRD Kabupaten Tapin',
  'Fraksi-Fraksi DPRD Tapin',
];

export const INITIAL_ASPIRATIONS: Aspiration[] = [
  {
    id: 'ASP-2026-9081',
    author: 'Budi Santoso',
    location: 'Kec. Tapin Utara',
    category: 'Infrastruktur',
    agency: 'Komisi III DPRD (Pembangunan & Infrastruktur)',
    title: 'Perbaikan Lampu Penerangan Jalan Diponegoro',
    content:
      'Lampu penerangan jalan sepanjang Jl. Diponegoro RT 04 mati total sejak dua hari lalu. Membahayakan pengendara di malam hari.',
    status: 'Dalam Proses',
    statusBg: 'bg-amber-100 text-amber-700',
    votes: 142,
    comments: 18,
    date: '2 jam lalu',
    voted: false,
  },
  {
    id: 'ASP-2026-9075',
    author: 'Siti Rahma (Anonim)',
    location: 'Kec. Binuang',
    category: 'Pelayanan Publik',
    agency: 'Komisi I DPRD (Pemerintahan & Pelayanan Publik)',
    title: 'Penumpukan Sampah di Depan Pasar Induk Binuang',
    content:
      'Sampah menumpuk sejak 3 hari lalu dan menimbulkan bau menyengat hingga ke pemukiman warga sekitarnya.',
    status: 'Selesai',
    statusBg: 'bg-emerald-100 text-emerald-700',
    votes: 215,
    comments: 34,
    date: '5 jam lalu',
    voted: false,
  },
  {
    id: 'ASP-2026-8942',
    author: 'Ahmad Rizky',
    location: 'Kec. Tapin Selatan',
    category: 'Infrastruktur',
    agency: 'Komisi III DPRD (Pembangunan & Infrastruktur)',
    title: 'Jalan Berlubang Cukup Dalam di Jalur Rantau-Binuang',
    content:
      'Terdapat lubang jalan berdiameter 50cm yang merusak kendaraan dan membahayakan pengendara motor.',
    status: 'Selesai',
    statusBg: 'bg-emerald-100 text-emerald-700',
    votes: 89,
    comments: 9,
    date: '1 hari lalu',
    voted: false,
  },
];

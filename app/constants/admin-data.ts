export type AdminTicketType = 'masyarakat' | 'dapil';

export type AdminTicketStatus =
  'menunggu_verifikasi' | 'terverifikasi' | 'sedang_diproses' | 'selesai' | 'ditolak';

export interface AdminReporter {
  nik: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  idCardFileName: string;
  idCardPreviewUrl: string;
  isVerified: boolean;
}

export interface AdminTicketLocation {
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  alamatDetail: string;
  latitude: number;
  longitude: number;
}

export interface AdminSatisfactionReview {
  rating: number; // 1-5
  aspects: string[];
  feedback: string;
  submittedAt: string;
}

export interface AdminTicketItem {
  id: string;
  type: AdminTicketType;
  reporter: AdminReporter;
  location: AdminTicketLocation;
  title: string;
  categoryOrKamus: string;
  targetDestination: string; // Agency name or DPRD Representative name
  partyOrCommission?: string;
  dapilId?: string;
  dapilName?: string;
  description: string;
  estimatedBudget?: string;
  photos: string[];
  documentFileName?: string;
  status: AdminTicketStatus;
  createdAt: string;
  updatedAt: string;
  slaHoursRemaining: number;
  satisfaction?: AdminSatisfactionReview;
  adminNotes: string;
  assignedTo?: string;
}

export const ADMIN_STATUS_META: Record<
  AdminTicketStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  menunggu_verifikasi: {
    label: 'Menunggu Verifikasi',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  terverifikasi: {
    label: 'Terverifikasi',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  sedang_diproses: {
    label: 'Sedang Diproses',
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-800',
    dot: 'bg-purple-500',
  },
  selesai: {
    label: 'Selesai Ditindaklanjuti',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  ditolak: {
    label: 'Ditolak / Tidak Memenuhi Syarat',
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-800',
    dot: 'bg-rose-500',
  },
};

export const MOCK_ADMIN_TICKETS: AdminTicketItem[] = [
  // 1. Aduan Masyarakat (Komisi III DPRD)
  {
    id: 'ADU-2026-9081',
    type: 'masyarakat',
    reporter: {
      nik: '6305011204900001',
      name: 'Ahmad Syahrial',
      phone: '0812-5012-9881',
      email: 'ahmad.syahrial@gmail.com',
      address: 'Jl. Brigjend H. Hasan Basry No. 42, RT 04 / RW 02',
      idCardFileName: 'e-KTP_Ahmad_Syahrial.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Tapin Utara',
      kelurahan: 'Rantau Kiwa (Kelurahan)',
      alamatDetail: 'Jl. Trans Kalimantan Km 1 depan Jembatan Rantau Baru',
      latitude: -2.9381,
      longitude: 115.1524,
    },
    title: 'Jalan Berlubang Parah di Dekat Jembatan Rantau Baru Membahayakan Pengendara',
    categoryOrKamus: 'Infrastruktur',
    targetDestination: 'Komisi III DPRD (Pembangunan & Infrastruktur)',
    description:
      'Lubang sedalam 15 cm dengan diameter sekitar 1 meter di badan jalan utama arah kota Rantau. Terjadi genangan air saat hujan lebat dan telah menyebabkan 2 pengendara motor tergelincir.',
    photos: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&auto=format&fit=crop&q=80',
    ],
    documentFileName: 'Surat_Laporan_RT04_RantauKiwa.pdf',
    status: 'sedang_diproses',
    createdAt: '2026-09-30 08:15',
    updatedAt: '2026-09-30 11:30',
    slaHoursRemaining: 18,
    satisfaction: {
      rating: 5,
      aspects: ['Formulir Mudah Dipahami', 'Kecepatan Akses Lancar', 'Akurasi Pin Peta Lokasi'],
      feedback: 'Aplikasi sangat praktis, bisa langsung tandai titik jalan rusak di peta Tapin.',
      submittedAt: '2026-09-30 08:16',
    },
    adminNotes:
      'Komisi III DPRD Tapin telah melakukan peninjauan lapangan dan berkoordinasi untuk perbaikan patching aspal besok pagi pukul 09.00 WITA.',
    assignedTo: 'Komisi III DPRD Kabupaten Tapin',
  },

  // 2. Aspirasi Dapil DPRD 1 (RTLH)
  {
    id: 'ASP-2026-4421',
    type: 'dapil',
    reporter: {
      nik: '6305012508850003',
      name: 'Muhammad Ilham Pratama',
      phone: '0852-4890-1122',
      email: 'ilham.pratama@tapinkab.go.id',
      address: 'Desa Kupang RT 02 / RW 01, Kec. Tapin Utara',
      idCardFileName: 'KTP_M_Ilham_Kupang.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Tapin Utara',
      kelurahan: 'Kupang (Kelurahan)',
      alamatDetail: 'RT 02 samping Musholla Al-Ikhlas Desa Kupang',
      latitude: -2.9254,
      longitude: 115.1612,
    },
    title: 'Usulan Pokir: Bantuan Renovasi Rumah Tidak Layak Huni (RTLH) Warga Dhuafa',
    categoryOrKamus: 'Perbaikan Rumah Tidak Layak Huni (RTLH)',
    targetDestination: 'H. Daritaniansyah',
    partyOrCommission: 'Partai Golkar • Komisi I (Pemerintahan & Hukum)',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1 (Tapin Utara, Bungur, Lokpaikat, Piani)',
    description:
      'Pengusulan rehabilitasi atap bocor, dinding kalsiboard rapuh, dan lantai kayu lapuk untuk 2 unit rumah keluarga pra-sejahtera di Kelurahan Kupang agar layak huni dan aman saat musim hujan.',
    estimatedBudget: 'Rp 35.000.000',
    photos: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&auto=format&fit=crop&q=80',
    ],
    documentFileName: 'Proposal_Pokir_RTLH_Kupang_2026.pdf',
    status: 'terverifikasi',
    createdAt: '2026-09-29 14:20',
    updatedAt: '2026-09-30 09:10',
    slaHoursRemaining: 36,
    satisfaction: {
      rating: 5,
      aspects: ['Formulir Mudah Dipahami', 'Tampilan Rapi & Jelas', 'Transparansi Alur Aduan'],
      feedback: 'Bagus sekali ada daftar anggota dewan per Dapil lengkap dengan fotonya.',
      submittedAt: '2026-09-29 14:22',
    },
    adminNotes:
      'Dokumen usulan pokir telah diverifikasi Bagian Persidangan & Perundang-undangan Setwan DPRD untuk dimasukkan ke SIPD Pokir 2027.',
    assignedTo: 'Sekretariat DPRD Kab. Tapin (Bag. Fasilitasi Pokir)',
  },

  // 3. Aduan Masyarakat (Lingkungan Hidup)
  {
    id: 'ADU-2026-8910',
    type: 'masyarakat',
    reporter: {
      nik: '6305045607920002',
      name: 'Siti Rahmah',
      phone: '0878-1422-3301',
      email: 'siti.rahmah.tapin@gmail.com',
      address: 'Jl. A. Yani Km 88, Binuang RT 05',
      idCardFileName: 'KTP_Siti_Rahmah.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Binuang',
      kelurahan: 'Binuang (Kelurahan)',
      alamatDetail: 'Kawasan Pasar Lama Binuang belakang ruko sembako',
      latitude: -3.1256,
      longitude: 115.1633,
    },
    title: 'Penumpukan Sampah Liar dan Bau Menyengat di Sekitar Pasar Lama Binuang',
    categoryOrKamus: 'Lingkungan Hidup & Kebersihan',
    targetDestination: 'Komisi III DPRD (Bidang Lingkungan Hidup)',
    description:
      'Timbunan sampah plastik dan sisa sayuran menumpuk lebih dari 4 hari di TPS liar pinggir jalan pasar lama. Menyebabkan bau tidak sedap dan menyumbat selokan drainase.',
    photos: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'selesai',
    createdAt: '2026-09-28 10:00',
    updatedAt: '2026-09-29 16:45',
    slaHoursRemaining: 0,
    satisfaction: {
      rating: 5,
      aspects: ['Kecepatan Akses Lancar', 'Petunjuk Tooltip Informatif'],
      feedback:
        'Tindak lanjutnya sangat cepat, tim pengawasan Komisi III DPRD langsung merespons dan sampah terangkut.',
      submittedAt: '2026-09-29 17:00',
    },
    adminNotes:
      'Komisi III DPRD Tapin telah berkoordinasi di lapangan untuk pengangkutan 4 ton sampah ke TPA Telaga Hanyar. Papan larangan buang sampah liar sudah dipasang.',
    assignedTo: 'Komisi III DPRD Tapin (Bidang Lingkungan Hidup)',
  },

  // 4. Aspirasi Dapil DPRD 2 (Jalan Usaha Tani)
  {
    id: 'ASP-2026-5512',
    type: 'dapil',
    reporter: {
      nik: '6305041103780004',
      name: 'H. Ruslan Effendi',
      phone: '0813-4920-8819',
      email: 'ruslan.gapoktan@yahoo.com',
      address: 'Desa Tungkap RT 03 / RW 01, Kec. Binuang',
      idCardFileName: 'KTP_H_Ruslan.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Binuang',
      kelurahan: 'Tungkap (Desa)',
      alamatDetail: 'Kawasan Lahan Pertanian Blok Cempaka Desa Tungkap',
      latitude: -3.1412,
      longitude: 115.1789,
    },
    title: 'Usulan Pokir: Pembangunan Pengerasan Jalan Usaha Tani (JUT) Gapoktan Maju Bersama',
    categoryOrKamus: 'Pembangunan Jalan Usaha Tani (JUT)',
    targetDestination: 'Achmad Riduansyah',
    partyOrCommission: 'Partai Golkar • Komisi II (Perekonomian & Pertanian)',
    dapilId: 'dapil-2',
    dapilName: 'Dapil Tapin 2 (Tapin Selatan, Salam Babaris, Binuang, Hatungun)',
    description:
      'Pengerasan jalan usaha tani sepanjang 1.200 meter untuk mempermudah mobilisasi alsintan dan pengangkutan hasil panen padi sawah warga 3 kelompok tani binaan.',
    estimatedBudget: 'Rp 120.000.000',
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    ],
    documentFileName: 'Proposal_JUT_Gapoktan_Tungkap_2026.pdf',
    status: 'sedang_diproses',
    createdAt: '2026-09-29 09:30',
    updatedAt: '2026-09-30 14:00',
    slaHoursRemaining: 42,
    satisfaction: {
      rating: 4,
      aspects: ['Formulir Mudah Dipahami', 'Transparansi Alur Aduan'],
      feedback: 'Semoga aspirasi jalan tani kami benar-benar terealisasi di APBD Tapin.',
      submittedAt: '2026-09-29 09:33',
    },
    adminNotes:
      'Telah ditinjau saat reses dewan Dapil 2. Saat ini tahap sinkronisasi usulan Pokir bersama Komisi II DPRD Kab. Tapin.',
    assignedTo: 'Komisi II DPRD Kabupaten Tapin',
  },

  // 5. Aduan Masyarakat (Kesehatan / Puskesmas)
  {
    id: 'ADU-2026-7734',
    type: 'masyarakat',
    reporter: {
      nik: '6305084409950001',
      name: 'Nor Hayati',
      phone: '0857-5120-7744',
      email: 'norhayati95@gmail.com',
      address: 'Desa Margasari Hulu RT 01, Kec. Candi Laras Selatan',
      idCardFileName: 'KTP_Nor_Hayati.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Candi Laras Selatan',
      kelurahan: 'Baringin (Desa)',
      alamatDetail: 'Puskesmas Pembantu (Pustu) Baringin',
      latitude: -2.8942,
      longitude: 114.9812,
    },
    title: 'Pelayanan Obat & Petugas Medis Kosong di Jam Operasional Pustu Baringin',
    categoryOrKamus: 'Kesehatan & Rumah Sakit',
    targetDestination: 'Komisi I DPRD (Bidang Pelayanan Kesehatan Publik)',
    description:
      'Pada hari Selasa tgl 29 September jam 10.00 WITA warga mengantar balita demam tinggi namun puskesmas pembantu dalam kondisi terkunci dan tidak ada perawat bertugas.',
    photos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'terverifikasi',
    createdAt: '2026-09-30 11:05',
    updatedAt: '2026-09-30 13:20',
    slaHoursRemaining: 15,
    satisfaction: {
      rating: 4,
      aspects: ['Petunjuk Tooltip Informatif', 'Formulir Mudah Dipahami'],
      feedback:
        'Tooltip penjelasan sangat membantu saat mengisi identitas dan tujuan komisi dewan.',
      submittedAt: '2026-09-30 11:07',
    },
    adminNotes:
      'Laporan ditindaklanjuti Komisi I DPRD Tapin untuk pemanggilan dengar pendapat (RDP) terkait kedisiplinan jadwal piket tenaga kesehatan desa.',
    assignedTo: 'Komisi I DPRD Kabupaten Tapin (Bidang Pelayanan Publik)',
  },

  // 6. Aspirasi Dapil DPRD 3 (Normalisasi Sungai)
  {
    id: 'ASP-2026-6639',
    type: 'dapil',
    reporter: {
      nik: '6305091211750002',
      name: 'Fauzan Noor, S.Pd',
      phone: '0812-5100-3321',
      email: 'fauzan.noor@margasari.org',
      address: 'Desa Baringin RT 04, Candi Laras Selatan',
      idCardFileName: 'KTP_Fauzan_Noor.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Candi Laras Selatan',
      kelurahan: 'Baringin (Desa)',
      alamatDetail: 'Aliran Sungai Margasari penghubung Desa Baringin dan Sungai Salai',
      latitude: -2.8812,
      longitude: 114.9921,
    },
    title: 'Usulan Pokir: Normalisasi Aliran Sungai dan Pengerukan Eceng Gondok Margasari',
    categoryOrKamus: 'Normalisasi Sungai & Pengendalian Banjir',
    targetDestination: 'Dedy Arief Budiman',
    partyOrCommission: 'Partai Golkar • Komisi III (Pembangunan & Infrastruktur)',
    dapilId: 'dapil-3',
    dapilName: 'Dapil Tapin 3 (Candi Laras Utara, Candi Laras Selatan, Tapin Tengah, Bakarangan)',
    description:
      'Pengerukan pendangkalan endapan lumpur serta pembersihan tumbuhan eceng gondok tebal yang menghambat perahu nelayan dan memicu banjir genangan ke permukiman tepi sungai.',
    estimatedBudget: 'Rp 85.000.000',
    photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    ],
    documentFileName: 'Surat_Permohonan_Kades_Baringin.pdf',
    status: 'menunggu_verifikasi',
    createdAt: '2026-09-30 13:45',
    updatedAt: '2026-09-30 13:45',
    slaHoursRemaining: 23,
    satisfaction: {
      rating: 5,
      aspects: [
        'Formulir Mudah Dipahami',
        'Kecepatan Akses Lancar',
        'Tampilan Rapi & Jelas',
        'Akurasi Pin Peta Lokasi',
      ],
      feedback: 'Desain aplikasinya sangat bagus dan responsif di HP!',
      submittedAt: '2026-09-30 13:48',
    },
    adminNotes: 'Menunggu telaah administrasi awal oleh tim sekretariat komisi III.',
    assignedTo: 'Komisi III DPRD Tapin',
  },

  // 7. Aduan Masyarakat (Komisi I DPRD)
  {
    id: 'ADU-2026-6651',
    type: 'masyarakat',
    reporter: {
      nik: '6305011905880005',
      name: 'Bambang Irawan',
      phone: '0813-4888-9900',
      email: 'bambang.tapin@gmail.com',
      address: 'Jl. Datu Nuraya RT 06, Rantau Kiwa, Tapin Utara',
      idCardFileName: 'KTP_Bambang.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Tapin Utara',
      kelurahan: 'Rantau Kiwa (Kelurahan)',
      alamatDetail: 'Taman Basimban Rantau samping arena skateboard',
      latitude: -2.9355,
      longitude: 115.1588,
    },
    title: 'Penertiban Balap Liar dan Knalpot Brong di Kawasan Rantau Baru Tiap Malam Minggu',
    categoryOrKamus: 'Ketertiban Umum & Fasilitas Publik',
    targetDestination: 'Komisi I DPRD (Bidang Hukum & Ketertiban Umum)',
    description:
      'Aktivitas sekelompok remaja balap liar dengan knalpot bising yang sangat mengganggu kenyamanan istirahat warga sekitar dan pengunjung ruang terbuka publik.',
    photos: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'selesai',
    createdAt: '2026-09-27 22:30',
    updatedAt: '2026-09-28 08:00',
    slaHoursRemaining: 0,
    satisfaction: {
      rating: 5,
      aspects: ['Kecepatan Akses Lancar', 'Transparansi Alur Aduan'],
      feedback:
        'Rekomendasi pengawasan Komisi I DPRD langsung ditindaklanjuti patroli malam, mantap.',
      submittedAt: '2026-09-28 09:15',
    },
    adminNotes:
      'Komisi I DPRD Tapin telah merekomendasikan tindakan preventif dan koordinasi terpadu untuk pengamanan kawasan Rantau Baru.',
    assignedTo: 'Komisi I DPRD Kabupaten Tapin',
  },

  // 8. Aspirasi Dapil DPRD 1 (PJU Pedesaan)
  {
    id: 'ASP-2026-3390',
    type: 'dapil',
    reporter: {
      nik: '6305021804910002',
      name: 'Hairunnisa, S.Farm',
      phone: '0852-5111-2233',
      email: 'hairunnisa.bungur@gmail.com',
      address: 'Desa Bungur RT 02, Kec. Bungur',
      idCardFileName: 'KTP_Hairunnisa.jpg',
      idCardPreviewUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    location: {
      kabupaten: 'Kabupaten Tapin',
      kecamatan: 'Bungur',
      kelurahan: 'Bungur (Desa)',
      alamatDetail: 'Sepanjang jalan penghubung Desa Bungur menuju Desa Linuh',
      latitude: -2.9612,
      longitude: 115.1923,
    },
    title: 'Usulan Pokir: Pengadaan 15 Titik Lampu Penerangan Jalan Umum (PJU) Tenaga Surya',
    categoryOrKamus: 'Penerangan Jalan Umum (PJU) Pedesaan',
    targetDestination: 'H. Midpay Syahbani',
    partyOrCommission: 'Partai Golkar • Komisi III (Pembangunan)',
    dapilId: 'dapil-1',
    dapilName: 'Dapil Tapin 1 (Tapin Utara, Bungur, Lokpaikat, Piani)',
    description:
      'Jalur penghubung antar desa sepanjang 2 kilometer gelap gulita saat malam, sering terjadi kecelakaan tunggal dan rawan tindak kejahatan jalanan.',
    estimatedBudget: 'Rp 60.000.000',
    photos: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    ],
    documentFileName: 'Proposal_PJU_Desa_Bungur.pdf',
    status: 'terverifikasi',
    createdAt: '2026-09-28 15:10',
    updatedAt: '2026-09-29 11:20',
    slaHoursRemaining: 28,
    satisfaction: {
      rating: 5,
      aspects: ['Formulir Mudah Dipahami', 'Akurasi Pin Peta Lokasi'],
      feedback: 'Sangat mudah menentukan titik koordinat PJU di peta.',
      submittedAt: '2026-09-28 15:15',
    },
    adminNotes:
      'Telah dimasukkan dalam daftar kompilasi Pokir Dapil 1 untuk pembahasan RKPD tahun depan.',
    assignedTo: 'Komisi III DPRD Kabupaten Tapin',
  },
];

export interface AdminKpiStats {
  totalTickets: number;
  totalComplaints: number;
  totalAspirations: number;
  totalVerifiedCitizens: number;
  pendingVerificationCount: number;
  inProgressCount: number;
  completedCount: number;
  totalAspirationBudgetFormatted: string;
  averageSlaHours: string;
  averageCsatRating: number;
  totalCsatReviews: number;
  satisfactionPercentage: number;
}

export const ADMIN_KPI_DATA: AdminKpiStats = {
  totalTickets: 128,
  totalComplaints: 74,
  totalAspirations: 54,
  totalVerifiedCitizens: 116,
  pendingVerificationCount: 14,
  inProgressCount: 38,
  completedCount: 72,
  totalAspirationBudgetFormatted: 'Rp 2.450.000.000',
  averageSlaHours: '6.2 Jam',
  averageCsatRating: 4.86,
  totalCsatReviews: 104,
  satisfactionPercentage: 97.2,
};

export const CSAT_DISTRIBUTION = [
  { star: 5, count: 88, percentage: 84.6 },
  { star: 4, count: 12, percentage: 11.5 },
  { star: 3, count: 3, percentage: 2.9 },
  { star: 2, count: 1, percentage: 1.0 },
  { star: 1, count: 0, percentage: 0.0 },
];

export const CSAT_ASPECT_RATINGS = [
  { name: 'Formulir Mudah Dipahami', score: 98 },
  { name: 'Kecepatan Akses Lancar', score: 94 },
  { name: 'Tampilan Rapi & Jelas (UI/UX)', score: 96 },
  { name: 'Akurasi Pin Peta Lokasi', score: 91 },
  { name: 'Petunjuk Tooltip Informatif', score: 93 },
  { name: 'Transparansi Alur Aduan', score: 95 },
];

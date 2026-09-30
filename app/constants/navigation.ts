export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Beranda', href: '/#beranda' },
  { label: 'Alur Aspirasi', href: '/#tentang' },
  { label: 'Keunggulan', href: '/#keunggulan' },
  { label: 'Aspirasi Terkini', href: '/#aspirasi' },
  { label: 'FAQ', href: '/#faq' },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  { label: 'Beranda', href: '/#beranda' },
  { label: 'Keunggulan Platform', href: '/#keunggulan' },
  { label: 'Daftar Aspirasi', href: '/#aspirasi' },
  { label: 'FAQ', href: '/#faq' },
];

export const MITRA_AGENCIES: { name: string; href: string }[] = [
  { name: 'Dinas Pekerjaan Umum (PUPR)', href: '/#aspirasi' },
  { name: 'Dinas Perhubungan', href: '/#aspirasi' },
  { name: 'Dinas Lingkungan Hidup', href: '/#aspirasi' },
  { name: 'Dinas Kesehatan', href: '/#aspirasi' },
];

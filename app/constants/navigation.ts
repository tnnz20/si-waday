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
  { name: 'Komisi I DPRD (Pemerintahan & Hukum)', href: '/#aspirasi' },
  { name: 'Komisi II DPRD (Ekonomi & Pertanian)', href: '/#aspirasi' },
  { name: 'Komisi III DPRD (Pembangunan & Infrastruktur)', href: '/#aspirasi' },
  { name: 'Sekretariat DPRD Kab. Tapin', href: '/#aspirasi' },
];

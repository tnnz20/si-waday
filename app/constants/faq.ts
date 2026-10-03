export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah identitas saya aman saat menyampaikan aspirasi?',
    answer:
      'Ya, sangat aman. Anda dapat memilih opsi "Kirim secara Anonim" saat mengisi formulir. Nama Anda tidak akan ditampilkan di publik maupun diberikan kepada pihak manapun.',
  },
  {
    id: 'faq-2',
    question: 'Berapa lama aspirasi & aduan diproses oleh DPRD Tapin?',
    answer:
      'Proses verifikasi admin Sekretariat DPRD memerlukan waktu maksimal 3 jam. Setelah diverifikasi, Komisi atau Anggota DPRD terkait akan menelaah dan memberikan respon awal dalam kurun 1 x 24 jam.',
  },
  {
    id: 'faq-3',
    question: 'Jenis aspirasi & aduan apa saja yang bisa disampaikan?',
    answer:
      'Masyarakat dapat menyampaikan usulan Pokir pembangunan ke anggota dewan Dapil, melaporkan keluhan infrastruktur, kebersihan lingkungan, mutu pelayanan publik, hingga pengawasan kebijakan daerah ke Komisi DPRD Tapin.',
  },
];

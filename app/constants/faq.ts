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
    question: 'Berapa lama laporan diproses oleh instansi terkait?',
    answer:
      'Proses verifikasi admin memerlukan waktu maksimal 3 jam. Setelah diverifikasi, instansi terkait berkewajiban memberikan respon awal atau penanganan dalam kurun 1 x 24 jam.',
  },
  {
    id: 'faq-3',
    question: 'Jenis pengaduan apa saja yang bisa disampaikan?',
    answer:
      'Masyarakat dapat melaporkan kerusakan jalan/infrastruktur, kualitas pelayanan kantor dinas, kebersihan/penumpukan sampah, fasilitas kesehatan, hingga ide pembangunan kota.',
  },
];

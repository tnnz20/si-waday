import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Apakah identitas saya aman saat menyampaikan aspirasi?',
    answer:
      'Ya, sangat aman. Anda dapat memilih opsi "Kirim secara Anonim" saat mengisi formulir. Nama Anda tidak akan ditampilkan di publik maupun diberikan kepada pihak manapun.',
  },
  {
    question: 'Berapa lama laporan diproses oleh instansi terkait?',
    answer:
      'Proses verifikasi admin memerlukan waktu maksimal 3 jam. Setelah diverifikasi, instansi terkait berkewajiban memberikan respon awal atau penanganan dalam kurun 1 x 24 jam.',
  },
  {
    question: 'Jenis pengaduan apa saja yang bisa disampaikan?',
    answer:
      'Masyarakat dapat melaporkan kerusakan jalan/infrastruktur, kualitas pelayanan kantor dinas, kebersihan/penumpukan sampah, fasilitas kesehatan, hingga ide pembangunan kota.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="bg-[#FAF5F0] py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-accent-500 mb-2 block text-xs font-bold tracking-widest uppercase">
            PERTANYAAN UMUM
          </span>
          <h2 className="text-darknavy-900 text-3xl font-extrabold">Hal yang Sering Ditanyakan</h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="border-warm-200 overflow-hidden rounded-3xl border bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="text-darknavy-900 hover:bg-warm-100/50 flex w-full items-center justify-between p-6 text-left text-sm font-bold transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-warm-100 border-t px-6 pt-4 pb-6 text-xs leading-relaxed text-slate-600">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

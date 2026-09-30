import { useState } from 'react';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

import { APP_DESCRIPTION, APP_NAME } from '@/constants/index';

import type { Route } from './+types/home';
import { CtaTracking } from './home/cta-tracking';
import { Faq } from './home/faq';
import { Features } from './home/features';
import { Feed } from './home/feed';
import { Hero } from './home/hero';
import { AspirationModal, ToastContainer, TrackModal } from './home/modals';
import { Stats } from './home/stats';
import type { Aspiration, Category, NewAspirationInput, ToastMessage } from './home/types';

export const meta: Route.MetaFunction = () => [
  { title: `${APP_NAME} - ${APP_DESCRIPTION}` },
  {
    name: 'description',
    content:
      'Platform independen aspirasi & pengaduan publik untuk mewujudkan kota yang transparan, responsif, dan inklusif.',
  },
];

const INITIAL_ASPIRATIONS: Aspiration[] = [
  {
    id: 'ASP-2026-9081',
    author: 'Budi Santoso',
    location: 'Kec. Merdeka',
    category: 'Infrastruktur',
    agency: 'Dinas Perhubungan',
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
    location: 'Kec. Bandung Tengah',
    category: 'Pelayanan Publik',
    agency: 'Dinas Kebersihan',
    title: 'Penumpukan Sampah di Depan Pasar Induk',
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
    location: 'Kec. Coblong',
    category: 'Infrastruktur',
    agency: 'Dinas PUPR',
    title: 'Jalan Berlubang Cukup Dalam di Dekat Pertigaan Dago',
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

export default function Home() {
  const [aspirations, setAspirations] = useState<Aspiration[]>(INITIAL_ASPIRATIONS);
  const [currentCategory, setCurrentCategory] = useState<Category>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAspirationModalOpen, setIsAspirationModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState('ASP-2026-9081');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'info' | 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleToggleVote = (id: string) => {
    setAspirations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVoted = !item.voted;
          const nextVotes = nextVoted ? item.votes + 1 : Math.max(0, item.votes - 1);
          if (nextVoted) {
            showToast('Terima kasih! Dukungan Anda tercatat.', 'success');
          } else {
            showToast('Dukungan dibatalkan.', 'info');
          }
          return {
            ...item,
            votes: nextVotes,
            voted: nextVoted,
          };
        }
        return item;
      })
    );
  };

  const handleOpenTrackModal = (ticketId?: string) => {
    setActiveTrackId(ticketId || 'ASP-2026-9081');
    setIsTrackModalOpen(true);
  };

  const handleCreateAspiration = (input: NewAspirationInput) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `ASP-2026-${randomSuffix}`;

    const newEntry: Aspiration = {
      id: newId,
      author: input.author,
      location: input.location,
      category: input.category,
      agency: input.agency,
      title: input.title,
      content: input.content,
      status: 'Terverifikasi',
      statusBg: 'bg-blue-100 text-blue-700',
      votes: 1,
      comments: 0,
      date: 'Baru saja',
      voted: true,
    };

    setAspirations((prev) => [newEntry, ...prev]);
    showToast(`Aspirasi berhasil terkirim! Kode Tiket: ${newId}`, 'success');
  };

  return (
    <div className="bg-warm-100 selection:bg-accent-500 min-h-[100dvh] overflow-x-hidden selection:text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenAspirationModal={() => setIsAspirationModalOpen(true)}
        onOpenTrackModal={handleOpenTrackModal}
      />

      {/* Main Landing Sections */}
      <main>
        <Hero onOpenAspirationModal={() => setIsAspirationModalOpen(true)} />
        <Stats />
        <Features />
        <Feed
          aspirations={aspirations}
          currentCategory={currentCategory}
          searchQuery={searchQuery}
          onCategoryChange={setCurrentCategory}
          onSearchChange={setSearchQuery}
          onToggleVote={handleToggleVote}
          onOpenTrackModal={handleOpenTrackModal}
        />
        <CtaTracking onTrackTicket={handleOpenTrackModal} />
        <Faq />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Floating Notifications */}
      <AspirationModal
        isOpen={isAspirationModalOpen}
        onClose={() => setIsAspirationModalOpen(false)}
        onSubmit={handleCreateAspiration}
      />

      <TrackModal
        isOpen={isTrackModalOpen}
        ticketId={activeTrackId}
        onClose={() => setIsTrackModalOpen(false)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}

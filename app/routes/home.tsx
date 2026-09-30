import { useState } from 'react';

import { CtaTracking } from '@/components/home/cta-tracking';
import { Faq } from '@/components/home/faq';
import { Features } from '@/components/home/features';
import { Feed } from '@/components/home/feed';
import { Hero } from '@/components/home/hero';
import { TrackModal } from '@/components/home/modals';
import { Stats } from '@/components/home/stats';

import type { Aspiration, Category } from '@/types/aspiration';

import { INITIAL_ASPIRATIONS } from '@/constants/aspirations';
import { APP_DESCRIPTION, APP_NAME } from '@/constants/index';

import type { Route } from './+types/home';

export const meta: Route.MetaFunction = () => [
  { title: `${APP_NAME} - ${APP_DESCRIPTION}` },
  {
    name: 'description',
    content:
      'Platform independen aspirasi & pengaduan publik untuk mewujudkan kota yang transparan, responsif, dan inklusif.',
  },
];

export default function Home() {
  const [aspirations, setAspirations] = useState<Aspiration[]>(INITIAL_ASPIRATIONS);
  const [currentCategory, setCurrentCategory] = useState<Category>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState('ASP-2026-9081');

  const handleToggleVote = (id: string) => {
    setAspirations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVoted = !item.voted;
          const nextVotes = nextVoted ? item.votes + 1 : Math.max(0, item.votes - 1);
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

  return (
    <>
      <Hero />
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

      <TrackModal
        isOpen={isTrackModalOpen}
        ticketId={activeTrackId}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </>
  );
}

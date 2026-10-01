import * as React from 'react';

import { useSearchParams } from 'react-router';

import { cn } from '@/lib/utils';

import { AdminHeader } from '@/components/admin/admin-header';
import { AspirationsTab } from '@/components/admin/aspirations-tab';
import { ComplaintsTab } from '@/components/admin/complaints-tab';
import { OverviewTab } from '@/components/admin/overview-tab';
import { SatisfactionTab } from '@/components/admin/satisfaction-tab';
import { TicketDetailModal } from '@/components/admin/ticket-detail-modal';
import { AdminSidebar, type AdminTab } from '@/components/layout/admin-sidebar';

import {
  type AdminTicketItem,
  type AdminTicketStatus,
  MOCK_ADMIN_TICKETS,
} from '@/constants/admin-data';

import type { Route } from './+types/admin';

export const meta: Route.MetaFunction = () => [
  { title: 'Dashboard Admin • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content:
      'Pusat Kendali Terpadu Aduan Pelayanan Publik dan Pokok Pikiran (Pokir) DPRD Kabupaten Tapin.',
  },
];

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') as AdminTab;
  const activeTab: AdminTab = ['overview', 'aduan', 'aspirasi', 'kepuasan'].includes(rawTab)
    ? rawTab
    : 'overview';

  const [tickets, setTickets] = React.useState<AdminTicketItem[]>(MOCK_ADMIN_TICKETS);
  const [selectedTicket, setSelectedTicket] = React.useState<AdminTicketItem | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleTabChange = (tab: AdminTab) => {
    setSearchParams((prev) => {
      prev.set('tab', tab);
      return prev;
    });
  };

  const handleSearchFocus = () => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder*="Cari ID tiket"]');
    if (input) {
      input.focus();
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: AdminTicketStatus, newNotes: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            adminNotes: newNotes,
            updatedAt: 'Baru saja',
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="bg-warm-100 text-darknavy-900 flex min-h-dvh font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        onSearchFocus={handleSearchFocus}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-all duration-300',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        {/* Bento Top Header Container */}
        <div className="bg-warm-100/85 sticky top-0 z-30 w-full px-4 pt-4 pb-2 backdrop-blur-md sm:px-6 sm:pt-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <AdminHeader
              activeTab={activeTab}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="w-full flex-1 px-4 pt-2 pb-6 sm:px-6 sm:pb-8 lg:px-8">
          <main className="mx-auto max-w-7xl">
            {activeTab === 'overview' ? (
              <OverviewTab
                tickets={tickets}
                onSelectTicket={setSelectedTicket}
                onNavigateTab={handleTabChange}
              />
            ) : null}

            {activeTab === 'aduan' ? (
              <ComplaintsTab
                tickets={tickets}
                onSelectTicket={setSelectedTicket}
                searchQuery={searchQuery}
              />
            ) : null}

            {activeTab === 'aspirasi' ? (
              <AspirationsTab
                tickets={tickets}
                onSelectTicket={setSelectedTicket}
                searchQuery={searchQuery}
              />
            ) : null}

            {activeTab === 'kepuasan' ? <SatisfactionTab tickets={tickets} /> : null}
          </main>
        </div>
      </div>

      {/* Detail Inspection & Status Updating Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

import * as React from 'react';

import { and, asc, eq, isNull } from 'drizzle-orm';
import { useSearchParams } from 'react-router';
import { AdminHeader } from '~/components/admin/admin-header';
import { AspirationsTab } from '~/components/admin/aspirations-tab';
import { ComplaintsTab } from '~/components/admin/complaints-tab';
import { DewanTab, type LegislatorItem } from '~/components/admin/dewan-tab';
import { type ModeratorItem, ModeratorsTab } from '~/components/admin/moderators-tab';
import { OverviewTab } from '~/components/admin/overview-tab';
import { SatisfactionTab } from '~/components/admin/satisfaction-tab';
import { TicketDetailModal } from '~/components/admin/ticket-detail-modal';
import { AdminSidebar, type AdminTab } from '~/components/layout/admin-sidebar';
import {
  type AdminTicketItem,
  type AdminTicketStatus,
  MOCK_ADMIN_TICKETS,
} from '~/constants/admin-data';
import { db } from '~/db/index.server';
import { regions, userProfiles, users } from '~/db/schema/schema';
import { requireAuth } from '~/lib/session.server';
import { cn } from '~/lib/utils';

import type { Route } from './+types/admin';

export const meta: Route.MetaFunction = () => [
  { title: 'Dashboard Admin • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content:
      'Pusat Kendali Terpadu Aduan Pelayanan Publik dan Pokok Pikiran (Pokir) DPRD Kabupaten Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  // Enforce session presence via JWT HttpOnly cookie
  const authResult = await requireAuth(request);
  const currentUser = authResult.user;

  let legislators: LegislatorItem[] = [];
  let moderators: ModeratorItem[] = [];

  // If user is super admin, preload user management records
  if (currentUser.role === 'admin') {
    const rawUsers = await db
      .select({
        id: users.id,
        name: userProfiles.fullName,
        email: users.email,
        party: userProfiles.party,
        commission: userProfiles.commission,
        dapilName: regions.name,
        role: users.role,
        gender: userProfiles.gender,
        isActive: users.isActive,
      })
      .from(users)
      .innerJoin(userProfiles, eq(userProfiles.userId, users.id))
      .leftJoin(regions, eq(regions.id, userProfiles.regionId))
      .where(and(isNull(users.deletedAt), isNull(userProfiles.deletedAt)))
      .orderBy(asc(userProfiles.fullName));

    legislators = rawUsers
      .filter((r) => r.role === 'dprd' || r.role === 'dpr')
      .map((r) => ({
        id: r.id,
        name: r.name,
        party: r.party || '-',
        commission: r.commission || '-',
        dapilName: r.dapilName || '-',
        role: r.role === 'dprd' ? 'DPRD Tapin' : 'DPR RI',
        gender: r.gender,
        isActive: r.isActive,
      }));

    moderators = rawUsers
      .filter((r) => r.role === 'moderator')
      .map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        dapilName: r.dapilName || '-',
        gender: r.gender,
        isActive: r.isActive,
      }));
  }

  const payload = {
    currentUser,
    legislators,
    moderators,
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export default function AdminPage({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') as AdminTab;

  const isAdmin = loaderData.currentUser.role === 'admin';
  const allowedTabs: AdminTab[] = isAdmin
    ? ['overview', 'aduan', 'aspirasi', 'kepuasan', 'users-dewan', 'users-moderator']
    : ['overview', 'aspirasi'];

  const activeTab: AdminTab = allowedTabs.includes(rawTab) ? rawTab : 'overview';

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
        currentUser={loaderData.currentUser}
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

            {activeTab === 'users-dewan' ? <DewanTab legislators={loaderData.legislators} /> : null}

            {activeTab === 'users-moderator' ? (
              <ModeratorsTab moderators={loaderData.moderators} />
            ) : null}
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

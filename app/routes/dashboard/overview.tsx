import * as React from 'react';

import { requireAuth } from '@/lib/session.server';

import { OverviewTab } from '@/components/dashboard/admin/overview-tab';
import { TicketDetailModal } from '@/components/dashboard/admin/ticket-detail-modal';

import {
  type AdminTicketItem,
  type AdminTicketStatus,
  MOCK_ADMIN_TICKETS,
} from '@/constants/admin-data';

import type { Route } from './+types/overview';

export const meta: Route.MetaFunction = () => [
  { title: 'Ringkasan Dashboard • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content: 'Ringkasan eksekutif kinerja dan penyerapan aspirasi konstituen DPRD Kabupaten Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);
  const payload = { currentUser: authResult.user };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export default function OverviewPage() {
  const [tickets, setTickets] = React.useState<AdminTicketItem[]>(MOCK_ADMIN_TICKETS);
  const [selectedTicket, setSelectedTicket] = React.useState<AdminTicketItem | null>(null);

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
    <>
      <OverviewTab tickets={tickets} onSelectTicket={setSelectedTicket} />

      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

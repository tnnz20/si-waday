import * as React from 'react';

import { redirect } from 'react-router';

import { requireAuth } from '@/lib/session.server';

import { ComplaintsTab } from '@/components/dashboard/admin/complaints-tab';
import { TicketDetailModal } from '@/components/dashboard/admin/ticket-detail-modal';

import {
  type AdminTicketItem,
  type AdminTicketStatus,
  MOCK_ADMIN_TICKETS,
} from '@/constants/admin-data';

import type { Route } from './+types/complaints';

export const meta: Route.MetaFunction = () => [
  { title: 'Aduan Masyarakat • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content: 'Manajemen dan verifikasi aduan pelayanan publik warga Kabupaten Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);

  // Role guard: Only admin can access complaints tab
  if (authResult.user.role !== 'admin') {
    throw redirect('/dashboard');
  }

  const payload = { currentUser: authResult.user };
  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export default function ComplaintsPage() {
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
      <ComplaintsTab tickets={tickets} onSelectTicket={setSelectedTicket} />

      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

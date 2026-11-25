import { redirect } from 'react-router';

import { requireAuth } from '@/lib/session.server';
import { getAdminTicketDetail, handleTicketStatusUpdateAction } from '@/lib/ticket.server';

import { DetailPageSkeleton } from '@/components/dashboard/admin/dashboard-skeletons';
import { TicketDetailView } from '@/components/dashboard/admin/ticket-detail-view';

import type { Route } from './+types/complaints-detail';

export const meta: Route.MetaFunction = ({ params }) => [
  { title: `Detail Aduan ${params.ticketNumber || ''} • SI-WADAY Kabupaten Tapin` },
  {
    name: 'description',
    content: 'Detail pemeriksaan aduan masyarakat, tindak lanjut, dan umpan balik warga.',
  },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);

  if (authResult.user.role !== 'admin') {
    throw redirect('/dashboard');
  }

  const ticketNumber = params.ticketNumber;
  if (!ticketNumber) {
    throw redirect('/dashboard/complaints');
  }

  const ticket = await getAdminTicketDetail(ticketNumber, 'masyarakat', authResult.user);
  if (!ticket) {
    throw redirect('/dashboard/complaints');
  }

  const payload = {
    currentUser: authResult.user,
    ticket,
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export async function action({ request, params }: Route.ActionArgs) {
  const ticketNumber = params.ticketNumber;
  if (!ticketNumber) {
    return Response.json({ success: false, error: 'Nomor tiket tidak valid.' }, { status: 400 });
  }
  return handleTicketStatusUpdateAction(request, ticketNumber, 'masyarakat');
}

export function HydrateFallback() {
  return <DetailPageSkeleton />;
}

export default function ComplaintDetailPage({ loaderData }: Route.ComponentProps) {
  return (
    <TicketDetailView
      ticket={loaderData.ticket}
      currentUser={loaderData.currentUser}
      backHref="/dashboard/complaints"
      backLabel="Kembali ke Daftar Aduan Masyarakat"
    />
  );
}

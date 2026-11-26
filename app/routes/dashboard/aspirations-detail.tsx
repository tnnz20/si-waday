import { redirect } from 'react-router';

import { requireAuth } from '@/lib/session.server';
import { getAdminTicketDetail, handleTicketStatusUpdateAction } from '@/lib/ticket.server';

import { DetailPageSkeleton } from '@/components/dashboard/admin/dashboard-skeletons';
import { TicketDetailView } from '@/components/dashboard/admin/ticket-detail-view';

import type { Route } from './+types/aspirations-detail';

export const meta: Route.MetaFunction = ({ params }) => [
  { title: `Detail Aspirasi ${params.ticketNumber || ''} • SI-WADAY Kabupaten Tapin` },
  {
    name: 'description',
    content: 'Detail lengkap usulan pokok pikiran DPRD, tindak lanjut, dan umpan balik warga.',
  },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);
  const ticketNumber = params.ticketNumber;

  if (!ticketNumber) {
    throw redirect('/dashboard/aspirations');
  }

  const ticket = await getAdminTicketDetail(ticketNumber, 'dapil', authResult.user);
  if (!ticket) {
    throw redirect('/dashboard/aspirations');
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
  return handleTicketStatusUpdateAction(request, ticketNumber, 'dapil');
}

export function HydrateFallback() {
  return <DetailPageSkeleton />;
}

export default function AspirationDetailPage({ loaderData }: Route.ComponentProps) {
  return (
    <TicketDetailView
      ticket={loaderData.ticket}
      currentUser={loaderData.currentUser}
      backHref="/dashboard/aspirations"
      backLabel="Kembali ke Daftar Aspirasi Dapil"
    />
  );
}

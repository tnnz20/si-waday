import { redirect } from 'react-router';

import { requireAuth } from '@/lib/session.server';
import { getDashboardTickets } from '@/lib/ticket.server';

import { ComplaintsTab } from '@/components/dashboard/admin/complaints-tab';
import { TableViewSkeleton } from '@/components/dashboard/admin/dashboard-skeletons';

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

  const tickets = await getDashboardTickets({ type: 'masyarakat', user: authResult.user });

  const payload = {
    currentUser: authResult.user,
    tickets,
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export function HydrateFallback() {
  return <TableViewSkeleton />;
}

export default function ComplaintsPage({ loaderData }: Route.ComponentProps) {
  return <ComplaintsTab tickets={loaderData.tickets} />;
}

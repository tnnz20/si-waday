import { requireAuth } from '@/lib/session.server';
import { getDashboardTickets } from '@/lib/ticket.server';

import { AspirationsTab } from '@/components/dashboard/admin/aspirations-tab';
import { TableViewSkeleton } from '@/components/dashboard/admin/dashboard-skeletons';

import type { Route } from './+types/aspirations';

export const meta: Route.MetaFunction = () => [
  { title: 'Aspirasi Dapil & Pokir • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content:
      'Penyerapan pokok-pokok pikiran (Pokir) dan usulan konstituen 25 anggota DPRD Kabupaten Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);
  const tickets = await getDashboardTickets({ type: 'dapil', user: authResult.user });

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

export default function AspirationsPage({ loaderData }: Route.ComponentProps) {
  return <AspirationsTab tickets={loaderData.tickets} />;
}

import { redirect } from 'react-router';

import { requireAuth } from '@/lib/session.server';

import { SatisfactionTab } from '@/components/dashboard/admin/satisfaction-tab';

import { MOCK_ADMIN_TICKETS } from '@/constants/admin-data';

import type { Route } from './+types/satisfaction';

export const meta: Route.MetaFunction = () => [
  { title: 'Survei Kepuasan CSAT • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content: 'Indeks kepuasan masyarakat (CSAT) terhadap layanan pengaduan SI-WADAY Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await requireAuth(request);

  // Role guard: Only admin can access satisfaction survey tab
  if (authResult.user.role !== 'admin') {
    throw redirect('/dashboard');
  }

  const payload = { currentUser: authResult.user };
  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export default function SatisfactionPage() {
  return <SatisfactionTab tickets={MOCK_ADMIN_TICKETS} />;
}

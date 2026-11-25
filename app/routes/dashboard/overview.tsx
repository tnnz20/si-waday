import { requireAuth } from '@/lib/session.server';
import { getDashboardOverviewStats } from '@/lib/ticket.server';

import { OverviewSkeleton } from '@/components/dashboard/admin/dashboard-skeletons';
import { OverviewTab } from '@/components/dashboard/admin/overview-tab';

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
  const stats = await getDashboardOverviewStats(authResult.user);

  const payload = {
    currentUser: authResult.user,
    stats,
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export function HydrateFallback() {
  return <OverviewSkeleton />;
}

export default function OverviewPage({ loaderData }: Route.ComponentProps) {
  return <OverviewTab stats={loaderData.stats} currentUser={loaderData.currentUser} />;
}

import { redirect } from 'react-router';
import { getCsatAnalytics, getPaginatedCsatReviews } from '~/lib/ticket.server';

import { requireAuth } from '@/lib/session.server';

import { SatisfactionSkeleton } from '@/components/dashboard/admin/dashboard-skeletons';
import { SatisfactionTab } from '@/components/dashboard/admin/satisfaction-tab';

import type { Route } from './+types/satisfaction';

const DEFAULT_PAGE_SIZE = 6;

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

  const url = new URL(request.url);
  const rawPage = Number(url.searchParams.get('page') || '1');

  const [analytics, paginatedReviews] = await Promise.all([
    getCsatAnalytics(),
    getPaginatedCsatReviews(rawPage, DEFAULT_PAGE_SIZE),
  ]);

  const payload = {
    currentUser: authResult.user,
    analytics,
    reviews: paginatedReviews.items,
    pagination: {
      currentPage: paginatedReviews.currentPage,
      totalPages: paginatedReviews.totalPages,
      totalItems: paginatedReviews.totalItems,
      pageSize: paginatedReviews.pageSize,
    },
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export function HydrateFallback() {
  return <SatisfactionSkeleton />;
}

export default function SatisfactionPage({ loaderData }: Route.ComponentProps) {
  return (
    <SatisfactionTab
      analytics={loaderData.analytics}
      reviews={loaderData.reviews}
      pagination={loaderData.pagination}
    />
  );
}

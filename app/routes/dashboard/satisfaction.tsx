import { desc, eq } from 'drizzle-orm';
import { redirect } from 'react-router';
import { db } from '~/db/index.server';
import { ticketFeedbacks, tickets } from '~/db/schema/schema';
import { getCsatAnalytics } from '~/lib/ticket.server';

import { requireAuth } from '@/lib/session.server';

import {
  type CsatReviewItem,
  SatisfactionTab,
} from '@/components/dashboard/admin/satisfaction-tab';

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

  const analytics = await getCsatAnalytics();

  const reviewsQuery = await db
    .select({
      id: ticketFeedbacks.id,
      ticketNumber: tickets.ticketNumber,
      type: ticketFeedbacks.type,
      reporterName: tickets.reporterName,
      kecamatan: tickets.kecamatan,
      rating: ticketFeedbacks.rating,
      aspects: ticketFeedbacks.aspects,
      feedback: ticketFeedbacks.feedback,
      createdAt: ticketFeedbacks.createdAt,
    })
    .from(ticketFeedbacks)
    .innerJoin(tickets, eq(ticketFeedbacks.ticketId, tickets.id))
    .orderBy(desc(ticketFeedbacks.createdAt))
    .limit(50);

  const reviews: CsatReviewItem[] = reviewsQuery.map((r) => ({
    id: r.id,
    ticketNumber: r.ticketNumber,
    type: r.type,
    reporterName: r.reporterName,
    kecamatan: r.kecamatan,
    rating: r.rating,
    aspects: r.aspects,
    feedback: r.feedback,
    createdAt: r.createdAt.toISOString(),
  }));

  const payload = {
    currentUser: authResult.user,
    analytics,
    reviews,
  };

  if (authResult.headers) {
    return Response.json(payload, { headers: authResult.headers });
  }

  return payload;
}

export default function SatisfactionPage({ loaderData }: Route.ComponentProps) {
  return <SatisfactionTab analytics={loaderData.analytics} reviews={loaderData.reviews} />;
}

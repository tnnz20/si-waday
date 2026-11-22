import { desc, eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import { db } from '~/db/index.server';
import {
  type FeedbackType,
  type NewTicket,
  type Ticket,
  type TicketDbStatus,
  type TicketFeedback,
  type TicketType,
  ticketFeedbacks,
  tickets,
} from '~/db/schema/schema';
import { surveySchema } from '~/schema/form';
import type { AppSatisfactionRating } from '~/types/aspiration';

/**
 * Generate a citizen ticket tracking code.
 * Format:
 * - Aspirasi: ASP-YYYY-XXXX (e.g. ASP-2026-9081)
 * - Pengaduan: ADU-YYYY-XXXX (e.g. ADU-2026-1024)
 */
export function generateTicketNumber(type: TicketType): string {
  const prefix = type === 'dapil' ? 'ASP' : 'ADU';
  const year = new Date().getFullYear();
  const randomSuffix = crypto.randomInt(1000, 10000);
  return `${prefix}-${year}-${randomSuffix}`;
}

export type CreateTicketInput = Omit<
  NewTicket,
  'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'
> & {
  ticketNumber?: string;
};

/**
 * Create a new ticket with automatic collision retry on ticketNumber.
 */
export async function createTicket(data: CreateTicketInput): Promise<Ticket> {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const ticketNumber = data.ticketNumber || generateTicketNumber(data.type);

    try {
      const [newTicket] = await db
        .insert(tickets)
        .values({
          ...data,
          ticketNumber,
        })
        .returning();

      return newTicket;
    } catch (error: unknown) {
      // Check for PostgreSQL unique constraint violation (code 23505)
      const isUniqueViolation =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === '23505';

      if (isUniqueViolation && attempt < maxRetries) {
        // Regenerate number on next loop iteration
        data = { ...data, ticketNumber: undefined };
        continue;
      }

      throw error;
    }
  }

  throw new Error('Gagal menghasilkan nomor tiket unik setelah beberapa percobaan.');
}

/**
 * Find a single ticket by its official ticket number with related representative and assigned admin.
 * Zero N+1 query via Drizzle ORM relational queries.
 */
export async function getTicketByNumber(ticketNumber: string) {
  return await db.query.tickets.findFirst({
    where: eq(tickets.ticketNumber, ticketNumber),
    with: {
      representative: {
        columns: {
          id: true,
          fullName: true,
          party: true,
          position: true,
          avatarUrl: true,
        },
      },
      assignedTo: {
        columns: {
          id: true,
          email: true,
        },
      },
    },
  });
}

export interface CsatAspectStat {
  name: string;
  count: number;
  percentage: number;
}

export interface CsatDistributionStat {
  star: number;
  count: number;
  percentage: number;
}

export interface CsatAnalyticsResult {
  averageRating: number;
  totalReviews: number;
  distribution: CsatDistributionStat[];
  aspectRatings: CsatAspectStat[];
}

/**
 * Submit citizen satisfaction survey (Indeks Kepuasan Masyarakat) for a ticket.
 */
export async function submitTicketSatisfaction(
  ticketNumber: string,
  survey: AppSatisfactionRating,
  type: FeedbackType = 'submission'
): Promise<TicketFeedback> {
  const ticket = await getTicketByNumber(ticketNumber);
  if (!ticket) {
    throw new Error(`Tiket dengan nomor ${ticketNumber} tidak ditemukan.`);
  }

  const [feedback] = await db
    .insert(ticketFeedbacks)
    .values({
      ticketId: ticket.id,
      type,
      rating: survey.rating,
      aspects: survey.aspects,
      feedback: survey.feedback || null,
    })
    .returning();

  return feedback;
}

/**
 * Retrieve all feedback reviews for a specific ticket.
 */
export async function getTicketFeedbacks(ticketId: string): Promise<TicketFeedback[]> {
  return await db
    .select()
    .from(ticketFeedbacks)
    .where(eq(ticketFeedbacks.ticketId, ticketId))
    .orderBy(desc(ticketFeedbacks.createdAt));
}

/**
 * Aggregate CSAT analytics (average score, star distribution, and popular aspects).
 */
export async function getCsatAnalytics(): Promise<CsatAnalyticsResult> {
  const allReviews = await db
    .select({
      rating: ticketFeedbacks.rating,
      aspects: ticketFeedbacks.aspects,
    })
    .from(ticketFeedbacks);

  const totalReviews = allReviews.length;
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percentage: 0 })),
      aspectRatings: [],
    };
  }

  // 1. Average Rating
  const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = Number((sum / totalReviews).toFixed(1));

  // 2. Star Distribution (5 down to 1)
  const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of allReviews) {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  }

  const distribution: CsatDistributionStat[] = [5, 4, 3, 2, 1].map((star) => {
    const count = starCounts[star] || 0;
    return {
      star,
      count,
      percentage: Math.round((count / totalReviews) * 100),
    };
  });

  // 3. Aspect frequencies
  const aspectCounts: Record<string, number> = {};
  for (const r of allReviews) {
    for (const a of r.aspects) {
      aspectCounts[a] = (aspectCounts[a] || 0) + 1;
    }
  }

  const aspectRatings: CsatAspectStat[] = Object.entries(aspectCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalReviews) * 100),
    }));

  return {
    averageRating,
    totalReviews,
    distribution,
    aspectRatings,
  };
}

/**
 * Update ticket workflow status and admin notes.
 */
export async function updateTicketStatus(
  ticketNumber: string,
  status: TicketDbStatus,
  adminNotes?: string,
  assignedToUserId?: string
): Promise<Ticket | null> {
  const updateData: Partial<NewTicket> = {
    status,
    updatedAt: new Date(),
  };

  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }

  if (assignedToUserId !== undefined) {
    updateData.assignedToUserId = assignedToUserId;
  }

  if (status === 'selesai' || status === 'ditolak') {
    updateData.resolvedAt = new Date();
  }

  const [updated] = await db
    .update(tickets)
    .set(updateData)
    .where(eq(tickets.ticketNumber, ticketNumber))
    .returning();

  return updated ?? null;
}

/**
 * Handle citizen satisfaction survey action directly from FormData.
 */
export async function handleSurveyAction(formData: FormData): Promise<Response> {
  const ticketNumber = String(formData.get('ticketNumber') || '');
  const rating = Number(formData.get('rating') || 5);
  const feedback = String(formData.get('feedback') || '');
  let aspects: string[];
  try {
    aspects = JSON.parse(String(formData.get('aspects') || '[]'));
  } catch {
    aspects = [];
  }

  const parsed = surveySchema.safeParse({ ticketNumber, rating, aspects, feedback });
  if (!parsed.success) {
    return Response.json(
      { success: false, error: 'Data survei kepuasan tidak valid.' },
      { status: 400 }
    );
  }

  await submitTicketSatisfaction(parsed.data.ticketNumber, {
    rating: parsed.data.rating,
    aspects: parsed.data.aspects,
    feedback: parsed.data.feedback || '',
  });

  return Response.json({ success: true });
}

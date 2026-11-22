import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import { db } from '~/db/index.server';
import {
  type NewTicket,
  type Ticket,
  type TicketDbStatus,
  type TicketType,
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

/**
 * Submit citizen satisfaction survey (Indeks Kepuasan Masyarakat) for a ticket.
 */
export async function submitTicketSatisfaction(
  ticketNumber: string,
  survey: AppSatisfactionRating
): Promise<Ticket | null> {
  const [updated] = await db
    .update(tickets)
    .set({
      satisfactionRating: survey.rating,
      satisfactionAspects: survey.aspects,
      satisfactionFeedback: survey.feedback,
      updatedAt: new Date(),
    })
    .where(eq(tickets.ticketNumber, ticketNumber))
    .returning();

  return updated ?? null;
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

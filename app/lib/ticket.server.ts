import { type SQL, and, count, desc, eq, gte, isNotNull, ne, sql } from 'drizzle-orm';
import crypto from 'node:crypto';
import {
  ADMIN_STATUS_META,
  type DashboardOverviewStats,
  type DashboardTicketItem,
  type HighlightedFeedbackItem,
  type KecamatanStatItem,
  type TicketDetailItem,
  normalizeKecamatanName,
} from '~/constants/admin-data';
import { DAPIL_TAPIN_LIST } from '~/constants/tapin';
import { db } from '~/db/index.server';
import {
  type FeedbackType,
  type NewTicket,
  type Ticket,
  type TicketDbStatus,
  type TicketFeedback,
  type TicketType,
  auditLogs,
  regions,
  ticketFeedbacks,
  tickets,
  userProfiles,
} from '~/db/schema/schema';
import { createAuditLog } from '~/lib/audit.server';
import type { AuthUserPayload } from '~/lib/auth.server';
import { requireAuth } from '~/lib/session.server';
import { flattenZodFieldErrors, surveySchema } from '~/schema/form';
import { updateTicketStatusSchema } from '~/schema/ticket';
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

export interface PublicTicketDto {
  ticketNumber: string;
  type: TicketType;
  reporterName: string;
  maskedNik: string;
  title: string | null;
  kamusUsulan: string | null;
  agency: string | null;
  dapilId: string | null;
  kecamatan: string;
  kelurahan: string;
  status: TicketDbStatus;
  adminNotes: string | null;
  createdAt: string;
  representative: {
    fullName: string;
    party: string | null;
    position: string | null;
  } | null;
}

/**
 * Mask citizen 16-digit NIK for public tracking and registration receipts.
 */
export function maskNik(nik: string): string {
  if (nik.length < 10) return nik;
  return `${nik.slice(0, 6)}******${nik.slice(-4)}`;
}

async function findPublicTicketRow(ticketNumber: string) {
  return db.query.tickets.findFirst({
    where: eq(tickets.ticketNumber, ticketNumber),
    columns: {
      id: true,
      ticketNumber: true,
      type: true,
      reporterName: true,
      reporterNik: true,
      title: true,
      kamusUsulan: true,
      agency: true,
      dapilId: true,
      kecamatan: true,
      kelurahan: true,
      status: true,
      adminNotes: true,
      createdAt: true,
    },
    with: {
      representative: {
        columns: {
          fullName: true,
          party: true,
          position: true,
        },
      },
    },
  });
}

function toPublicTicketDto(
  row: NonNullable<Awaited<ReturnType<typeof findPublicTicketRow>>>
): PublicTicketDto {
  return {
    ticketNumber: row.ticketNumber,
    type: row.type,
    reporterName: row.reporterName,
    maskedNik: maskNik(row.reporterNik),
    title: row.title,
    kamusUsulan: row.kamusUsulan,
    agency: row.agency,
    dapilId: row.dapilId,
    kecamatan: row.kecamatan,
    kelurahan: row.kelurahan,
    status: row.status,
    adminNotes: row.adminNotes,
    createdAt: row.createdAt.toISOString(),
    representative: row.representative,
  };
}

/**
 * Public-safe ticket lookup excluding reporter contact details, KTP URL, and internal staff fields.
 */
export async function getPublicTicketByNumber(
  ticketNumber: string
): Promise<PublicTicketDto | null> {
  const row = await findPublicTicketRow(ticketNumber);
  return row ? toPublicTicketDto(row) : null;
}

/**
 * Public-safe ticket + initial feedback lookup for citizen registration receipt page.
 */
export async function getPublicTicketWithFeedback(ticketNumber: string): Promise<{
  ticket: PublicTicketDto;
  feedback: TicketFeedback | null;
} | null> {
  const row = await findPublicTicketRow(ticketNumber);
  if (!row) return null;

  const feedbacks = await getTicketFeedbacks(row.id);
  const submissionFeedback = feedbacks.find((f) => f.type === 'submission');
  return {
    ticket: toPublicTicketDto(row),
    feedback: submissionFeedback ?? feedbacks[0] ?? null,
  };
}

/**
 * Find a full ticket record (including citizen PII) for internal/admin server workflows and tests.
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
  satisfactionPercentage: number;
  distribution: CsatDistributionStat[];
  aspectRatings: CsatAspectStat[];
}

export interface CsatReviewRow {
  id: string;
  ticketNumber: string;
  type: FeedbackType;
  reporterName: string;
  kecamatan: string;
  rating: number;
  aspects: string[];
  feedback: string | null;
  createdAt: string;
}

export interface PaginatedCsatReviewsResult {
  items: CsatReviewRow[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Submit citizen satisfaction survey (Indeks Kepuasan Masyarakat) for a ticket.
 */
export async function submitTicketSatisfaction(
  ticketNumber: string,
  survey: AppSatisfactionRating,
  type: FeedbackType = 'submission'
): Promise<TicketFeedback> {
  const [ticket] = await db
    .select({ id: tickets.id })
    .from(tickets)
    .where(eq(tickets.ticketNumber, ticketNumber))
    .limit(1);

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
export async function getCsatAnalytics(scopeWhere?: SQL): Promise<CsatAnalyticsResult> {
  const allReviews = scopeWhere
    ? await db
        .select({
          rating: ticketFeedbacks.rating,
          aspects: ticketFeedbacks.aspects,
        })
        .from(ticketFeedbacks)
        .innerJoin(tickets, eq(ticketFeedbacks.ticketId, tickets.id))
        .where(scopeWhere)
    : await db
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
      satisfactionPercentage: 0,
      distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percentage: 0 })),
      aspectRatings: [],
    };
  }

  // 1. Average Rating & Satisfaction Percentage (rating >= 4)
  const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = Number((sum / totalReviews).toFixed(1));
  const satisfiedCount = allReviews.filter((r) => r.rating >= 4).length;
  const satisfactionPercentage = Number(((satisfiedCount / totalReviews) * 100).toFixed(1));

  // 2. Star Distribution (5 down to 1)
  const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of allReviews) {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  }

  const distribution: CsatDistributionStat[] = [5, 4, 3, 2, 1].map((star) => {
    const countValue = starCounts[star] || 0;
    return {
      star,
      count: countValue,
      percentage: Math.round((countValue / totalReviews) * 100),
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
    .map(([name, itemCount]) => ({
      name,
      count: itemCount,
      percentage: Math.round((itemCount / totalReviews) * 100),
    }));

  return {
    averageRating,
    totalReviews,
    satisfactionPercentage,
    distribution,
    aspectRatings,
  };
}

/**
 * Resolve friendly Dapil display label from dapilId or joined region name.
 */
function resolveDapilName(dapilId: string | null, regionName?: string | null): string | null {
  if (regionName) return regionName;
  if (!dapilId) return null;
  const normalized = dapilId.toUpperCase();
  const matched = DAPIL_TAPIN_LIST.find(
    (d) =>
      d.id === normalized ||
      (normalized === 'DAPIL-1' && d.id === 'DAPIL-TAPIN-1') ||
      (normalized === 'DAPIL-2' && d.id === 'DAPIL-TAPIN-2') ||
      (normalized === 'DAPIL-3' && d.id === 'DAPIL-TAPIN-3')
  );
  return matched ? matched.name : dapilId;
}

/**
 * Resolve SQL scope predicate for non-admin dashboard roles so legislators and
 * regional moderators only access constituent aspirations within their assignment.
 */
async function resolveUserTicketScope(user?: AuthUserPayload): Promise<SQL | undefined> {
  if (!user || user.role === 'admin') {
    return undefined;
  }

  if (user.role === 'dprd' || user.role === 'dpr') {
    const [profile] = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (!profile) {
      return sql`false`;
    }
    return and(eq(tickets.type, 'dapil'), eq(tickets.representativeId, profile.id));
  }

  if (user.role === 'moderator') {
    if (!user.regionId) {
      return sql`false`;
    }

    const [region] = await db
      .select({ code: regions.code })
      .from(regions)
      .where(eq(regions.id, user.regionId))
      .limit(1);

    if (!region?.code) {
      return sql`false`;
    }

    return and(eq(tickets.type, 'dapil'), eq(tickets.dapilId, region.code));
  }

  return sql`false`;
}

function combineConditions(...conditions: Array<SQL | undefined>): SQL | undefined {
  const active = conditions.filter((c): c is SQL => c !== undefined);
  if (active.length === 0) return undefined;
  if (active.length === 1) return active[0];
  return and(...active);
}

/**
 * Query real tickets from PostgreSQL for dashboard lists and recent feeds.
 */
export async function getDashboardTickets(options?: {
  type?: TicketType;
  user?: AuthUserPayload;
  limit?: number;
}): Promise<DashboardTicketItem[]> {
  const scopeWhere = await resolveUserTicketScope(options?.user);
  const typeWhere = options?.type ? eq(tickets.type, options.type) : undefined;
  const whereClause = combineConditions(scopeWhere, typeWhere);

  const baseQuery = db
    .select({
      id: tickets.id,
      ticketNumber: tickets.ticketNumber,
      type: tickets.type,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      reporterName: tickets.reporterName,
      reporterNik: tickets.reporterNik,
      kecamatan: tickets.kecamatan,
      kelurahan: tickets.kelurahan,
      dapilId: tickets.dapilId,
      kamusUsulan: tickets.kamusUsulan,
      agency: tickets.agency,
      category: tickets.category,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      repName: userProfiles.fullName,
      repParty: userProfiles.party,
      repCommission: userProfiles.commission,
      repRegionName: regions.name,
    })
    .from(tickets)
    .leftJoin(userProfiles, eq(tickets.representativeId, userProfiles.id))
    .leftJoin(regions, eq(userProfiles.regionId, regions.id))
    .where(whereClause)
    .orderBy(desc(tickets.createdAt));

  const rows = options?.limit ? await baseQuery.limit(options.limit) : await baseQuery;

  return rows.map((row) => {
    const isDapil = row.type === 'dapil';
    const resolvedDapilName = isDapil ? resolveDapilName(row.dapilId, row.repRegionName) : null;
    const title =
      row.title || (isDapil ? row.kamusUsulan : row.category) || `Tiket ${row.ticketNumber}`;

    return {
      id: row.id,
      ticketNumber: row.ticketNumber,
      type: row.type,
      title,
      description: row.description,
      status: row.status,
      reporterName: row.reporterName,
      maskedNik: maskNik(row.reporterNik),
      kecamatan: normalizeKecamatanName(row.kecamatan),
      kelurahan: row.kelurahan,
      targetDestination: isDapil
        ? row.repName || resolvedDapilName || 'Perwakilan DPRD Tapin'
        : row.agency || 'Sekretariat DPRD Kab. Tapin',
      categoryOrKamus: isDapil
        ? row.kamusUsulan || row.title || 'Usulan Pokir DPRD'
        : row.category || 'Pengaduan Umum',
      dapilId: row.dapilId,
      dapilName: resolvedDapilName,
      partyOrCommission: isDapil ? row.repParty || row.repCommission || null : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  });
}

/**
 * Query live KPI aggregations, regional distribution, SLA hours, recent tickets,
 * and CSAT highlight from PostgreSQL for /dashboard.
 */
export async function getDashboardOverviewStats(
  user?: AuthUserPayload
): Promise<DashboardOverviewStats> {
  const scopeWhere = await resolveUserTicketScope(user);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [summaryRow] = await db
    .select({
      totalTickets: count(),
      totalComplaints: sql<number>`coalesce(sum(case when ${tickets.type} = 'masyarakat' then 1 else 0 end), 0)::int`,
      totalAspirations: sql<number>`coalesce(sum(case when ${tickets.type} = 'dapil' then 1 else 0 end), 0)::int`,
      pendingVerificationCount: sql<number>`coalesce(sum(case when ${tickets.status} = 'menunggu_verifikasi' then 1 else 0 end), 0)::int`,
      verifiedCount: sql<number>`coalesce(sum(case when ${tickets.status} = 'terverifikasi' then 1 else 0 end), 0)::int`,
      inProgressCount: sql<number>`coalesce(sum(case when ${tickets.status} = 'sedang_diproses' then 1 else 0 end), 0)::int`,
      completedCount: sql<number>`coalesce(sum(case when ${tickets.status} = 'selesai' then 1 else 0 end), 0)::int`,
      rejectedCount: sql<number>`coalesce(sum(case when ${tickets.status} = 'ditolak' then 1 else 0 end), 0)::int`,
      monthlyTicketsCount: sql<number>`coalesce(sum(case when ${gte(tickets.createdAt, startOfMonth)} then 1 else 0 end), 0)::int`,
      avgResponseHours: sql<
        number | null
      >`avg(case when ${ne(tickets.status, 'menunggu_verifikasi')} then greatest(0, extract(epoch from (coalesce(${tickets.resolvedAt}, ${tickets.updatedAt}) - ${tickets.createdAt})) / 3600.0) else null end)::float`,
    })
    .from(tickets)
    .where(scopeWhere);

  const totalTickets = Number(summaryRow?.totalTickets ?? 0);
  const completedCount = Number(summaryRow?.completedCount ?? 0);
  const resolutionRate = totalTickets > 0 ? Math.round((completedCount / totalTickets) * 100) : 0;
  const averageResponseHours =
    summaryRow?.avgResponseHours !== null && summaryRow?.avgResponseHours !== undefined
      ? Number(Number(summaryRow.avgResponseHours).toFixed(1))
      : null;

  const kecamatanRows = await db
    .select({
      name: tickets.kecamatan,
      count: count(),
    })
    .from(tickets)
    .where(scopeWhere)
    .groupBy(tickets.kecamatan)
    .orderBy(desc(count()));

  const normalizedDistrictMap = new Map<string, { name: string; count: number }>();
  for (const row of kecamatanRows) {
    const canonicalName = normalizeKecamatanName(row.name);
    if (!canonicalName) continue;
    const lowerKey = canonicalName.toLowerCase();
    const existing = normalizedDistrictMap.get(lowerKey);
    if (existing) {
      existing.count += Number(row.count);
    } else {
      normalizedDistrictMap.set(lowerKey, {
        name: canonicalName,
        count: Number(row.count),
      });
    }
  }

  const sortedDistricts = Array.from(normalizedDistrictMap.values()).sort(
    (a, b) => b.count - a.count
  );

  const topDistricts = sortedDistricts.slice(0, 4);
  const otherDistrictsCount = sortedDistricts.slice(4).reduce((acc, row) => acc + row.count, 0);

  if (otherDistrictsCount > 0) {
    topDistricts.push({ name: 'Kecamatan Lainnya', count: otherDistrictsCount });
  }

  const kecamatanDistribution: KecamatanStatItem[] = topDistricts.map((item) => ({
    name: item.name,
    count: item.count,
    percentage: totalTickets > 0 ? Math.round((item.count / totalTickets) * 100) : 0,
  }));

  const [csat, recentTickets, highlightRows] = await Promise.all([
    getCsatAnalytics(scopeWhere),
    getDashboardTickets({ user, limit: 5 }),
    db
      .select({
        id: ticketFeedbacks.id,
        ticketNumber: tickets.ticketNumber,
        type: tickets.type,
        reporterName: tickets.reporterName,
        kecamatan: tickets.kecamatan,
        rating: ticketFeedbacks.rating,
        feedback: ticketFeedbacks.feedback,
        createdAt: ticketFeedbacks.createdAt,
      })
      .from(ticketFeedbacks)
      .innerJoin(tickets, eq(ticketFeedbacks.ticketId, tickets.id))
      .where(
        combineConditions(
          scopeWhere,
          isNotNull(ticketFeedbacks.feedback),
          sql`length(trim(${ticketFeedbacks.feedback})) > 0`
        )
      )
      .orderBy(desc(ticketFeedbacks.rating), desc(ticketFeedbacks.createdAt))
      .limit(1),
  ]);

  const topQuote = highlightRows[0];
  const highlightedFeedback: HighlightedFeedbackItem | null =
    topQuote && topQuote.feedback
      ? {
          id: topQuote.id,
          ticketNumber: topQuote.ticketNumber,
          type: topQuote.type,
          reporterName: topQuote.reporterName,
          kecamatan: topQuote.kecamatan,
          rating: topQuote.rating,
          feedback: topQuote.feedback,
          createdAt: topQuote.createdAt.toISOString(),
        }
      : null;

  return {
    totalTickets,
    totalComplaints: Number(summaryRow?.totalComplaints ?? 0),
    totalAspirations: Number(summaryRow?.totalAspirations ?? 0),
    pendingVerificationCount: Number(summaryRow?.pendingVerificationCount ?? 0),
    verifiedCount: Number(summaryRow?.verifiedCount ?? 0),
    inProgressCount: Number(summaryRow?.inProgressCount ?? 0),
    completedCount,
    rejectedCount: Number(summaryRow?.rejectedCount ?? 0),
    monthlyTicketsCount: Number(summaryRow?.monthlyTicketsCount ?? 0),
    resolutionRate,
    averageResponseHours,
    csat: {
      averageRating: csat.averageRating,
      totalReviews: csat.totalReviews,
      satisfactionPercentage: csat.satisfactionPercentage,
    },
    kecamatanDistribution,
    highlightedFeedback,
    recentTickets,
  };
}

/**
 * Retrieve complete ticket detail, citizen feedbacks, and audit history for
 * authenticated dashboard detail routes.
 */
export async function getAdminTicketDetail(
  ticketNumber: string,
  expectedType?: TicketType,
  user?: AuthUserPayload
): Promise<TicketDetailItem | null> {
  const scopeWhere = await resolveUserTicketScope(user);
  const typeWhere = expectedType ? eq(tickets.type, expectedType) : undefined;
  const whereClause = combineConditions(
    eq(tickets.ticketNumber, ticketNumber),
    typeWhere,
    scopeWhere
  );

  const row = await db.query.tickets.findFirst({
    where: whereClause,
    with: {
      representative: {
        columns: {
          id: true,
          fullName: true,
          slug: true,
          party: true,
          commission: true,
        },
        with: {
          region: {
            columns: {
              name: true,
            },
          },
        },
      },
      assignedTo: {
        columns: {
          id: true,
          email: true,
        },
        with: {
          profile: {
            columns: {
              fullName: true,
            },
          },
        },
      },
      feedbacks: {
        orderBy: [desc(ticketFeedbacks.createdAt)],
      },
    },
  });

  if (!row) {
    return null;
  }

  const rawAuditLogs = await db
    .select({
      id: auditLogs.id,
      actorName: auditLogs.actorName,
      actorRole: auditLogs.actorRole,
      action: auditLogs.action,
      description: auditLogs.description,
      details: auditLogs.details,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(and(eq(auditLogs.entityType, 'ticket'), eq(auditLogs.entityId, row.ticketNumber)))
    .orderBy(desc(auditLogs.createdAt))
    .limit(30);

  const isDapil = row.type === 'dapil';
  const resolvedDapilName = isDapil
    ? resolveDapilName(row.dapilId, row.representative?.region?.name)
    : null;

  return {
    id: row.id,
    ticketNumber: row.ticketNumber,
    type: row.type,
    title: row.title || (isDapil ? row.kamusUsulan : row.category) || `Tiket ${row.ticketNumber}`,
    description: row.description,
    status: row.status,
    adminNotes: row.adminNotes,
    assignedToName: row.assignedTo?.profile?.fullName || null,
    assignedToEmail: row.assignedTo?.email || null,
    reporter: {
      name: row.reporterName,
      nik: row.reporterNik,
      phone: row.reporterPhone,
      email: row.reporterEmail,
      address: row.reporterAddress,
      idCardUrl: row.idCardUrl,
    },
    location: {
      kabupaten: row.kabupaten,
      kecamatan: row.kecamatan,
      kelurahan: row.kelurahan,
      alamatLokasi: row.alamatLokasi,
      latitude: row.latitude,
      longitude: row.longitude,
    },
    representative: row.representative
      ? {
          id: row.representative.id,
          fullName: row.representative.fullName,
          slug: row.representative.slug,
          party: row.representative.party,
          commission: row.representative.commission,
          dapilName: row.representative.region?.name || resolvedDapilName,
        }
      : null,
    dapilId: row.dapilId,
    dapilName: resolvedDapilName,
    kamusUsulan: row.kamusUsulan,
    agency: row.agency,
    category: row.category,
    photos: row.photos || [],
    documentUrl: row.documentUrl,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    resolvedAt: row.resolvedAt ? row.resolvedAt.toISOString() : null,
    feedbacks: row.feedbacks.map((fb) => ({
      id: fb.id,
      type: fb.type,
      rating: fb.rating,
      aspects: fb.aspects || [],
      feedback: fb.feedback,
      createdAt: fb.createdAt.toISOString(),
    })),
    auditLogs: rawAuditLogs.map((log) => ({
      id: log.id,
      actorName: log.actorName,
      actorRole: log.actorRole,
      action: log.action,
      description: log.description,
      details: (log.details as Record<string, unknown>) || null,
      createdAt: log.createdAt.toISOString(),
    })),
  };
}

/**
 * Retrieve paginated citizen satisfaction reviews from PostgreSQL (default 6 per page).
 */
export async function getPaginatedCsatReviews(
  requestedPage = 1,
  pageSize = 6
): Promise<PaginatedCsatReviewsResult> {
  const normalizedPageSize = Math.max(1, Math.floor(pageSize));

  const [countRow] = await db
    .select({ total: count() })
    .from(ticketFeedbacks)
    .innerJoin(tickets, eq(ticketFeedbacks.ticketId, tickets.id));

  const totalItems = Number(countRow?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedPageSize));
  const rawPage = Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1;
  const currentPage = Math.min(Math.max(1, rawPage), totalPages);
  const offset = (currentPage - 1) * normalizedPageSize;

  const rows =
    totalItems === 0
      ? []
      : await db
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
          .limit(normalizedPageSize)
          .offset(offset);

  return {
    items: rows.map((r) => ({
      id: r.id,
      ticketNumber: r.ticketNumber,
      type: r.type,
      reporterName: r.reporterName,
      kecamatan: r.kecamatan,
      rating: r.rating,
      aspects: r.aspects,
      feedback: r.feedback,
      createdAt: r.createdAt.toISOString(),
    })),
    totalItems,
    totalPages: totalItems === 0 ? 0 : totalPages,
    currentPage,
    pageSize: normalizedPageSize,
  };
}

/**
 * Update ticket workflow status and admin notes.
 */
export async function updateTicketStatus(
  ticketNumber: string,
  status: TicketDbStatus,
  adminNotes?: string,
  assignedToUserId?: string,
  options?: { existingResolvedAt?: Date | null }
): Promise<Ticket | null> {
  const isTerminalStatus = status === 'selesai' || status === 'ditolak';

  let existingResolvedAt = options?.existingResolvedAt;
  if (isTerminalStatus && existingResolvedAt === undefined) {
    const [current] = await db
      .select({ resolvedAt: tickets.resolvedAt })
      .from(tickets)
      .where(eq(tickets.ticketNumber, ticketNumber))
      .limit(1);
    existingResolvedAt = current?.resolvedAt ?? null;
  }

  const updateData: Partial<NewTicket> = {
    status,
    updatedAt: new Date(),
    resolvedAt: isTerminalStatus ? (existingResolvedAt ?? new Date()) : null,
  };

  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }

  if (assignedToUserId !== undefined) {
    updateData.assignedToUserId = assignedToUserId;
  }

  const [updated] = await db
    .update(tickets)
    .set(updateData)
    .where(eq(tickets.ticketNumber, ticketNumber))
    .returning();

  return updated ?? null;
}

/**
 * Authenticated dashboard route action to validate and persist ticket status & notes updates
 * alongside an audit log record.
 */
export async function handleTicketStatusUpdateAction(
  request: Request,
  ticketNumber: string,
  expectedType?: TicketType
): Promise<Response> {
  const authResult = await requireAuth(request);

  if (expectedType === 'masyarakat' && authResult.user.role !== 'admin') {
    return Response.json({ success: false, error: 'Akses ditolak.' }, { status: 403 });
  }

  const existing = await getAdminTicketDetail(ticketNumber, expectedType, authResult.user);
  if (!existing) {
    return Response.json(
      { success: false, error: 'Tiket tidak ditemukan atau Anda tidak memiliki akses.' },
      { status: 404 }
    );
  }

  const formData = await request.formData();
  const parsed = updateTicketStatusSchema.safeParse({
    ticketNumber,
    status: formData.get('status'),
    adminNotes: formData.get('adminNotes') ?? '',
  });

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        error: 'Mohon periksa kembali status dan catatan tindak lanjut.',
        fieldErrors: flattenZodFieldErrors(parsed),
      },
      { status: 400 }
    );
  }

  const nextStatus = parsed.data.status;
  const nextNotes = parsed.data.adminNotes;
  const currentNotes = existing.adminNotes || '';

  if (nextStatus === existing.status && nextNotes === currentNotes) {
    return Response.json({
      success: true,
      message: 'Tidak ada perubahan status atau catatan yang perlu disimpan.',
    });
  }

  const existingResolvedAt = existing.resolvedAt ? new Date(existing.resolvedAt) : null;
  const updated = await updateTicketStatus(
    ticketNumber,
    nextStatus,
    nextNotes,
    authResult.user.id,
    { existingResolvedAt }
  );

  if (!updated) {
    return Response.json(
      { success: false, error: 'Gagal memperbarui status tiket.' },
      { status: 500 }
    );
  }

  await createAuditLog({
    actor: authResult.user,
    action: 'STATUS_CHANGE',
    entityType: 'ticket',
    entityId: ticketNumber,
    targetName: existing.title,
    description: `Memperbarui status tiket ${ticketNumber} ke "${ADMIN_STATUS_META[nextStatus].label}"`,
    details: {
      before: { status: existing.status, adminNotes: existing.adminNotes || '' },
      after: { status: nextStatus, adminNotes: nextNotes },
    },
  });

  return Response.json({
    success: true,
    message: `Tiket ${ticketNumber} berhasil diperbarui ke status ${ADMIN_STATUS_META[nextStatus].label}.`,
  });
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

  try {
    await submitTicketSatisfaction(parsed.data.ticketNumber, {
      rating: parsed.data.rating,
      aspects: parsed.data.aspects,
      feedback: parsed.data.feedback || '',
    });

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isNotFound = message.includes('tidak ditemukan');
    if (!isNotFound) {
      console.error('Failed to submit citizen satisfaction survey:', error);
    }

    return Response.json(
      {
        success: false,
        error: isNotFound
          ? 'Tiket tidak ditemukan untuk menyimpan survei.'
          : 'Gagal menyimpan penilaian survei. Silakan coba lagi.',
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}

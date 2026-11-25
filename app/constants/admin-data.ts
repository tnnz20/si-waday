import type { FeedbackType, TicketDbStatus, TicketType } from '@/db/schema/schema';

export type AdminTicketType = TicketType;
export type AdminTicketStatus = TicketDbStatus;

export interface DashboardTicketItem {
  id: string;
  ticketNumber: string;
  type: TicketType;
  title: string;
  description: string;
  status: TicketDbStatus;
  reporterName: string;
  maskedNik: string;
  kecamatan: string;
  kelurahan: string;
  targetDestination: string;
  categoryOrKamus: string;
  dapilId: string | null;
  dapilName: string | null;
  partyOrCommission: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KecamatanStatItem {
  name: string;
  count: number;
  percentage: number;
}

export interface HighlightedFeedbackItem {
  id: string;
  ticketNumber: string;
  type: TicketType;
  reporterName: string;
  kecamatan: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface DashboardOverviewStats {
  totalTickets: number;
  totalComplaints: number;
  totalAspirations: number;
  pendingVerificationCount: number;
  verifiedCount: number;
  inProgressCount: number;
  completedCount: number;
  rejectedCount: number;
  monthlyTicketsCount: number;
  resolutionRate: number;
  averageResponseHours: number | null;
  csat: {
    averageRating: number;
    totalReviews: number;
    satisfactionPercentage: number;
  };
  kecamatanDistribution: KecamatanStatItem[];
  highlightedFeedback: HighlightedFeedbackItem | null;
  recentTickets: DashboardTicketItem[];
}

export interface TicketFeedbackViewItem {
  id: string;
  type: FeedbackType;
  rating: number;
  aspects: string[];
  feedback: string | null;
  createdAt: string;
}

export interface TicketAuditLogItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  description: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface TicketDetailItem {
  id: string;
  ticketNumber: string;
  type: TicketType;
  title: string;
  description: string;
  status: TicketDbStatus;
  adminNotes: string | null;
  assignedToName: string | null;
  assignedToEmail: string | null;
  reporter: {
    name: string;
    nik: string;
    phone: string;
    email: string | null;
    address: string;
    idCardUrl: string | null;
  };
  location: {
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
    alamatLokasi: string;
    latitude: number;
    longitude: number;
  };
  representative: {
    id: string;
    fullName: string;
    slug: string;
    party: string | null;
    commission: string | null;
    dapilName: string | null;
  } | null;
  dapilId: string | null;
  dapilName: string | null;
  kamusUsulan: string | null;
  agency: string | null;
  category: string | null;
  photos: string[];
  documentUrl: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  feedbacks: TicketFeedbackViewItem[];
  auditLogs: TicketAuditLogItem[];
}

export const ADMIN_STATUS_META: Record<
  AdminTicketStatus,
  { label: string; shortLabel: string; bg: string; text: string; dot: string }
> = {
  menunggu_verifikasi: {
    label: 'Menunggu Verifikasi',
    shortLabel: 'Menunggu',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  terverifikasi: {
    label: 'Terverifikasi',
    shortLabel: 'Terverifikasi',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  sedang_diproses: {
    label: 'Sedang Diproses',
    shortLabel: 'Diproses',
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-800',
    dot: 'bg-purple-500',
  },
  selesai: {
    label: 'Selesai Ditindaklanjuti',
    shortLabel: 'Selesai',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  ditolak: {
    label: 'Ditolak / Tidak Memenuhi Syarat',
    shortLabel: 'Ditolak',
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-800',
    dot: 'bg-rose-500',
  },
};

export function formatIndonesianDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

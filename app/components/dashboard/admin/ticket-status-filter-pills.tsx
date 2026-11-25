import type { AdminTicketStatus } from '@/constants/admin-data';

interface TicketStatusFilterPillsProps {
  value: 'all' | AdminTicketStatus;
  onChange: (value: 'all' | AdminTicketStatus) => void;
  totalCount: number;
  statusCounts: Record<AdminTicketStatus, number>;
}

const STATUS_PILLS: Array<{
  value: 'all' | AdminTicketStatus;
  label: string;
  activeClass: string;
}> = [
  { value: 'all', label: 'Semua', activeClass: 'bg-darknavy-900 text-white shadow-xs' },
  {
    value: 'menunggu_verifikasi',
    label: 'Menunggu',
    activeClass: 'bg-amber-600 text-white shadow-xs',
  },
  {
    value: 'terverifikasi',
    label: 'Terverifikasi',
    activeClass: 'bg-blue-600 text-white shadow-xs',
  },
  {
    value: 'sedang_diproses',
    label: 'Diproses',
    activeClass: 'bg-purple-600 text-white shadow-xs',
  },
  { value: 'selesai', label: 'Selesai', activeClass: 'bg-emerald-600 text-white shadow-xs' },
  { value: 'ditolak', label: 'Ditolak', activeClass: 'bg-rose-600 text-white shadow-xs' },
];

export function TicketStatusFilterPills({
  value,
  onChange,
  totalCount,
  statusCounts,
}: TicketStatusFilterPillsProps) {
  return (
    <div className="border-warm-200 bg-warm-50 text-2xs inline-flex flex-wrap rounded-xl border p-1">
      {STATUS_PILLS.map((pill) => {
        const count = pill.value === 'all' ? totalCount : statusCounts[pill.value];
        const isActive = value === pill.value;

        return (
          <button
            key={pill.value}
            type="button"
            onClick={() => onChange(pill.value)}
            className={`rounded-lg px-2.5 py-1.5 font-bold transition-all ${
              isActive ? pill.activeClass : 'hover:text-darknavy-900 text-slate-600'
            }`}
          >
            {pill.label} ({count})
          </button>
        );
      })}
    </div>
  );
}

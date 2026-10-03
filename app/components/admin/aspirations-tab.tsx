import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ADMIN_STATUS_META, type AdminTicketItem } from '@/constants/admin-data';
import { DAPIL_TAPIN_LIST } from '@/constants/tapin';

import { Eye, Filter, Landmark } from 'lucide-react';

interface AspirationsTabProps {
  tickets: AdminTicketItem[];
  onSelectTicket: (ticket: AdminTicketItem) => void;
  searchQuery: string;
}

export function AspirationsTab({ tickets, onSelectTicket, searchQuery }: AspirationsTabProps) {
  const [dapilFilter, setDapilFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const aspirationTickets = React.useMemo(() => {
    return tickets.filter((t) => t.type === 'dapil');
  }, [tickets]);

  const filteredTickets = React.useMemo(() => {
    return aspirationTickets.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchReporter = item.reporter.name.toLowerCase().includes(q);
        const matchDewan = item.targetDestination.toLowerCase().includes(q);
        const matchKamus = item.categoryOrKamus.toLowerCase().includes(q);
        const matchKec = item.location.kecamatan.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchReporter && !matchDewan && !matchKamus && !matchKec) {
          return false;
        }
      }

      // Dapil Filter
      if (dapilFilter !== 'all' && item.dapilId !== dapilFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [aspirationTickets, searchQuery, dapilFilter, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Top Banner & Filters with shadcn Card */}
      <Card className="soft-card border-warm-200 rounded-3xl border bg-white shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-darknavy-900 flex items-center gap-2.5 text-base font-extrabold sm:text-lg">
                <Landmark className="h-5 w-5 text-emerald-600" />
                <span>Pokok Pikiran (Pokir) & Aspirasi Dapil DPRD Kabupaten Tapin</span>
              </CardTitle>
              <CardDescription className="mt-1 text-xs text-slate-500">
                Total {filteredTickets.length} usulan pokir konstituen terdata untuk 25 anggota
                dewan
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Filter:</span>
              </div>

              {/* Filter Dapil using shadcn Select */}
              <div className="w-[210px]">
                <Select value={dapilFilter} onValueChange={setDapilFilter}>
                  <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-10 rounded-2xl bg-white text-xs font-semibold shadow-2xs sm:text-sm">
                    <SelectValue placeholder="Semua Dapil Tapin" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">Semua Dapil Tapin (1-3)</SelectItem>
                    {DAPIL_TAPIN_LIST.map((dapil) => (
                      <SelectItem key={dapil.id} value={dapil.id}>
                        {dapil.name} ({dapil.seats} Kursi)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Status using shadcn Select */}
              <div className="w-[195px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-10 rounded-2xl bg-white text-xs font-semibold shadow-2xs sm:text-sm">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="terverifikasi">Terverifikasi (Lolos Telaah)</SelectItem>
                    <SelectItem value="sedang_diproses">Sedang Diproses (Musrenbang)</SelectItem>
                    <SelectItem value="selesai">Selesai / Masuk APBD</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Aspirations Table with Comfortable Typography */}
      <Card className="soft-card border-warm-200 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] border-collapse text-left">
              <thead>
                <tr className="border-warm-200 bg-warm-50/80 border-b text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                  <th className="px-5 py-4 whitespace-nowrap sm:px-6">ID Pokir</th>
                  <th className="px-5 py-4 whitespace-nowrap">Pengusul (e-KTP)</th>
                  <th className="px-5 py-4 whitespace-nowrap">Anggota Dewan Dituju</th>
                  <th className="min-w-[280px] px-5 py-4">Kamus Usulan & Perihal</th>
                  <th className="px-5 py-4 whitespace-nowrap">Estimasi Anggaran</th>
                  <th className="px-5 py-4 whitespace-nowrap">Status Pokir</th>
                  <th className="px-5 py-4 text-right whitespace-nowrap sm:px-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-warm-100 divide-y text-xs sm:text-sm">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const status = ADMIN_STATUS_META[ticket.status];

                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                        className="group hover:bg-warm-50/70 cursor-pointer transition-colors"
                      >
                        {/* ID */}
                        <td className="px-5 py-4.5 whitespace-nowrap sm:px-6">
                          <span className="block font-mono text-xs font-bold whitespace-nowrap text-emerald-600 sm:text-sm">
                            {ticket.id}
                          </span>
                          <span className="mt-0.5 block text-xs whitespace-nowrap text-slate-400">
                            {ticket.createdAt}
                          </span>
                        </td>

                        {/* Reporter */}
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <span className="text-darknavy-900 block text-sm font-bold whitespace-nowrap">
                            {ticket.reporter.name}
                          </span>
                          <span className="mt-0.5 block text-xs whitespace-nowrap text-slate-400">
                            Kec. {ticket.location.kecamatan}
                          </span>
                        </td>

                        {/* Dewan */}
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <span className="text-darknavy-900 block text-sm font-bold whitespace-nowrap">
                            {ticket.targetDestination}
                          </span>
                          <Badge
                            variant="secondary"
                            className="mt-1 inline-flex border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-emerald-700"
                          >
                            {ticket.dapilName?.split('(')[0] || 'Dapil Tapin'}
                          </Badge>
                        </td>

                        {/* Kamus Usulan */}
                        <td className="max-w-sm min-w-[280px] px-5 py-4.5">
                          <span className="text-darknavy-900 line-clamp-2 text-sm leading-snug font-bold transition-colors group-hover:text-emerald-700">
                            {ticket.categoryOrKamus}
                          </span>
                          <span className="mt-1 line-clamp-1 text-xs leading-normal text-slate-500">
                            {ticket.title}
                          </span>
                        </td>

                        {/* Budget */}
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <span className="text-accent-600 block font-mono text-sm font-extrabold whitespace-nowrap">
                            {ticket.estimatedBudget || '-'}
                          </span>
                          <span className="mt-0.5 block text-xs whitespace-nowrap text-slate-400">
                            Usulan APBD
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap ${status.bg} ${status.text}`}
                          >
                            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                            <span>{status.label}</span>
                          </Badge>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4.5 text-right whitespace-nowrap sm:px-6">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-warm-300 text-darknavy-900 h-9 gap-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-2xs group-hover:border-emerald-500 group-hover:text-emerald-600"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Detail</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-sm text-slate-400">
                      Tidak ditemukan usulan aspirasi dapil yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

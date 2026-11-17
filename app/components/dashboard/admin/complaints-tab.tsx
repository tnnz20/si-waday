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
import { EXTENDED_AGENCIES } from '@/constants/aspirations';

import { Building2, Eye, Filter } from 'lucide-react';

interface ComplaintsTabProps {
  tickets: AdminTicketItem[];
  onSelectTicket: (ticket: AdminTicketItem) => void;
  searchQuery: string;
}

export function ComplaintsTab({ tickets, onSelectTicket, searchQuery }: ComplaintsTabProps) {
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [agencyFilter, setAgencyFilter] = React.useState<string>('all');

  const complaintTickets = React.useMemo(() => {
    return tickets.filter((t) => t.type === 'masyarakat');
  }, [tickets]);

  const filteredTickets = React.useMemo(() => {
    return complaintTickets.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchReporter = item.reporter.name.toLowerCase().includes(q);
        const matchAgency = item.targetDestination.toLowerCase().includes(q);
        const matchKec = item.location.kecamatan.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchReporter && !matchAgency && !matchKec) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Agency
      if (
        agencyFilter !== 'all' &&
        !item.targetDestination.toLowerCase().includes(agencyFilter.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [complaintTickets, searchQuery, statusFilter, agencyFilter]);

  return (
    <div className="space-y-5">
      {/* Header & Filter Controls with shadcn Card */}
      <Card className="soft-card border-warm-200 rounded-3xl border bg-white shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-darknavy-900 flex items-center gap-2.5 text-base font-extrabold sm:text-lg">
                <Building2 className="text-accent-500 h-5 w-5" />
                <span>Daftar Aduan Pengawasan Komisi DPRD Tapin</span>
              </CardTitle>
              <CardDescription className="mt-1 text-xs text-slate-500">
                Total {filteredTickets.length} aduan aktif dari warga siap ditindaklanjuti
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Filter:</span>
              </div>

              {/* Filter Status using shadcn Select */}
              <div className="w-[185px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-10 rounded-2xl bg-white text-xs font-semibold shadow-2xs sm:text-sm">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
                    <SelectItem value="sedang_diproses">Sedang Diproses</SelectItem>
                    <SelectItem value="selesai">Selesai Ditindaklanjuti</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Agency using shadcn Select */}
              <div className="w-[220px]">
                <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                  <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-10 rounded-2xl bg-white text-xs font-semibold shadow-2xs sm:text-sm">
                    <SelectValue placeholder="Semua Komisi & Bagian DPRD" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-2xl">
                    <SelectItem value="all">Semua Komisi & Bagian DPRD</SelectItem>
                    {EXTENDED_AGENCIES.map((agency) => (
                      <SelectItem key={agency} value={agency}>
                        {agency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Complaints Table with Comfortable Typography */}
      <Card className="soft-card border-warm-200 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] border-collapse text-left">
              <thead>
                <tr className="border-warm-200 bg-warm-50/80 border-b text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                  <th className="px-5 py-4 whitespace-nowrap sm:px-6">ID & Tanggal</th>
                  <th className="px-5 py-4 whitespace-nowrap">Pelapor (e-KTP)</th>
                  <th className="px-5 py-4 whitespace-nowrap">Komisi DPRD & Kategori</th>
                  <th className="min-w-[280px] px-5 py-4">Perihal Aduan</th>
                  <th className="px-5 py-4 whitespace-nowrap">Lokasi Kejadian</th>
                  <th className="px-5 py-4 whitespace-nowrap">Status & SLA</th>
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
                        {/* ID & Date */}
                        <td className="px-5 py-4.5 whitespace-nowrap sm:px-6">
                          <span className="text-accent-600 block font-mono text-xs font-bold whitespace-nowrap sm:text-sm">
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
                          <span className="mt-0.5 block font-mono text-xs whitespace-nowrap text-slate-400">
                            {ticket.reporter.nik.slice(0, 6)}••••••••
                          </span>
                        </td>

                        {/* Agency & Category */}
                        <td className="px-5 py-4.5">
                          <span className="text-darknavy-900 block text-sm font-bold whitespace-nowrap">
                            {ticket.targetDestination}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-warm-200/70 mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap text-slate-700"
                          >
                            {ticket.categoryOrKamus}
                          </Badge>
                        </td>

                        {/* Title */}
                        <td className="max-w-sm min-w-[280px] px-5 py-4.5">
                          <span className="text-darknavy-900 group-hover:text-accent-600 line-clamp-2 text-sm leading-snug font-bold transition-colors">
                            {ticket.title}
                          </span>
                          <span className="mt-1 line-clamp-1 text-xs leading-normal text-slate-500">
                            {ticket.description}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <span className="text-darknavy-900 block text-sm font-semibold whitespace-nowrap">
                            {ticket.location.kelurahan}
                          </span>
                          <span className="mt-0.5 block text-xs whitespace-nowrap text-slate-500">
                            Kec. {ticket.location.kecamatan}
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
                          {ticket.slaHoursRemaining > 0 ? (
                            <span className="mt-1 block text-xs font-medium whitespace-nowrap text-slate-400">
                              SLA: {ticket.slaHoursRemaining} Jam lagi
                            </span>
                          ) : null}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4.5 text-right whitespace-nowrap sm:px-6">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-warm-300 text-darknavy-900 group-hover:border-accent-500 group-hover:text-accent-600 h-9 gap-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-2xs"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Periksa</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-sm text-slate-400">
                      Tidak ditemukan aduan masyarakat yang sesuai filter pencarian.
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

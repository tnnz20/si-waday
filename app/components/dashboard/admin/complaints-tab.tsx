import * as React from 'react';

import { Link } from 'react-router';

import { TablePagination } from '@/components/shared/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useTicketTablePagination } from '@/hooks/use-ticket-table-pagination';

import {
  ADMIN_STATUS_META,
  type AdminTicketStatus,
  type DashboardTicketItem,
  computeTicketStatusCounts,
  formatIndonesianDateTime,
  normalizeKecamatanName,
} from '@/constants/admin-data';
import { CATEGORIES, EXTENDED_AGENCIES } from '@/constants/aspirations';

import {
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Megaphone,
  MoreHorizontal,
  RotateCcw,
  Search,
} from 'lucide-react';

import { TicketStatusFilterPills } from './ticket-status-filter-pills';

interface ComplaintsTabProps {
  tickets: DashboardTicketItem[];
}

const PAGE_SIZE = 10;

export function ComplaintsTab({ tickets }: ComplaintsTabProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | AdminTicketStatus>('all');
  const [agencyFilter, setAgencyFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [kecamatanFilter, setKecamatanFilter] = React.useState<string>('all');

  const agencyList = React.useMemo(() => {
    const merged = new Set<string>([
      ...EXTENDED_AGENCIES,
      ...tickets.map((t) => t.targetDestination).filter(Boolean),
    ]);
    return Array.from(merged).sort();
  }, [tickets]);

  const categoryList = React.useMemo(() => {
    const base = CATEGORIES.filter((c) => c !== 'semua');
    const merged = new Set<string>([
      ...base,
      ...tickets.map((t) => t.categoryOrKamus).filter(Boolean),
    ]);
    return Array.from(merged).sort();
  }, [tickets]);

  const kecamatanList = React.useMemo(() => {
    return Array.from(
      new Set(tickets.map((t) => normalizeKecamatanName(t.kecamatan)).filter(Boolean))
    ).sort();
  }, [tickets]);

  const statusCounts = React.useMemo(() => computeTicketStatusCounts(tickets), [tickets]);

  const filtered = React.useMemo(() => {
    return tickets.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (agencyFilter !== 'all' && item.targetDestination !== agencyFilter) return false;
      if (categoryFilter !== 'all' && item.categoryOrKamus !== categoryFilter) return false;
      if (kecamatanFilter !== 'all' && normalizeKecamatanName(item.kecamatan) !== kecamatanFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = item.ticketNumber.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchReporter = item.reporterName.toLowerCase().includes(q);
        const matchAgency = item.targetDestination.toLowerCase().includes(q);
        const matchKec = normalizeKecamatanName(item.kecamatan).toLowerCase().includes(q);
        if (!matchNumber && !matchTitle && !matchReporter && !matchAgency && !matchKec) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, searchQuery, statusFilter, agencyFilter, categoryFilter, kecamatanFilter]);

  const filterKey = `${searchQuery}-${statusFilter}-${agencyFilter}-${categoryFilter}-${kecamatanFilter}`;
  const { currentPage, setCurrentPage, totalPages, paginatedItems } = useTicketTablePagination(
    filtered,
    filterKey,
    PAGE_SIZE
  );

  const activeProcessCount =
    statusCounts.menunggu_verifikasi + statusCounts.terverifikasi + statusCounts.sedang_diproses;

  const hasActiveFilter =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'all' ||
    agencyFilter !== 'all' ||
    categoryFilter !== 'all' ||
    kecamatanFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAgencyFilter('all');
    setCategoryFilter('all');
    setKecamatanFilter('all');
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-200 sm:space-y-8">
      {/* KPI Cards Row (following DewanTab) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Total Aduan Masyarakat
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{tickets.length}</p>
              </div>
              <div className="bg-accent-50 text-accent-600 flex h-11 w-11 items-center justify-center rounded-2xl">
                <Megaphone className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">Laporan pengawasan warga di database</p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Menunggu &amp; Ditindaklanjuti
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{activeProcessCount}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">
              {statusCounts.menunggu_verifikasi} Menunggu Verifikasi •{' '}
              {statusCounts.sedang_diproses} Diproses
            </p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Selesai Ditindaklanjuti
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-600">{statusCounts.selesai}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">
              {statusCounts.terverifikasi} Terverifikasi • {statusCounts.ditolak} Ditolak
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-warm-200 overflow-hidden rounded-3xl bg-white shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-darknavy-900 text-lg font-black sm:text-xl">
                Daftar Aduan Pengawasan Komisi DPRD Tapin
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 sm:text-sm">
                Menampilkan {filtered.length} dari {tickets.length} aduan pelayanan publik warga
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari ID, perihal, pelapor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-warm-300 text-darknavy-900 focus-visible:border-accent-500 focus-visible:ring-accent-500/20 bg-warm-50/70 h-10 w-full rounded-2xl py-2 pr-4 pl-9 text-xs shadow-2xs transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 sm:text-sm"
                />
              </div>

              {hasActiveFilter ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="border-warm-300 text-darknavy-900 hover:bg-warm-100 h-10 gap-1.5 rounded-2xl text-xs font-bold"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </Button>
              ) : null}
            </div>
          </div>

          {/* Multi-Dimensional Filter Bar */}
          <div className="border-warm-200/80 mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
            <TicketStatusFilterPills
              value={statusFilter}
              onChange={setStatusFilter}
              totalCount={tickets.length}
              statusCounts={statusCounts}
            />

            {/* Filter Komisi DPRD */}
            <div className="w-55">
              <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-9 rounded-xl bg-white text-xs font-semibold shadow-2xs">
                  <SelectValue placeholder="Semua Komisi DPRD" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl">
                  <SelectItem value="all">Semua Komisi &amp; Bagian DPRD</SelectItem>
                  {agencyList.map((agency) => (
                    <SelectItem key={agency} value={agency}>
                      {agency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Kategori */}
            <div className="w-45">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-9 rounded-xl bg-white text-xs font-semibold shadow-2xs">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl">
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categoryList.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Kecamatan */}
            <div className="w-45">
              <Select value={kecamatanFilter} onValueChange={setKecamatanFilter}>
                <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-9 rounded-xl bg-white text-xs font-semibold shadow-2xs">
                  <SelectValue placeholder="Semua Kecamatan" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl">
                  <SelectItem value="all">Semua Kecamatan</SelectItem>
                  {kecamatanList.map((kec) => (
                    <SelectItem key={kec} value={kec}>
                      Kec. {kec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-warm-200 bg-warm-50/60 border-y text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 font-extrabold tracking-wider">ID &amp; Tanggal</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Pelapor (e-KTP)</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Komisi &amp; Kategori</th>
                  <th className="min-w-65 px-4 py-3 font-extrabold tracking-wider">
                    Perihal Aduan
                  </th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Lokasi Kejadian</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-warm-200/80 divide-y">
                {paginatedItems.map((ticket) => {
                  const status = ADMIN_STATUS_META[ticket.status];
                  const detailHref = `/dashboard/complaints/${ticket.ticketNumber}`;

                  return (
                    <tr key={ticket.id} className="hover:bg-warm-50/50 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <Link
                          to={detailHref}
                          className="text-accent-600 block font-mono text-xs font-bold hover:underline sm:text-sm"
                        >
                          {ticket.ticketNumber}
                        </Link>
                        <p className="text-2xs mt-0.5 text-slate-400">
                          {formatIndonesianDateTime(ticket.createdAt)}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="text-darknavy-900 text-sm font-bold">{ticket.reporterName}</p>
                        <p className="text-2xs mt-0.5 font-mono text-slate-400">
                          {ticket.maskedNik}
                        </p>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="text-darknavy-900 line-clamp-1 max-w-[210px] text-xs font-bold sm:text-sm">
                          {ticket.targetDestination}
                        </p>
                        <Badge
                          variant="secondary"
                          className="bg-warm-200/70 text-2xs mt-1 inline-flex rounded-md px-2 py-0.5 font-medium text-slate-700"
                        >
                          {ticket.categoryOrKamus}
                        </Badge>
                      </td>

                      <td className="max-w-sm px-4 py-3.5">
                        <Link
                          to={detailHref}
                          className="text-darknavy-900 hover:text-accent-600 line-clamp-1 text-sm font-bold transition-colors"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-2xs mt-1 line-clamp-1 text-slate-500">
                          {ticket.description}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{ticket.kelurahan}</span>
                        </div>
                        <p className="text-2xs mt-0.5 pl-5 text-slate-500">
                          Kec. {ticket.kecamatan}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.bg} ${status.text}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                          <span>{status.shortLabel}</span>
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="hover:bg-warm-100 h-8 w-8 rounded-xl text-slate-500"
                              aria-label={`Menu aksi untuk ${ticket.ticketNumber}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl">
                            <DropdownMenuLabel>Aksi Aduan</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={detailHref} className="flex items-center gap-2">
                                <Eye className="text-accent-600 h-4 w-4" />
                                <span>Periksa &amp; Tindak Lanjuti</span>
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6">
                      <Empty className="border-warm-200 border bg-slate-50/40">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Megaphone className="text-slate-500" />
                          </EmptyMedia>
                          <EmptyTitle className="text-darknavy-900 text-base font-bold">
                            {hasActiveFilter
                              ? 'Aduan Tidak Ditemukan'
                              : 'Belum Ada Aduan Masyarakat'}
                          </EmptyTitle>
                          <EmptyDescription className="text-xs text-slate-500">
                            {hasActiveFilter
                              ? 'Tidak ada laporan aduan yang sesuai dengan kriteria pencarian atau filter aktif.'
                              : 'Aduan pengawasan pelayanan publik dari warga Kabupaten Tapin akan tampil di sini.'}
                          </EmptyDescription>
                        </EmptyHeader>
                        {hasActiveFilter ? (
                          <EmptyContent>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={resetFilters}
                              className="rounded-xl text-xs font-bold"
                            >
                              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                              Reset Semua Filter
                            </Button>
                          </EmptyContent>
                        ) : null}
                      </Empty>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}

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
import { ALL_DAPIL_LIST, KECAMATAN_TAPIN_LIST } from '@/constants/tapin';

import {
  CheckCircle2,
  Clock,
  Eye,
  Landmark,
  MapPin,
  MoreHorizontal,
  RotateCcw,
  Search,
} from 'lucide-react';

import { TicketStatusFilterPills } from './ticket-status-filter-pills';

interface AspirationsTabProps {
  tickets: DashboardTicketItem[];
}

const PAGE_SIZE = 10;

export function AspirationsTab({ tickets }: AspirationsTabProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | AdminTicketStatus>('all');
  const [dapilFilter, setDapilFilter] = React.useState<string>('all');
  const [kecamatanFilter, setKecamatanFilter] = React.useState<string>('all');

  const dapilList = React.useMemo(() => {
    const base = ALL_DAPIL_LIST.map((d) => d.name);
    const dynamic = tickets.map((t) => t.dapilName).filter((name): name is string => Boolean(name));
    return Array.from(new Set([...base, ...dynamic]));
  }, [tickets]);

  const kecamatanList = React.useMemo(() => {
    const merged = new Set<string>([
      ...KECAMATAN_TAPIN_LIST,
      ...tickets.map((t) => normalizeKecamatanName(t.kecamatan)).filter(Boolean),
    ]);
    return Array.from(merged).sort();
  }, [tickets]);

  const statusCounts = React.useMemo(() => computeTicketStatusCounts(tickets), [tickets]);

  const filtered = React.useMemo(() => {
    return tickets.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (dapilFilter !== 'all' && item.dapilName !== dapilFilter) return false;
      if (kecamatanFilter !== 'all' && normalizeKecamatanName(item.kecamatan) !== kecamatanFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = item.ticketNumber.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchReporter = item.reporterName.toLowerCase().includes(q);
        const matchDewan = item.targetDestination.toLowerCase().includes(q);
        const matchKamus = item.categoryOrKamus.toLowerCase().includes(q);
        const matchKec = normalizeKecamatanName(item.kecamatan).toLowerCase().includes(q);
        if (
          !matchNumber &&
          !matchTitle &&
          !matchReporter &&
          !matchDewan &&
          !matchKamus &&
          !matchKec
        ) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, searchQuery, statusFilter, dapilFilter, kecamatanFilter]);

  const filterKey = `${searchQuery}-${statusFilter}-${dapilFilter}-${kecamatanFilter}`;
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
    dapilFilter !== 'all' ||
    kecamatanFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDapilFilter('all');
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
                  Total Aspirasi Pokir
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{tickets.length}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Landmark className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">Usulan konstituen tersimpan di database</p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Menunggu &amp; Proses Telaah
                </p>
                <p className="text-darknavy-900 mt-1 text-2xl font-black">{activeProcessCount}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">
              {statusCounts.menunggu_verifikasi} Menunggu Verifikasi •{' '}
              {statusCounts.sedang_diproses} Musrenbang
            </p>
          </CardContent>
        </Card>

        <Card className="soft-card border-warm-200 rounded-3xl bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs font-extrabold tracking-wider text-slate-500 uppercase">
                  Selesai / Akomodasi
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-600">{statusCounts.selesai}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xs mt-2 text-slate-500">
              {statusCounts.terverifikasi} Lolos Telaah • {statusCounts.ditolak} Ditolak
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
                Pokok Pikiran (Pokir) &amp; Aspirasi Dapil
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 sm:text-sm">
                Menampilkan {filtered.length} dari {tickets.length} usulan konstituen per daerah
                pemilihan
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari ID, usulan, dewan..."
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

            {/* Filter Dapil */}
            <div className="w-full sm:w-56">
              <Select value={dapilFilter} onValueChange={setDapilFilter}>
                <SelectTrigger className="border-warm-300 text-darknavy-900 focus:ring-accent-500 h-9 rounded-xl bg-white text-xs font-semibold shadow-2xs">
                  <SelectValue placeholder="Semua Dapil" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Dapil</SelectItem>
                  {dapilList.map((dapilName) => (
                    <SelectItem key={dapilName} value={dapilName}>
                      {dapilName}
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
                  <th className="px-6 py-3 font-extrabold tracking-wider">ID Pokir</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Pengusul (e-KTP)</th>
                  <th className="px-4 py-3 font-extrabold tracking-wider">Anggota Dewan Dituju</th>
                  <th className="min-w-65 px-4 py-3 font-extrabold tracking-wider">
                    Kamus Usulan &amp; Lokasi
                  </th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center font-extrabold tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-warm-200/80 divide-y">
                {paginatedItems.map((ticket) => {
                  const status = ADMIN_STATUS_META[ticket.status];
                  const detailHref = `/dashboard/aspirations/${ticket.ticketNumber}`;

                  return (
                    <tr key={ticket.id} className="hover:bg-warm-50/50 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <Link
                          to={detailHref}
                          className="block font-mono text-xs font-bold text-emerald-700 hover:underline sm:text-sm"
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

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="text-darknavy-900 text-sm font-bold">
                          {ticket.targetDestination}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-2xs mt-1 inline-flex border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700"
                        >
                          {ticket.dapilName || 'Dapil Tapin'}
                        </Badge>
                      </td>

                      <td className="max-w-sm px-4 py-3.5">
                        <Link
                          to={detailHref}
                          className="text-darknavy-900 line-clamp-1 text-sm font-bold transition-colors hover:text-emerald-700"
                        >
                          {ticket.categoryOrKamus}
                        </Link>
                        <div className="text-2xs mt-1 flex items-center gap-1.5 text-slate-500">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate">
                            {ticket.kelurahan}, Kec. {ticket.kecamatan}
                          </span>
                        </div>
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
                            <DropdownMenuLabel>Aksi Pokir</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={detailHref} className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-emerald-600" />
                                <span>Lihat Detail &amp; Proses</span>
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
                    <td colSpan={6} className="p-6">
                      <Empty className="border-warm-200 border bg-slate-50/40">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Landmark className="text-slate-500" />
                          </EmptyMedia>
                          <EmptyTitle className="text-darknavy-900 text-base font-bold">
                            {hasActiveFilter
                              ? 'Aspirasi Tidak Ditemukan'
                              : 'Belum Ada Aspirasi Pokir'}
                          </EmptyTitle>
                          <EmptyDescription className="text-xs text-slate-500">
                            {hasActiveFilter
                              ? 'Tidak ada usulan pokir yang sesuai dengan kata kunci atau filter yang dipilih.'
                              : 'Usulan pokok pikiran konstituen yang dikirim melalui formulir publik akan tampil di tabel ini.'}
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

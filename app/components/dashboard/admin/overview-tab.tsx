import { Link } from 'react-router';

import type { AuthUserPayload } from '@/lib/auth.server';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { ADMIN_STATUS_META, type DashboardOverviewStats } from '@/constants/admin-data';

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  Inbox,
  Landmark,
  MapPin,
  Megaphone,
  MessageSquareQuote,
  Star,
  TrendingUp,
} from 'lucide-react';

interface OverviewTabProps {
  stats: DashboardOverviewStats;
  currentUser: AuthUserPayload;
}

export function OverviewTab({ stats, currentUser }: OverviewTabProps) {
  const isAdmin = currentUser.role === 'admin';
  const slaOnTarget = stats.averageResponseHours !== null && stats.averageResponseHours <= 24;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 sm:space-y-8">
        {/* Top Welcome Banner */}
        <div className="bg-darknavy-900 relative overflow-hidden rounded-3xl p-6 text-white shadow-xl sm:p-8">
          <div className="bg-accent-500/15 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="border-accent-500/40 bg-accent-500/20 text-accent-400 px-3 py-1 text-xs font-bold tracking-wider uppercase"
                >
                  DPRD Kabupaten Tapin
                </Badge>
                <span className="text-xs font-medium text-slate-400">
                  Tahun Anggaran {new Date().getFullYear()}
                </span>
              </div>
              <h2 className="text-xl leading-snug font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
                Pusat Data Aspirasi &amp; Aduan Warga SI-WADAY
              </h2>
              <p className="max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                Memantau integrasi pengaduan publik ke komisi-komisi dewan dan aspirasi konstituen
                anggota DPRD Kabupaten Tapin secara transparan dan akuntabel.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              {isAdmin ? (
                <Button
                  asChild
                  className="coral-glow bg-accent-500 hover:bg-accent-600 rounded-full px-6 py-5.5 text-xs font-bold text-white shadow-lg sm:text-sm"
                >
                  <Link to="/dashboard/complaints">
                    <Megaphone className="mr-2 h-4 w-4" />
                    <span>Kelola Aduan ({stats.totalComplaints})</span>
                  </Link>
                </Button>
              ) : null}
              <Button
                asChild
                variant="outline"
                className="border-darknavy-700 bg-darknavy-800 hover:bg-darknavy-700 rounded-full px-6 py-5.5 text-xs font-bold text-white shadow-sm sm:text-sm"
              >
                <Link to="/dashboard/aspirations">
                  <Landmark className="mr-2 h-4 w-4 text-emerald-400" />
                  <span>Pokir Dewan ({stats.totalAspirations})</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Stats Grid (100% Real PostgreSQL Metrics) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Laporan */}
          <Card className="soft-card border-warm-200 flex h-full flex-col justify-between rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 sm:p-6 sm:pb-2.5">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Total Laporan Masuk
              </CardTitle>
              <div className="bg-darknavy-900 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs">
                <TrendingUp className="text-accent-400 h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-darknavy-900 text-3xl font-black tracking-tight whitespace-nowrap sm:text-4xl">
                  {stats.totalTickets}
                </span>
                <Badge
                  variant="outline"
                  className="text-2xs border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold whitespace-nowrap text-emerald-600"
                >
                  +{stats.monthlyTicketsCount} bln ini
                </Badge>
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                {stats.completedCount} Selesai • {stats.inProgressCount} Dalam Proses
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Tingkat Penyelesaian */}
          <Card className="soft-card border-warm-200 flex h-full flex-col justify-between rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 sm:p-6 sm:pb-2.5">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Tingkat Penyelesaian
              </CardTitle>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-xs">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-darknavy-900 text-3xl font-black tracking-tight whitespace-nowrap sm:text-4xl">
                  {stats.resolutionRate}%
                </span>
                <Badge
                  variant="outline"
                  className="text-2xs border-amber-200 bg-amber-50 px-2 py-0.5 font-bold whitespace-nowrap text-amber-700"
                >
                  {stats.pendingVerificationCount} Antrean
                </Badge>
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                {stats.totalAspirations} Pokir DPRD • {stats.totalComplaints} Aduan Publik
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Rata-rata Respon SLA */}
          <Card className="soft-card border-warm-200 flex h-full flex-col justify-between rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 sm:p-6 sm:pb-2.5">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Rata-rata Respon SLA
              </CardTitle>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-xs">
                <Clock className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="text-darknavy-900 text-3xl font-black tracking-tight sm:text-4xl">
                    {stats.averageResponseHours !== null
                      ? stats.averageResponseHours.toFixed(1)
                      : '—'}
                  </span>
                  {stats.averageResponseHours !== null ? (
                    <span className="text-base font-extrabold text-slate-600 sm:text-lg">Jam</span>
                  ) : null}
                </div>
                {stats.averageResponseHours !== null ? (
                  <Badge
                    variant="outline"
                    className={`text-2xs px-2 py-0.5 font-bold whitespace-nowrap ${
                      slaOnTarget
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {slaOnTarget ? '< 24 Jam' : '> 24 Jam'}
                  </Badge>
                ) : null}
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                {stats.averageResponseHours !== null
                  ? 'Rata-rata waktu penanganan sejak masuk'
                  : 'Belum ada tiket yang selesai ditangani'}
              </p>
            </CardContent>
          </Card>

          {/* Card 4: CSAT Rating */}
          <Card className="soft-card border-warm-200 flex h-full flex-col justify-between rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 sm:p-6 sm:pb-2.5">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Kepuasan Aplikasi (CSAT)
              </CardTitle>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-500 shadow-xs">
                <Star className="h-4.5 w-4.5 fill-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-darknavy-900 text-3xl font-black tracking-tight whitespace-nowrap sm:text-4xl">
                  {stats.csat.totalReviews > 0 ? stats.csat.averageRating.toFixed(1) : '—'}
                </span>
                <span className="text-xs font-bold whitespace-nowrap text-amber-500 sm:text-sm">
                  / 5.0 ★
                </span>
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                {stats.csat.totalReviews > 0
                  ? `${stats.csat.satisfactionPercentage}% dari ${stats.csat.totalReviews} ulasan warga puas`
                  : 'Belum ada ulasan survei kepuasan warga'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid: Recent Feed & Distribution */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left (2 cols): Aktivitas Tiket Terbaru */}
          <Card className="soft-card border-warm-200 rounded-3xl border bg-white shadow-sm lg:col-span-2">
            <CardHeader className="border-warm-200 flex flex-row items-center justify-between border-b p-6 pb-4">
              <div>
                <CardTitle className="text-darknavy-900 text-base font-extrabold sm:text-lg">
                  Aktivitas Laporan &amp; Usulan Terkini
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs text-slate-500">
                  Pembaruan data langsung dari database formulir warga Kabupaten Tapin
                </CardDescription>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-accent-600 hover:text-accent-700 hover:bg-accent-50/60 flex items-center gap-1.5 text-xs font-bold"
              >
                <Link to={isAdmin ? '/dashboard/complaints' : '/dashboard/aspirations'}>
                  <span>Lihat Semua Data</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {stats.recentTickets.length === 0 ? (
                <Empty className="border-warm-200 border bg-slate-50/40 py-10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Inbox className="text-slate-500" />
                    </EmptyMedia>
                    <EmptyTitle className="text-darknavy-900 text-base font-bold">
                      Belum Ada Laporan Masuk
                    </EmptyTitle>
                    <EmptyDescription className="text-xs text-slate-500">
                      Aspirasi Dapil DPRD dan aduan pelayanan publik warga yang masuk akan tampil di
                      sini secara otomatis.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold"
                    >
                      <Link to="/dashboard/aspirations">Buka Daftar Aspirasi</Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="divide-warm-100 divide-y">
                  {stats.recentTickets.map((ticket) => {
                    const isDapil = ticket.type === 'dapil';
                    const status = ADMIN_STATUS_META[ticket.status];
                    const detailHref = isDapil
                      ? `/dashboard/aspirations/${ticket.ticketNumber}`
                      : `/dashboard/complaints/${ticket.ticketNumber}`;

                    return (
                      <Link
                        key={ticket.id}
                        to={detailHref}
                        className="group hover:bg-warm-50/70 flex flex-col justify-between gap-3.5 rounded-2xl p-3.5 transition-colors sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 items-start gap-3.5">
                          <div
                            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs ${
                              isDapil ? 'bg-emerald-500' : 'bg-accent-500'
                            }`}
                          >
                            {isDapil ? (
                              <Landmark className="h-5 w-5" />
                            ) : (
                              <Building2 className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-accent-600 font-mono text-xs font-bold">
                                {ticket.ticketNumber}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-darknavy-900 truncate text-xs font-bold">
                                {ticket.reporterName}
                              </span>
                              <span className="text-slate-300">•</span>
                              <Badge
                                variant="secondary"
                                className="bg-warm-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                              >
                                Kec. {ticket.kecamatan}
                              </Badge>
                            </div>
                            <h4 className="text-darknavy-900 group-hover:text-accent-600 mt-1 line-clamp-2 text-sm leading-snug font-bold transition-colors">
                              {ticket.title}
                            </h4>
                            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                              Tujuan:{' '}
                              <strong className="font-semibold text-slate-700">
                                {ticket.targetDestination}
                              </strong>{' '}
                              ({ticket.categoryOrKamus})
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-3 pl-13 sm:justify-end sm:pl-0">
                          <Badge
                            variant="outline"
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.text}`}
                          >
                            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                            <span>{status.label}</span>
                          </Badge>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="group-hover:text-darknavy-900 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors group-hover:bg-white group-hover:shadow-xs">
                                <Eye className="h-4 w-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Lihat &amp; Tindak Lanjuti</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right (1 col): Wilayah & Highlight CSAT */}
          <div className="space-y-6">
            {/* Sebaran Kecamatan Tapin */}
            <Card className="soft-card border-warm-200 rounded-3xl border bg-white shadow-sm">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Sebaran Kecamatan Tapin
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs text-slate-500">
                  Konsentrasi laporan dan usulan wilayah berdasarkan database
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {stats.kecamatanDistribution.length === 0 ? (
                  <Empty className="border-warm-200 border bg-slate-50/40 p-6">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <MapPin className="text-slate-500" />
                      </EmptyMedia>
                      <EmptyTitle className="text-darknavy-900 text-sm font-bold">
                        Belum Ada Data Wilayah
                      </EmptyTitle>
                      <EmptyDescription className="text-xs text-slate-500">
                        Sebaran kecamatan muncul otomatis setelah laporan warga tersimpan.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="space-y-3">
                    {stats.kecamatanDistribution.map((kec) => (
                      <div key={kec.name} className="space-y-1.5">
                        <div className="flex justify-between gap-2 text-xs font-semibold sm:text-sm">
                          <span className="text-darknavy-900 truncate">{kec.name}</span>
                          <span className="shrink-0 font-normal text-slate-500">
                            {kec.count} Laporan ({kec.percentage}%)
                          </span>
                        </div>
                        <div className="bg-warm-100 h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="bg-accent-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${kec.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick CSAT summary */}
            <Card className="border-accent-200 bg-accent-50/60 rounded-3xl border shadow-sm">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                    <CardTitle className="text-darknavy-900 text-xs font-bold tracking-wider uppercase">
                      Sorotan Kepuasan Warga
                    </CardTitle>
                  </div>
                  {isAdmin && stats.highlightedFeedback ? (
                    <Link
                      to="/dashboard/satisfaction"
                      className="text-accent-600 hover:text-accent-700 text-2xs font-bold"
                    >
                      Lihat CSAT
                    </Link>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                {stats.highlightedFeedback ? (
                  <div className="space-y-3.5">
                    <p className="text-xs leading-relaxed text-slate-700 italic sm:text-sm">
                      "{stats.highlightedFeedback.feedback}"
                    </p>
                    <div className="border-accent-200/60 flex items-center justify-between gap-2 border-t pt-2.5">
                      <span className="text-darknavy-900 truncate text-xs font-bold">
                        {stats.highlightedFeedback.reporterName} (
                        {stats.highlightedFeedback.kecamatan})
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700"
                      >
                        {stats.highlightedFeedback.rating} / 5 ★
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <Empty className="border-accent-200/70 border bg-white/60 p-5">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <MessageSquareQuote className="text-accent-500" />
                      </EmptyMedia>
                      <EmptyTitle className="text-darknavy-900 text-sm font-bold">
                        Belum Ada Testimoni
                      </EmptyTitle>
                      <EmptyDescription className="text-xs text-slate-500">
                        Komentar ulasan kepuasan masyarakat akan ditampilkan di sini.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

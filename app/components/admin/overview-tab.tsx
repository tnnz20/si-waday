import * as React from 'react';

import type { AdminTab } from '@/components/layout/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { ADMIN_KPI_DATA, ADMIN_STATUS_META, type AdminTicketItem } from '@/constants/admin-data';

import {
  ArrowUpRight,
  Building2,
  Clock,
  Eye,
  Landmark,
  Megaphone,
  Star,
  TrendingUp,
} from 'lucide-react';

interface OverviewTabProps {
  tickets: AdminTicketItem[];
  onSelectTicket: (ticket: AdminTicketItem) => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export function OverviewTab({ tickets, onSelectTicket, onNavigateTab }: OverviewTabProps) {
  const recentTickets = tickets.slice(0, 5);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 sm:space-y-8">
        {/* Top Welcome Banner with Generous Typography & Spacing */}
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
                <span className="text-xs font-medium text-slate-400">Tahun Anggaran 2026/2027</span>
              </div>
              <h2 className="text-xl leading-snug font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
                Pusat Data Aspirasi & Aduan Warga SI-WADAY
              </h2>
              <p className="max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                Memantau integrasi pengaduan publik ke komisi-komisi dewan dan aspirasi konstituen
                untuk 25 anggota DPRD Kabupaten Tapin secara transparan dan akuntabel.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Button
                type="button"
                onClick={() => onNavigateTab('aduan')}
                className="coral-glow bg-accent-500 hover:bg-accent-600 rounded-full px-6 py-5.5 text-xs font-bold text-white shadow-lg sm:text-sm"
              >
                <Megaphone className="mr-2 h-4 w-4" />
                <span>Kelola Aduan ({ADMIN_KPI_DATA.totalComplaints})</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigateTab('aspirasi')}
                className="border-darknavy-700 bg-darknavy-800 hover:bg-darknavy-700 rounded-full px-6 py-5.5 text-xs font-bold text-white shadow-sm sm:text-sm"
              >
                <Landmark className="mr-2 h-4 w-4 text-emerald-400" />
                <span>Pokir Dewan ({ADMIN_KPI_DATA.totalAspirations})</span>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Stats Grid with shadcn Card & Comfortable Font Size */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Tiket */}
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
                  {ADMIN_KPI_DATA.totalTickets}
                </span>
                <Badge
                  variant="outline"
                  className="text-2xs border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold whitespace-nowrap text-emerald-600"
                >
                  +12% bln ini
                </Badge>
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                {ADMIN_KPI_DATA.completedCount} Selesai • {ADMIN_KPI_DATA.inProgressCount} Dalam
                Proses
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Pokir DPRD Anggaran */}
          <Card className="soft-card border-warm-200 flex h-full flex-col justify-between rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 sm:p-6 sm:pb-2.5">
              <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Estimasi Pokir DPRD
              </CardTitle>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-xs">
                <Landmark className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="flex items-baseline">
                <span className="text-darknavy-900 text-xl font-black tracking-tight whitespace-nowrap sm:text-2xl">
                  {ADMIN_KPI_DATA.totalAspirationBudgetFormatted}
                </span>
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                Dari {ADMIN_KPI_DATA.totalAspirations} usulan konstituen 3 Dapil
              </p>
            </CardContent>
          </Card>

          {/* Card 3: SLA Respon */}
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
                    6.2
                  </span>
                  <span className="text-base font-extrabold text-slate-600 sm:text-lg">Jam</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-2xs border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold whitespace-nowrap text-emerald-600"
                >
                  &lt; 24 Jam
                </Badge>
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                Cepat tanggap tindak lanjut lapangan
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
                  {ADMIN_KPI_DATA.averageCsatRating}
                </span>
                <span className="text-xs font-bold whitespace-nowrap text-amber-500 sm:text-sm">
                  / 5.0 ★
                </span>
              </div>
              <p className="text-2xs mt-2 line-clamp-1 leading-normal text-slate-500 sm:text-xs">
                {ADMIN_KPI_DATA.satisfactionPercentage}% dari {ADMIN_KPI_DATA.totalCsatReviews}{' '}
                warga puas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid: Recent Feed & Distribution with shadcn Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left (2 cols): Aktivitas Tiket Terbaru */}
          <Card className="soft-card border-warm-200 rounded-3xl border bg-white shadow-sm lg:col-span-2">
            <CardHeader className="border-warm-200 flex flex-row items-center justify-between border-b p-6 pb-4">
              <div>
                <CardTitle className="text-darknavy-900 text-base font-extrabold sm:text-lg">
                  Aktivitas Laporan & Usulan Terkini
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs text-slate-500">
                  Pembaruan data masuk dari formulir warga Kabupaten Tapin
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('aduan')}
                className="text-accent-600 hover:text-accent-700 hover:bg-accent-50/60 flex items-center gap-1.5 text-xs font-bold"
              >
                <span>Lihat Semua Data</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <div className="divide-warm-100 divide-y">
                {recentTickets.map((ticket) => {
                  const isDapil = ticket.type === 'dapil';
                  const status = ADMIN_STATUS_META[ticket.status];

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket)}
                      className="group hover:bg-warm-50/70 flex cursor-pointer flex-col justify-between gap-3.5 rounded-2xl p-3.5 transition-colors sm:flex-row sm:items-center"
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
                              {ticket.id}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-darknavy-900 truncate text-xs font-bold">
                              {ticket.reporter.name}
                            </span>
                            <span className="text-slate-300">•</span>
                            <Badge
                              variant="secondary"
                              className="bg-warm-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                            >
                              Kec. {ticket.location.kecamatan}
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="group-hover:text-darknavy-900 h-8 w-8 rounded-xl text-slate-400 hover:bg-white hover:shadow-xs"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Lihat & Tindak Lanjuti</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right (1 col): Wilayah & Status Distribusi */}
          <div className="space-y-6">
            {/* Quick Info Box with shadcn Card */}
            <Card className="soft-card border-warm-200 rounded-3xl border bg-white shadow-sm">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Sebaran Kecamatan Tapin
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs text-slate-500">
                  Konsentrasi keluhan dan usulan wilayah
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-6 pt-0">
                {[
                  { name: 'Kec. Tapin Utara', count: 48, percentage: 38 },
                  { name: 'Kec. Binuang', count: 32, percentage: 25 },
                  { name: 'Kec. Candi Laras Selatan', count: 24, percentage: 19 },
                  { name: 'Kec. Bungur & Lokpaikat', count: 16, percentage: 12 },
                  { name: 'Kecamatan Lainnya', count: 8, percentage: 6 },
                ].map((kec) => (
                  <div key={kec.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold sm:text-sm">
                      <span className="text-darknavy-900">{kec.name}</span>
                      <span className="font-normal text-slate-500">
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
              </CardContent>
            </Card>

            {/* Quick CSAT summary */}
            <Card className="border-accent-200 bg-accent-50/60 rounded-3xl border shadow-sm">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                  <CardTitle className="text-darknavy-900 text-xs font-bold tracking-wider uppercase">
                    Sorotan Kepuasan Warga
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3.5 p-6 pt-0">
                <p className="text-xs leading-relaxed text-slate-700 italic sm:text-sm">
                  "Aplikasi sangat praktis, bisa langsung tandai titik jalan rusak di peta Tapin dan
                  melihat foto anggota dewan dapil!"
                </p>
                <div className="border-accent-200/60 flex items-center justify-between border-t pt-2.5">
                  <span className="text-darknavy-900 text-xs font-bold">
                    Ahmad Syahrial (Tapin Utara)
                  </span>
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700"
                  >
                    5 / 5 ★ Bintang
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

import * as React from 'react';

import { toast } from 'sonner';

import type { AdminTab } from '@/components/layout/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Building2,
  ChevronRight,
  Download,
  Landmark,
  LayoutDashboard,
  Menu,
  Search,
  Star,
} from 'lucide-react';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TAB_CONFIG: Record<
  AdminTab,
  {
    title: string;
    subtitle: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badgeBg: string;
  }
> = {
  overview: {
    title: 'Ringkasan Kinerja & KPI DPRD',
    subtitle: 'Analisis real-time pengaduan dan pokok pikiran DPRD Kabupaten Tapin',
    label: 'Overview',
    icon: LayoutDashboard,
    accentColor: 'text-accent-500',
    badgeBg: 'border-accent-200 bg-accent-50 text-accent-600',
  },
  aduan: {
    title: 'Manajemen Aduan Masyarakat',
    subtitle: 'Verifikasi keluhan fasilitas dan aspirasi pengawasan komisi DPRD Tapin',
    label: 'Aduan Warga',
    icon: Building2,
    accentColor: 'text-accent-500',
    badgeBg: 'border-amber-200 bg-amber-50 text-amber-600',
  },
  aspirasi: {
    title: 'Manajemen Aspirasi Dapil DPRD',
    subtitle: 'Penyerapan pokok-pokok pikiran (Pokir) 25 anggota dewan terpilih',
    label: 'Aspirasi Dapil',
    icon: Landmark,
    accentColor: 'text-emerald-500',
    badgeBg: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  },
  kepuasan: {
    title: 'Survei Kepuasan Aplikasi (CSAT)',
    subtitle: 'Ulasan kemudahan, kecepatan, dan evaluasi pengguna SI-WADAY',
    label: 'Survei CSAT',
    icon: Star,
    accentColor: 'text-amber-500',
    badgeBg: 'border-amber-200 bg-amber-50 text-amber-600',
  },
};

export function AdminHeader({
  activeTab,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
}: AdminHeaderProps) {
  const currentTabInfo = TAB_CONFIG[activeTab] || TAB_CONFIG.overview;
  const TabIcon = currentTabInfo.icon;

  const handleExport = () => {
    toast.success('Mengekspor Laporan Rekapitulasi', {
      description: `Format CSV/Excel untuk data ${currentTabInfo.title} sedang diunduh.`,
    });
  };

  return (
    <header className="border-warm-200/90 rounded-3xl border bg-white shadow-xs transition-all">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-4.5">
        {/* Left Side: Bento Icon, Breadcrumb, Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          {/* Mobile hamburger menu button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onOpenMobileMenu}
            className="border-warm-200 text-darknavy-900 hover:bg-warm-100 h-10 w-10 shrink-0 rounded-2xl lg:hidden"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Squircle Bento Icon */}
          <div className="border-warm-200/80 bg-warm-50/80 hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-2xs sm:flex">
            <TabIcon className={`h-5.5 w-5.5 ${currentTabInfo.accentColor}`} />
          </div>

          <div className="space-y-0.5">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="hover:text-darknavy-900 transition-colors">Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Badge
                variant="outline"
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase ${currentTabInfo.badgeBg}`}
              >
                {currentTabInfo.label}
              </Badge>
            </div>

            {/* Clear, readable title with comfortable line-height and tracking */}
            <h1 className="text-darknavy-900 text-lg font-black tracking-tight sm:text-xl lg:text-2xl">
              {currentTabInfo.title}
            </h1>

            {/* Explanatory subtitle */}
            <p className="line-clamp-1 max-w-2xl text-xs leading-normal text-slate-500 sm:text-sm">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Search, Export Button, and Notification Bell */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Quick Search using shadcn Input with comfortable height and font size */}
          <div className="relative flex-1 sm:w-64 md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari ID tiket, nama, lokasi..."
              className="border-warm-200 text-darknavy-900 focus-visible:border-accent-500 focus-visible:ring-accent-500/20 bg-warm-50/70 h-10 w-full rounded-2xl py-2 pr-9 pl-10 text-xs shadow-2xs transition-all placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 sm:text-sm"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-2xs absolute top-1/2 right-3 -translate-y-1/2 font-bold text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            ) : (
              <kbd className="border-warm-200 text-2xs pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border bg-white px-1.5 py-0.5 font-mono text-slate-400">
                /
              </kbd>
            )}
          </div>

          {/* Export Action Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            className="border-warm-200 text-darknavy-900 hover:bg-warm-100 hover:border-warm-300 hidden h-10 items-center gap-2 rounded-2xl px-4 text-xs font-bold shadow-2xs sm:flex sm:text-sm"
          >
            <Download className="text-accent-500 h-4 w-4" />
            <span>Ekspor CSV</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

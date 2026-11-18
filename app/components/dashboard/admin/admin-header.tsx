import type * as React from 'react';

import { useLocation } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Building2,
  ChevronRight,
  Landmark,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

interface RouteHeaderMeta {
  title: string;
  subtitle: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const ROUTE_HEADER_MAP: Record<string, RouteHeaderMeta> = {
  '/dashboard': {
    title: 'Ringkasan Kinerja & KPI DPRD',
    subtitle: 'Analisis real-time pengaduan dan pokok pikiran DPRD Kabupaten Tapin',
    label: 'Overview',
    icon: LayoutDashboard,
    accentColor: 'text-accent-500',
    badgeBg: 'border-accent-200 bg-accent-50 text-accent-600',
  },
  '/dashboard/complaints': {
    title: 'Manajemen Aduan Masyarakat',
    subtitle: 'Verifikasi keluhan fasilitas dan aspirasi pengawasan komisi DPRD Tapin',
    label: 'Aduan Warga',
    icon: Building2,
    accentColor: 'text-accent-500',
    badgeBg: 'border-amber-200 bg-amber-50 text-amber-600',
  },
  '/dashboard/aspirations': {
    title: 'Manajemen Aspirasi Dapil DPRD',
    subtitle: 'Penyerapan pokok-pokok pikiran (Pokir) 25 anggota dewan terpilih',
    label: 'Aspirasi Dapil',
    icon: Landmark,
    accentColor: 'text-emerald-500',
    badgeBg: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  },
  '/dashboard/satisfaction': {
    title: 'Survei Kepuasan Aplikasi (CSAT)',
    subtitle: 'Ulasan kemudahan, kecepatan, dan evaluasi pengguna SI-WADAY',
    label: 'Survei CSAT',
    icon: Star,
    accentColor: 'text-amber-500',
    badgeBg: 'border-amber-200 bg-amber-50 text-amber-600',
  },
  '/dashboard/users/legislators': {
    title: 'Kelola Anggota Dewan Perwakilan Rakyat',
    subtitle: 'Direktori anggota DPRD Kabupaten Tapin dan perwakilan DPR RI Dapil Kalsel 1',
    label: 'Kelola Dewan',
    icon: Landmark,
    accentColor: 'text-emerald-500',
    badgeBg: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  },
  '/dashboard/users/moderators': {
    title: 'Kelola Petugas Moderator Regional',
    subtitle: 'Daftar akun verifikator aspirasi dan aduan warga per daerah pemilihan (Dapil)',
    label: 'Kelola Moderator',
    icon: ShieldCheck,
    accentColor: 'text-blue-500',
    badgeBg: 'border-blue-200 bg-blue-50 text-blue-600',
  },
};

function resolveHeaderMeta(pathname: string): RouteHeaderMeta {
  if (ROUTE_HEADER_MAP[pathname]) {
    return ROUTE_HEADER_MAP[pathname];
  }
  if (pathname.startsWith('/dashboard/users/legislators/')) {
    return {
      ...ROUTE_HEADER_MAP['/dashboard/users/legislators'],
      title: 'Detail Anggota Dewan Perwakilan Rakyat',
      subtitle: 'Informasi lengkap profil, penugasan wilayah, dan rekam jejak aktivitas akun dewan',
      label: 'Detail Dewan',
    };
  }
  if (pathname.startsWith('/dashboard/users/moderators/')) {
    return {
      ...ROUTE_HEADER_MAP['/dashboard/users/moderators'],
      title: 'Detail Petugas Moderator Regional',
      subtitle:
        'Informasi lengkap profil verifikator wilayah dan rekam jejak aktivitas akun moderator',
      label: 'Detail Moderator',
    };
  }
  return ROUTE_HEADER_MAP['/dashboard'];
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const location = useLocation();
  const currentTabInfo = resolveHeaderMeta(location.pathname);
  const TabIcon = currentTabInfo.icon;

  const isLegislatorDetail = location.pathname.startsWith('/dashboard/users/legislators/');
  const isModeratorDetail = location.pathname.startsWith('/dashboard/users/moderators/');

  return (
    <header className="border-warm-200/90 rounded-3xl border bg-white shadow-xs transition-all">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-4.5">
        {/* Left Side: Bento Icon, Breadcrumb, Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          {/* Mobile hamburger menu button */}
          {onOpenMobileMenu ? (
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
          ) : null}

          {/* Squircle Bento Icon */}
          <div className="border-warm-200/80 bg-warm-50/80 hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-2xs sm:flex">
            <TabIcon className={`h-5.5 w-5.5 ${currentTabInfo.accentColor}`} />
          </div>

          <div className="space-y-0.5">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="hover:text-darknavy-900 transition-colors">Dashboard</span>
              {isLegislatorDetail ? (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hover:text-darknavy-900 transition-colors">Kelola Dewan</span>
                </>
              ) : null}
              {isModeratorDetail ? (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hover:text-darknavy-900 transition-colors">
                    Kelola Moderator
                  </span>
                </>
              ) : null}
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
      </div>
    </header>
  );
}

import * as React from 'react';

import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import {
  ChevronRight,
  ChevronsUpDown,
  Command,
  Landmark,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Star,
  User,
  X,
} from 'lucide-react';

export type AdminTab = 'overview' | 'aduan' | 'aspirasi' | 'kepuasan';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSearchFocus?: () => void;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onSearchFocus,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMenuOpen]);

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Ringkasan Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'aduan' as AdminTab,
      label: 'Aduan Masyarakat',
      icon: Megaphone,
    },
    {
      id: 'aspirasi' as AdminTab,
      label: 'Aspirasi Dapil DPRD',
      icon: Landmark,
    },
    {
      id: 'kepuasan' as AdminTab,
      label: 'Survei Kepuasan CSAT',
      icon: Star,
    },
  ];

  /* ---------------------------------------------------- */
  /* Expanded Sidebar Content (Image 3)                   */
  /* ---------------------------------------------------- */
  const expandedContent = (
    <div className="text-darknavy-900 flex h-full flex-col justify-between bg-white">
      <div className="flex flex-col">
        {/* Top Header: Brand & Collapse Button */}
        <div className="flex items-center justify-between p-4 pb-2.5">
          <Link to="/dashboard" className="group flex min-w-0 items-center gap-3">
            <div className="bg-accent-500 shadow-accent-500/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-xs transition-transform group-hover:scale-105">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <span className="text-darknavy-900 truncate text-sm font-extrabold tracking-tight sm:text-base">
              SI-WADAY
            </span>
          </Link>

          {/* Desktop Collapse Button */}
          {onToggleCollapse ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="hover:bg-warm-100 hover:text-darknavy-900 hidden h-8 w-8 rounded-xl text-slate-400 lg:flex"
                  aria-label="Tutup Sidebar"
                >
                  <PanelLeftClose className="h-4.5 w-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-semibold">Tutup Sidebar (Collapse)</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {/* Mobile Drawer Close Button */}
          {onCloseMobile ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              className="hover:bg-warm-100 hover:text-darknavy-900 h-9 w-9 rounded-xl text-slate-400 lg:hidden"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </Button>
          ) : null}
        </div>

        {/* Quick Search / Command Pill */}
        <div className="px-3.5 pt-1.5 pb-2.5">
          <button
            type="button"
            onClick={onSearchFocus}
            className="border-warm-200 bg-warm-50/70 hover:bg-warm-100/70 group flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs text-slate-500 shadow-2xs transition-all"
          >
            <div className="group-hover:text-darknavy-900 flex items-center gap-2.5 text-slate-500">
              <Command className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium">Cari menu / data...</span>
            </div>
            <kbd className="text-2xs border-warm-200 rounded border bg-white px-1.5 py-0.5 font-mono font-bold text-slate-400">
              /
            </kbd>
          </button>
        </div>

        {/* Menu Items List (Single Line, No descriptions, No count badges, Readable Typography) */}
        <div className="space-y-1.5 px-3.5 pt-2">
          <p className="text-2xs px-2.5 pt-1 pb-1.5 font-extrabold tracking-wider text-slate-400 uppercase">
            Menu Utama
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-warm-200/80 text-darknavy-900 font-extrabold shadow-2xs'
                    : 'hover:bg-warm-100/80 hover:text-darknavy-900 text-slate-600'
                )}
              >
                <Icon
                  className={cn(
                    'h-4.5 w-4.5 shrink-0 transition-colors',
                    isActive ? 'text-accent-500' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span className="truncate leading-normal">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Section with Image 3 Redesign */}
      <div className="border-warm-200/80 relative border-t p-3" ref={userMenuRef}>
        {/* Floating User Popup Menu (Image 3) */}
        {userMenuOpen ? (
          <div className="border-warm-200 animate-in fade-in zoom-in-95 absolute right-3 bottom-full left-3 z-50 mb-2 overflow-hidden rounded-2xl border bg-white p-1.5 shadow-xl transition-all duration-150">
            {/* Header: User Info + Chevron Right */}
            <div
              className="hover:bg-warm-100/70 flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors"
              onClick={() => {
                toast.info('Profil Pengguna', {
                  description: 'Administrator Utama • admin.setwan@tapinkab.go.id',
                });
                setUserMenuOpen(false);
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar className="border-warm-200 h-9 w-9 shrink-0 rounded-xl border shadow-2xs">
                  <AvatarFallback className="from-accent-500 flex h-full w-full items-center justify-center rounded-xl bg-linear-to-tr to-amber-500 text-xs font-extrabold text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-darknavy-900 truncate text-sm font-bold">
                    Administrator Utama
                  </p>
                  <p className="truncate text-xs text-slate-500">admin.setwan@tapinkab.go.id</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </div>

            <div className="border-warm-200/80 my-1 border-t" />

            {/* Menu Option 1: Upgrade plan */}
            <button
              type="button"
              onClick={() => {
                toast.info('Status Lisensi Sistem', {
                  description: 'Sistem SI-WADAY DPRD Kabupaten Tapin aktif dengan lisensi penuh.',
                });
                setUserMenuOpen(false);
              }}
              className="hover:bg-warm-100/80 text-darknavy-900 group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors"
            >
              <Sparkles className="text-accent-500 h-4 w-4 shrink-0" />
              <span>Upgrade plan</span>
            </button>

            {/* Menu Option 2: Profile */}
            <button
              type="button"
              onClick={() => {
                toast.info('Pengaturan Profil', {
                  description: 'Kelola informasi identitas & akun administrator.',
                });
                setUserMenuOpen(false);
              }}
              className="hover:bg-warm-100/80 text-darknavy-900 group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors"
            >
              <User className="h-4 w-4 shrink-0 text-slate-500" />
              <span>Profile</span>
            </button>

            <div className="border-warm-200/80 my-1 border-t" />

            {/* Menu Option 3: Log out */}
            <button
              type="button"
              onClick={() => {
                toast.success('Berhasil keluar', {
                  description: 'Sesi administrator berhasil diakhiri.',
                });
                setUserMenuOpen(false);
                navigate('/');
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
              <span>Log out</span>
            </button>
          </div>
        ) : null}

        {/* Trigger Button: Styled like Image 3 with warm palette */}
        <button
          type="button"
          onClick={() => setUserMenuOpen((prev) => !prev)}
          className={cn(
            'border-warm-200 bg-warm-100/70 hover:bg-warm-200/80 hover:border-warm-300 group flex w-full items-center justify-between rounded-2xl border p-2 text-left shadow-2xs transition-all',
            userMenuOpen ? 'ring-accent-500/30 bg-warm-200/90 ring-2' : ''
          )}
          aria-expanded={userMenuOpen}
          aria-label="Menu Profil Administrator"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar className="border-warm-200 h-9 w-9 shrink-0 rounded-xl border shadow-2xs">
              <AvatarFallback className="from-accent-500 flex h-full w-full items-center justify-center rounded-xl bg-linear-to-tr to-amber-500 text-xs font-extrabold text-white">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-darknavy-900 truncate text-xs font-bold sm:text-sm">
                Administrator Utama
              </p>
              <p className="text-2xs truncate text-slate-500 sm:text-xs">
                admin.setwan@tapinkab.go.id
              </p>
            </div>
          </div>
          <ChevronsUpDown className="group-hover:text-darknavy-900 h-4 w-4 shrink-0 text-slate-400 transition-colors" />
        </button>
      </div>
    </div>
  );

  /* ---------------------------------------------------- */
  /* Collapsed Sidebar Content (Image 4)                  */
  /* ---------------------------------------------------- */
  const collapsedContent = (
    <div className="text-darknavy-900 flex h-full w-full flex-col items-center justify-between bg-white py-4">
      <div className="flex flex-col items-center space-y-1.5">
        {/* Toggle Expand Button at the top */}
        {onToggleCollapse ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hover:bg-warm-100 hover:text-darknavy-900 h-9 w-9 rounded-xl text-slate-500"
                aria-label="Buka Sidebar"
              >
                <PanelLeftOpen className="h-4.5 w-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs font-semibold">Buka Sidebar (Expand)</p>
            </TooltipContent>
          </Tooltip>
        ) : null}

        {/* Command Search Icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onSearchFocus}
              className="hover:bg-warm-100 hover:text-darknavy-900 mt-1 h-9 w-9 rounded-xl text-slate-400"
              aria-label="Cari"
            >
              <Command className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs font-semibold">Cari data (/)</p>
          </TooltipContent>
        </Tooltip>

        {/* Subtle Divider */}
        <div className="border-warm-200 my-2.5 w-8 border-t" />

        {/* Collapsed Icon Navigation Stack */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150',
                      isActive
                        ? 'bg-warm-200/80 text-accent-500 shadow-xs'
                        : 'hover:bg-warm-100 hover:text-darknavy-900 text-slate-500'
                    )}
                    aria-label={item.label}
                  >
                    <Icon
                      className={cn('h-4.5 w-4.5', isActive ? 'text-accent-500' : 'text-slate-500')}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs font-bold">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Collapsed Bottom Profile Avatar with shadcn Avatar (Image 3 Squircle Style) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="border-warm-200 h-9 w-9 cursor-pointer rounded-xl border shadow-xs transition-all hover:ring-2 hover:ring-amber-500/30">
            <AvatarFallback className="from-accent-500 flex h-full w-full items-center justify-center rounded-xl bg-linear-to-tr to-amber-500 text-xs font-extrabold text-white">
              AD
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-xs font-bold">Administrator Utama</p>
          <p className="text-2xs text-slate-400">admin.setwan@tapinkab.go.id</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider delayDuration={150}>
      {/* Desktop Persistent Sidebar (Collapsible) */}
      <aside
        className={cn(
          'border-warm-200/90 fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-white shadow-xs transition-all duration-300 ease-in-out lg:flex',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {isCollapsed ? collapsedContent : expandedContent}
      </aside>

      {/* Mobile Drawer Overlay (Always Full Size when opened) */}
      {isOpenMobile ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="bg-darknavy-950/60 fixed inset-0 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Pane */}
          <div className="relative z-10 w-72 max-w-[85vw] flex-1 shadow-2xl">{expandedContent}</div>
        </div>
      ) : null}
    </TooltipProvider>
  );
}

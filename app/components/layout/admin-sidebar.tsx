import * as React from 'react';

import { Form, Link } from 'react-router';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import type { AuthUserPayload } from '~/lib/auth.server';
import { cn } from '~/lib/utils';

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
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from 'lucide-react';

export type AdminTab =
  'overview' | 'aduan' | 'aspirasi' | 'kepuasan' | 'users-dewan' | 'users-moderator';

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  currentUser?: AuthUserPayload;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSearchFocus?: () => void;
}

function getInitials(name: string): string {
  const clean = name.replace(/^(H\.|Dr\.|Hj\.|Drs\.|Ir\.|M\.)\s*/gi, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'AD';
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  currentUser,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onSearchFocus,
}: AdminSidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);

  const isUserManagementActive = activeTab === 'users-dewan' || activeTab === 'users-moderator';
  const [userGroupExpanded, setUserGroupExpanded] = React.useState<boolean | null>(null);
  const isUserGroupOpen = userGroupExpanded ?? isUserManagementActive;

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

  // Determine user details
  const userName = currentUser?.fullName || 'Administrator Utama';
  const userEmail = currentUser?.email || 'admin@siwaday.tapinkab.go.id';
  const userRole = currentUser?.role || 'admin';
  const initials = getInitials(userName);

  const userRoleLabel =
    userRole === 'admin'
      ? 'Administrator Utama'
      : userRole === 'moderator'
        ? 'Moderator Regional'
        : userRole === 'dprd'
          ? 'Anggota DPRD Tapin'
          : userRole === 'dpr'
            ? 'Anggota DPR RI'
            : 'Pengguna';

  // Navigation Items filtered by role
  // Admin: Overview, Aduan, Aspirasi, Kepuasan, Manajemen Pengguna (Dewan, Moderator)
  // Moderator / DPRD / DPR: Overview, Aspirasi
  const isAdmin = userRole === 'admin';

  const baseNavItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Ringkasan Dashboard',
      icon: LayoutDashboard,
      visible: true,
    },
    {
      id: 'aduan' as AdminTab,
      label: 'Aduan Masyarakat',
      icon: Megaphone,
      visible: isAdmin,
    },
    {
      id: 'aspirasi' as AdminTab,
      label: 'Aspirasi Dapil DPRD',
      icon: Landmark,
      visible: true,
    },
    {
      id: 'kepuasan' as AdminTab,
      label: 'Survei Kepuasan CSAT',
      icon: Star,
      visible: isAdmin,
    },
  ];

  const visibleNavItems = baseNavItems.filter((item) => item.visible);

  /* ---------------------------------------------------- */
  /* Expanded Sidebar Content                             */
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
                  className="hover:bg-warm-100 hover:text-darknavy-900 hidden h-8 w-8 rounded-xl text-slate-500 lg:flex"
                  aria-label="Tutup Sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-semibold">Tutup Sidebar (Collapse)</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {/* Mobile Close Button */}
          {onCloseMobile ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              className="hover:bg-warm-100 hover:text-darknavy-900 h-8 w-8 rounded-xl text-slate-500 lg:hidden"
              aria-label="Tutup Menu"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        {/* Search Bar / Command Box */}
        <div className="px-3 py-2">
          <button
            type="button"
            onClick={onSearchFocus}
            className="border-warm-200 bg-warm-50 text-2xs hover:border-warm-300 hover:bg-warm-100/60 group flex w-full items-center justify-between rounded-xl border px-3 py-2 text-slate-400 transition-all"
          >
            <div className="flex items-center gap-2">
              <Command className="group-hover:text-darknavy-900 h-3.5 w-3.5 transition-colors" />
              <span className="truncate">Cari ID tiket, dewan, dll...</span>
            </div>
            <kbd className="border-warm-200 bg-warm-200/50 rounded border px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
              /
            </kbd>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1 px-3 py-2">
          <p className="text-2xs px-2.5 pb-1 font-extrabold tracking-wider text-slate-400 uppercase">
            Menu Utama
          </p>

          {/* Base Navigation Items */}
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile?.();
                }}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-warm-100 text-darknavy-900 font-extrabold shadow-2xs'
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

          {/* Collapsible Manajemen Pengguna (Admin Only, Modeled after shadcn sidebar-07) */}
          {isAdmin ? (
            <Collapsible
              open={isUserGroupOpen}
              onOpenChange={setUserGroupExpanded}
              className="group/collapsible pt-1"
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150',
                    isUserManagementActive
                      ? 'bg-warm-100 text-darknavy-900 font-extrabold shadow-2xs'
                      : 'hover:bg-warm-100/80 hover:text-darknavy-900 text-slate-600'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Users
                      className={cn(
                        'h-4.5 w-4.5 shrink-0 transition-colors',
                        isUserManagementActive
                          ? 'text-accent-500'
                          : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span className="truncate leading-normal">Manajemen Pengguna</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
                      isUserGroupOpen ? 'text-darknavy-900 rotate-90' : ''
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="animate-in fade-in-50 duration-150">
                <div className="border-warm-200 mt-1 ml-4 space-y-1 border-l pl-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('users-dewan');
                      onCloseMobile?.();
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
                      activeTab === 'users-dewan'
                        ? 'bg-accent-500 font-bold text-white shadow-xs'
                        : 'hover:bg-warm-100 hover:text-darknavy-900 text-slate-600'
                    )}
                  >
                    <Landmark className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Kelola Anggota Dewan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('users-moderator');
                      onCloseMobile?.();
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
                      activeTab === 'users-moderator'
                        ? 'bg-accent-500 font-bold text-white shadow-xs'
                        : 'hover:bg-warm-100 hover:text-darknavy-900 text-slate-600'
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Kelola Moderator</span>
                  </button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : null}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="border-warm-200/80 relative border-t p-3" ref={userMenuRef}>
        {/* Floating User Popup Menu */}
        {userMenuOpen ? (
          <div className="border-warm-200 animate-in fade-in zoom-in-95 absolute right-3 bottom-full left-3 z-50 mb-2 overflow-hidden rounded-2xl border bg-white p-1.5 shadow-xl transition-all duration-150">
            {/* Header: User Info */}
            <div
              className="hover:bg-warm-100/70 flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors"
              onClick={() => {
                toast.info('Profil Pengguna', {
                  description: `${userName} • ${userEmail} (${userRoleLabel})`,
                });
                setUserMenuOpen(false);
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar className="border-warm-200 h-9 w-9 shrink-0 rounded-xl border shadow-2xs">
                  <AvatarFallback className="from-accent-500 flex h-full w-full items-center justify-center rounded-xl bg-linear-to-tr to-amber-500 text-xs font-extrabold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-darknavy-900 truncate text-sm font-bold">{userName}</p>
                  <p className="truncate text-xs text-slate-500">{userEmail}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </div>

            <div className="border-warm-200/80 my-1 border-t" />

            {/* Menu Option 1: Status */}
            <button
              type="button"
              onClick={() => {
                toast.info('Status Otoritas Akun', {
                  description: `Peran: ${userRoleLabel}. Berwenang mengelola data daerah Kabupaten Tapin.`,
                });
                setUserMenuOpen(false);
              }}
              className="hover:bg-warm-100/80 text-darknavy-900 group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors"
            >
              <Sparkles className="text-accent-500 h-4 w-4 shrink-0" />
              <span>{userRoleLabel}</span>
            </button>

            {/* Menu Option 2: Profile Info */}
            <button
              type="button"
              onClick={() => {
                toast.info('Pengaturan Profil', {
                  description: `Terdaftar sebagai ${userRoleLabel} (${userEmail}).`,
                });
                setUserMenuOpen(false);
              }}
              className="hover:bg-warm-100/80 text-darknavy-900 group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors"
            >
              <User className="h-4 w-4 shrink-0 text-slate-500" />
              <span>Detail Akun</span>
            </button>

            <div className="border-warm-200/80 my-1 border-t" />

            {/* Menu Option 3: Log out with AlertDialog Confirmation */}
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false);
                setIsLogoutDialogOpen(true);
              }}
              className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 shrink-0 text-red-500 transition-transform group-hover:-translate-x-0.5" />
              <span>Keluar dari Sistem</span>
            </button>
          </div>
        ) : null}

        {/* User Card Trigger Button */}
        <button
          type="button"
          onClick={() => setUserMenuOpen((prev) => !prev)}
          className="hover:bg-warm-100/80 group flex w-full items-center justify-between rounded-2xl p-1.5 text-left transition-colors"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar className="border-warm-200 h-9 w-9 shrink-0 rounded-xl border shadow-2xs">
              <AvatarFallback className="from-accent-500 flex h-full w-full items-center justify-center rounded-xl bg-linear-to-tr to-amber-500 text-xs font-extrabold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-darknavy-900 truncate text-xs font-bold sm:text-sm">{userName}</p>
              <p className="text-2xs truncate text-slate-500 sm:text-xs">{userRoleLabel}</p>
            </div>
          </div>
          <ChevronsUpDown className="group-hover:text-darknavy-900 h-4 w-4 shrink-0 text-slate-400 transition-colors" />
        </button>
      </div>
    </div>
  );

  /* ---------------------------------------------------- */
  /* Collapsed Sidebar Content                            */
  /* ---------------------------------------------------- */
  const collapsedContent = (
    <div className="text-darknavy-900 flex h-full w-full flex-col items-center justify-between bg-white py-4">
      <div className="flex flex-col items-center space-y-1.5">
        {/* Toggle Expand Button */}
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
          {visibleNavItems.map((item) => {
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

          {/* Collapsed Icon for User Management */}
          {isAdmin ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onTabChange('users-dewan')}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150',
                    isUserManagementActive
                      ? 'bg-warm-200/80 text-accent-500 shadow-xs'
                      : 'hover:bg-warm-100 hover:text-darknavy-900 text-slate-500'
                  )}
                  aria-label="Manajemen Pengguna"
                >
                  <Users
                    className={cn(
                      'h-4.5 w-4.5',
                      isUserManagementActive ? 'text-accent-500' : 'text-slate-500'
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-bold">Manajemen Pengguna (Dewan / Moderator)</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>

      {/* Collapsed Bottom Profile Avatar with Logout Confirmation */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setIsLogoutDialogOpen(true)}
            className="cursor-pointer"
            aria-label="Profil & Keluar"
          >
            <Avatar className="border-warm-200 h-9 w-9 rounded-xl border shadow-xs transition-all hover:ring-2 hover:ring-amber-500/30">
              <AvatarFallback className="from-accent-500 flex h-full w-full items-center justify-center rounded-xl bg-linear-to-tr to-amber-500 text-xs font-extrabold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-xs font-bold">{userName}</p>
          <p className="text-2xs text-slate-400">Klik untuk keluar</p>
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

      {/* Mobile Drawer Overlay */}
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

      {/* Logout Confirmation Dialog (shadcn AlertDialog) */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="border-warm-200 rounded-3xl bg-white p-6 shadow-2xl sm:max-w-md">
          <AlertDialogHeader className="space-y-2 text-center sm:text-left">
            <AlertDialogTitle className="text-darknavy-900 text-lg font-black">
              Konfirmasi Keluar dari Sistem
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 sm:text-sm">
              Apakah Anda yakin ingin mengakhiri sesi aktif ini? Anda harus memasukkan kredensial
              akun kembali untuk mengakses dashboard SI-WADAY.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="border-warm-200 rounded-xl text-xs font-bold sm:text-sm">
              Batal
            </AlertDialogCancel>
            <Form method="post" action="/auth/logout">
              <Button
                type="submit"
                variant="destructive"
                className="w-full rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 sm:w-auto sm:text-sm"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Ya, Keluar
              </Button>
            </Form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

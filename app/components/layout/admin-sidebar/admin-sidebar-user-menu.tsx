import * as React from 'react';

import { toast } from 'sonner';

import type { AuthUserPayload } from '@/lib/auth.server';
import { cn, getInitials } from '@/lib/utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { ChevronRight, ChevronsUpDown, LogOut, Sparkles, User } from 'lucide-react';

interface AdminSidebarUserMenuProps {
  currentUser?: AuthUserPayload;
  isCollapsed?: boolean;
  onOpenLogoutDialog: () => void;
}

export function AdminSidebarUserMenu({
  currentUser,
  isCollapsed = false,
  onOpenLogoutDialog,
}: AdminSidebarUserMenuProps) {
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

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onOpenLogoutDialog}
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
    );
  }

  return (
    <div className="border-warm-200/80 relative border-t p-3" ref={userMenuRef}>
      {/* Floating User Popup Menu */}
      {userMenuOpen ? (
        <div className="border-warm-200 animate-in fade-in zoom-in-95 absolute right-3 bottom-full left-3 z-50 mb-2 overflow-hidden rounded-2xl border bg-white p-1.5 shadow-xl transition-all duration-150">
          {/* Header: User Info + Chevron Right */}
          <div
            className="hover:bg-warm-100/70 flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors"
            onClick={() => {
              toast.info('Profil Pengguna', {
                description: `${userRoleLabel} • ${userEmail}`,
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
                description: 'Kelola informasi identitas & akun pengguna.',
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
              setUserMenuOpen(false);
              onOpenLogoutDialog();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
            <span>Log out</span>
          </button>
        </div>
      ) : null}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setUserMenuOpen((prev) => !prev)}
        className={cn(
          'border-warm-200 bg-warm-100/70 hover:bg-warm-200/80 hover:border-warm-300 group flex w-full items-center justify-between rounded-2xl border p-2 text-left shadow-2xs transition-all',
          userMenuOpen ? 'ring-accent-500/30 bg-warm-200/90 ring-2' : ''
        )}
        aria-expanded={userMenuOpen}
        aria-label="Menu Profil Pengguna"
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
  );
}
